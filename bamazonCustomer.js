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
    getOrder();
}

function getOrder () {
    inquirer
    .prompt({
        name: "id",
        type: "input",
        message: "What is the id # of the item you would like to purchase?",
        validate: function(value) {
            if (isNaN(value)=== false && value > 0) {
                return true;
            }
            return false;
        }
    })
    .then(function(answer) {
        console.log("Buy item: " + answer.id);
    })
}
// PROCESS
// =====================================================================
connection.connect(function(err) {
    if (err) throw err;
    // console.log("Connected to Database");
    displayAllProducts();
})