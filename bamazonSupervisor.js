var inquirer = require("inquirer");
var mysql = require("mysql");
var clear = require("clear");

// Setup connection info for mysql database
var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "bananazone11",
    database: "bamazon_db"
});
// Connect to the database
con.connect(function(err) {
    if (err) throw err;
    mainMenu();   
});
// Main Menu for the supervisor, displays 2 options to choose from and a Quit option if they are done
function mainMenu() {
    // Prompt the choices
    inquirer.prompt([
        {
            type: "list",
            message: "Menu Options:",
            choices: ["View Product Sales by Department", "Create New Department", "Quit"],
            name: "choice"
        }
    ]).then(function(response){
        // Clear the screen and then run the appropriate function based on user input
        clear();
        switch (response.choice) {
            case "View Product Sales by Department":
                displayProductSales();
                break;
            case "Create New Department":
                createNewDepartment();
                break;
            case "Quit":
                con.end();
                break;
        }
    })
}
// Function that displays all departments, their overhead costs, total sales, and total profits
function displayProductSales() {
    // Get the necessary data from the database
    con.query("SELECT departments.department_id, departments.department_name, "+
                "departments.over_head_costs, SUM(products.product_sales) AS total_sales "+
                "FROM products INNER JOIN departments "+
                "ON products.department_name = departments.department_name "+
                "GROUP BY products.department_name "+
                "ORDER BY departments.department_id", function(err, resp){
        // Display the data in a table
        console.log("dept id |Department Name     |Over Head Costs     |Product Sales |Total Profit");
        console.log("--------|--------------------|--------------------|--------------|------------");
        for (var i=0; i<resp.length; i++) {
            var totalProfit = resp[i].total_sales - resp[i].over_head_costs;
            var idSpaces = "";
            var nameSpaces = "";
            var costSpaces = "";
            var salesSpaces = "";
            for (var j=0; j<(8 - resp[i].department_id.toString().length); j++) {idSpaces += " "}
            for (var j=0; j<(20 - resp[i].department_name.length); j++) {nameSpaces += " "}
            for (var j=0; j<(20 - resp[i].over_head_costs.toString().length); j++) {costSpaces += " "}
            for (var j=0; j<(14 - resp[i].total_sales.toString().length); j++) {salesSpaces += " "}
            console.log(resp[i].department_id.toString() + idSpaces + "|" + resp[i].department_name + nameSpaces + "|" +
                        resp[i].over_head_costs.toString() + costSpaces + "|" + resp[i].total_sales.toString() + salesSpaces + "|" + 
                        totalProfit);
        }
        // Return to main menu
        mainMenu();
    });
}
// Function that allows user to create a new department and an item in that department
function createNewDepartment() {
    // Create and fill array with all department names to use later for error checking
    var deptArray = [];
    con.query("SELECT * FROM departments", function(err, resp) {
        for (var i=0; i<resp.length; i++) { deptArray.push(resp[i].department_name.toLowerCase()) }
        // Prompt the user for information about the new department
        inquirer.prompt([
            {
                type: "input",
                message: "Department Name:",
                validate: function(input) { // Don't allow duplicate departments
                    return (deptArray.indexOf(input.toLowerCase()) < 0);
                },
                name: "name"
            },
            {
                type: "number",
                message: "Over Head Costs:",
                name: "costs",
                validate: function (input) {
                    return (input > 0);
                }
            }
        ]).then(function(response){
            var deptName = response.name;
            var deptCosts = parseInt(response.costs);
            // Create the new department in the database
            con.query("INSERT INTO departments (department_name, over_head_costs) VALUES ('" +
                        toTitleCase(deptName) + "', " +
                        deptCosts + ")",
            function(err, resp) {
                console.log(response.name + " department created, create first item.");
                // Prompt the user for information about the first item in the new department
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Item Name:",
                        name: "name"
                    },
                    {
                        type: "number",
                        message: "Item Cost:",
                        name: "price",
                        validate: function (input) {
                            return (input > 0);
                        }
                    },
                    {
                        type: "number",
                        message: "Item Inventory:",
                        name: "quantity",
                        validate: function (input) {
                            return (input > 0 && input%1 === 0);
                        }
                    }
                ]).then(function(response){ 
                    // Create the new item in the database
                    con.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" +
                        toTitleCase(response.name) + "', '" +
                        toTitleCase(deptName) + "', " +
                        parseInt(response.price) + ", " +
                        parseInt(response.quantity) + ")",
                    function(err, resp) {
                        console.log("Addition successful. " + response.name + " has been added to inventory");
                        // Return to menu
                        mainMenu();
                    });
                })
            }); 
        })
    })
}
// Function that returns a string with title casing
function toTitleCase(str) {
    return str.replace(/([^\W_]+[^\s-]*) */g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}