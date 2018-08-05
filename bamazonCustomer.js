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
var id = "";
var quantityToBuy = 0;
function Product(id, product, price, department, quantity) {
    this.id = id;
    this.product_name = product;
    this.price = price;
    this.department_name = department;
    this.stock_quantity = quantity;
}
var newProduct = {};
var totalPrice = 0.00
var stockQuantity = 0

// FUNCTIONS
// =====================================================================
function displayAllProducts () {
    id = "";
    quantityToBuy = 0;
    newProduct = {};
    totalPrice = 0.00
    stockQuantity = 0
    
    connection.query("SELECT * FROM products", function (err,res) {
        if (err) throw err;
        // console.log(res);
        console.log("ID# || Item || Price (usd) || Number Available");
        console.log("==================================================");
        
        for (var i=0; i<res.length; i++) {
            console.log(res[i].id + " || " + res[i].product_name + " || " +  res[i].price + " || " + res[i].stock_quantity);
        }
    })
    setTimeout(getOrder, 500);
}

function getOrder () {
    inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "What is the id# of the product you would like to purchase? ",
        validate: function(value) {
          if (isNaN(value) === false && value > 0) {
            return true;
          }
          return false;
        }
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like?",
        validate: function(value) {
          if (isNaN(value) === false && value > 0) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
        id = answer.id;
        quantityToBuy = answer.quantity;
        // console.log("Buy " + quantity + " of product #: " + product);
        createProductObject();
        
    })
}

function createProductObject () {
    connection.query("SELECT * FROM products WHERE id =?",[id], function(err, res) {
        if (err) throw err;
        // console.log(res[0].id);
        newProduct = new Product (res[0].id, res[0].product_name, res[0].price, res[0].department_name, res[0].stock_quantity);
        // console.log(newProduct.id + newProduct.product_name + newProduct.price + newProduct.department_name + newProduct.stock_quantity);
        totalPrice = newProduct.price * quantityToBuy;
        stockQuantity = newProduct.stock_quantity - quantityToBuy;
        // console.log(newProduct.price + quantityToBuy + newProduct.stock_quantity)
        // console.log(totalPrice);
        // console.log(stockQuantity);
        placeOrder();
    })
}

function placeOrder () {
    if (newProduct.stock_quantity < quantityToBuy) {
        console.log("We only have " + newProduct.stock_quantity);
        console.log("Pick a different amount");
        setTimeout(displayAllProducts, 1000);
    } else {
        inquirer.prompt({
            name: "action", 
            type: "list",
            message: "Your Total is $" + totalPrice,
            choices: [
                "Checkout",
                "Change Order",
                "Leave"
            ]
        }) .then(function(answer) {
            switch (answer.action) {
                case "Checkout":
                    checkout();
                    break;
                case "Change Order":
                    displayAllProducts();
                    break;
                case "Leave":
                    console.log("Goodbye!")
                    connection.end();
    
            }
        })
    }
    
}
function checkout () {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: stockQuantity
          },
          {
            id: id
          }
        ],
        function(err, res) {
            if (err) throw err; 
            inquirer.prompt({
                name: "action", 
                type: "list",
                message: "Your order was placed",
                choices: [
                    "Continue Shopping",
                    "Leave"
                ]
            }) .then(function(answer) {
                switch (answer.action) {
                    case "Continue Shopping":
                        displayAllProducts();
                        break;
                    case "Leave":
                        console.log("Goodbye!")
                        connection.end();
        
                }
            })
        }
      );

}

// PROCESS
// =====================================================================
connection.connect(function(err) {
    if (err) throw err;
    // console.log("Connected to Database");
    inquirer.prompt({
        name: "action", 
        type: "list",
        message: "Welcome to Bamazon!",
        choices: [
            "View Products",
            "Leave"
        ]
    }) .then(function(answer) {
        switch (answer.action) {
            case "View Products":
                displayAllProducts();
                break;

            case "Leave":
                console.log("Goodbye!")
                connection.end();

        }
    })
})