var inquirer = require("inquirer");
var mysql = require("mysql");
var clear = require("clear");
var keys = require("./keys.js");
var deptArray = [];
// Setup connection info for mysql database
var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: keys.user,
    password: keys.pass,
    database: "bamazon_db"
});
// Connect to the database
con.connect(function(err) {
    if (err) throw err;
    mainMenu();   
});
// Main Menu for the manager, displays 4 options to choose from and a Quit option if they are done
function mainMenu() {
    con.query("SELECT * FROM products", function(err, resp){
        // Array of created departments to be used for error checking
        for (var i=0; i<resp.length; i++) {deptArray.push(resp[i].department_name.toLowerCase())}

        // Prompt the choices
        inquirer.prompt([
            {
                type: "list",
                message: "Menu Options:",
                choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
                name: "choice"
            }
        ]).then(function(response){
            // Clear the screen and then run the appropriate function based on user input
            clear();
            switch (response.choice) {
                case "View Products":
                    displayProducts();
                    break;
                case "View Low Inventory":
                    displayLowInventory();
                    break;
                case "Add to Inventory":
                    addToInventory();
                    break;
                case "Add New Product":
                    addNewProduct();
                    break;
                case "Quit":
                    con.end();
                    break;
            }
        })
    });
}
// Display inventory
function displayProducts() {
    con.query("SELECT * FROM products", function(err, resp){
        prettyDisplay(resp);
        // Return to menu
        mainMenu();
    });
}
// Display inventory of all items with stock_quantity less than 5
function displayLowInventory() {
    con.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, resp){

        console.log("Here are all the products that are almost sold out:")
        prettyDisplay(resp);
        // Return to menu
        mainMenu();
    });
}
// Allow the user to add to the inventory amount of existing items
function addToInventory() {
    con.query("SELECT * FROM products", function(err, resp){
        prettyDisplay(resp);
        // Prompt the user to choose an id number of a product they would like to increase the inventory of
        // as well as the amount they would like to increase the inventory by
        inquirer.prompt([
            {
                type: "number",
                message: "Type the ID of the item you'd like to increase inventory for:",
                name: "id",
                // Make sure the id number exists
                validate: function (input) {
                    return (input >= 1 && input <= resp.length && input%1 === 0);
                }
            },
            {
                type: "number",
                message: "How many items would you like to add to inventory?",
                name: "quantity",
                validate: function (input) {
                    return (input > 0 && input%1 === 0);
                }
            }
        ]).then(function(response){
            con.query("SELECT * FROM products WHERE id=" + response.id.toString(), function(err, resp){
                var newStock = resp[0].stock_quantity + parseInt(response.quantity);
                // Change the inventory amount in the database
                con.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: newStock
                    },
                    {
                        id: response.id
                    }
                ], function(err, res) {
                    console.log("Your addition was successful, there are now "+newStock+" in stock.");
                    // Return to menu
                    mainMenu();
                });             
            });
        });
    });
}
// Allow the user to add a new product to the inventory table
function addNewProduct() {
    // Prompt the user for information about the product they would like to add
    console.log("Fill out the information for the product you'd like to add.")
    inquirer.prompt([
        {
            type: "input",
            message: "Product name:",
            name: "name"
        },
        {
            type: "input",
            message: "Department name:",
            validate: function(input) { // Don't allow managers to create new departments
                if (deptArray.indexOf(input.toLowerCase()) >= 0) {
                    return true;
                }
                else {

                    console.log(" does not exist. Only Supervisors can add departments.");
                    return false;
                    
                }
            },
            name: "department"
        },
        {
            type: "number",
            message: "Price:",
            name: "price",
            validate: function (input) {
                return (input > 0);
            }
        },
        {
            type: "number",
            message: "Quantity:",
            name: "quantity",
            validate: function (input) {
                return (input > 0 && input%1 === 0);
            }
        }
    ]).then(function(response){
        // Create a new row with inputted information
        con.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" +
                    toTitleCase(response.name) + "', '" +
                    toTitleCase(response.department) + "', " +
                    parseInt(response.price) + ", " +
                    parseInt(response.quantity) + ")",
        function(err, resp) {
            console.log("Addition successful. " + response.name + " has been added to inventory");
            // Return to menu
            mainMenu();
        });
    })
}
// Function to display the product table nicely
function prettyDisplay(resp) {
    console.log("id      |Product             |Department          |Price   |In Stock");
    console.log("--------|--------------------|--------------------|--------|--------");
    for (var j=0; j<resp.length; j++) {
        var idSpaces = "";
        var prodSpaces = "";
        var deptSpaces = "";
        var priceSpaces = "";
        for (var i=0; i<(8 - resp[j].id.toString().length); i++) {idSpaces += " "}
        for (var i=0; i<(20 - resp[j].product_name.length); i++) {prodSpaces += " "}
        for (var i=0; i<(20 - resp[j].department_name.length); i++) {deptSpaces += " "}
        for (var i=0; i<(8 - resp[j].price.toString().length); i++) {priceSpaces += " "}
        console.log(resp[j].id.toString() + idSpaces + "|" + resp[j].product_name + prodSpaces + "|" +
                    resp[j].department_name + deptSpaces + "|" + resp[j].price + priceSpaces + "|" + 
                    resp[j].stock_quantity);
    }
}
// Function that returns a string with title casing
function toTitleCase(str) {
    return str.replace(/([^\W_]+[^\s-]*) */g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}