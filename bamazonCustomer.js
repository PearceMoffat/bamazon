var inquirer = require("inquirer");
var mysql = require("mysql");
var clear = require("clear");
var keys = require("./keys.js");
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
    prompt();   
});
// Function that prompts the user for their choice of items
function prompt() {
    con.query("SELECT * FROM products", function(err, resp){
        // Display the table
        prettyDisplay(resp);
        // Ask the user for an id number and quantity they'd like to buy
        inquirer.prompt([
            {
                type: "number",
                message: "Type the ID of the item you'd like to buy:",
                name: "id",
                // Make sure the id number exists
                validate: function (input) {
                    return (input >= 1 && input <= resp.length && input%1 === 0);
                }
            },
            {
                type: "number",
                message: "How many items would you like? (0 to quit)",
                name: "quantity",
                validate: function (input) {
                    return (input >= 0 && input%1 === 0);
                }
            }
        ]).then(function(response){
            // Check if user quit
            if (parseInt(response.quantity) === 0) { con.end(); }
            else {
                // Select item from mysql table with matching id
                con.query("SELECT * FROM products WHERE id=" + response.id.toString(), function(err, resp){
                    // Check if there is enough of that item in stock
                    if (response.quantity > resp[0].stock_quantity) {
                        clear();
                        console.log("ERROR: Not enough items in stock");
                        prompt();
                    }
                    // If enough stock is available, decrease stock by amount user bought, then display price to user
                    else {
                        var totalPrice = response.quantity * resp[0].price;
                        var newStock = resp[0].stock_quantity - parseInt(response.quantity);
                        var newSales = resp[0].product_sales + totalPrice;
                        // Change the stock and sales on the database
                        con.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                product_sales: newSales,
                                stock_quantity: newStock
                            },
                            {
                                id: response.id
                            }
                        ], function(err, res) {
                            clear();
                            console.log("Your purchase was successful, your total is $" + totalPrice + ".00");
                            prompt();
                        });
                    }
                })
            }
        });
    });   
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