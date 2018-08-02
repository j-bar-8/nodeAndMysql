// GLOBAL VARIABLES
// =====================================================================
var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_DB"
});

// FUNCTIONS
// =====================================================================
function displayAllProducts () {
    connection.query("SELECT * FROM products", function (err,res) {
        if (err) throw err;
        // console.log(res);
        console.log("ID# || Item || Price (usd) || Number Available");
        console.log("==================================================");
        
        for (var i=0; i<res.length; i++) {
            console.log(res[i].id + " || " + res[i].product_name + " || " +  res[i].price + " || " + res[i].stock_quantity);
        }
    })
}

// PROCESS
// =====================================================================
connection.connect(function(err) {
    if (err) throw err;
    // console.log("Connected to Database");
    displayAllProducts();
})