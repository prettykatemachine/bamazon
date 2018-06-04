var mysql = require("mysql");
var inq = require("inquirer");
var table = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  start();
});

function start() {
  console.log("BAMazon Manager Portal");
  prompt();
}

function prompt() {
  inq
    .prompt({
      name: "managerPortal",
      type: "rawlist",
      message: "Please select a menu option:",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "Exit"
      ]
    })
    .then(function(answer) {
      if (answer.managerPortal === "View Products for Sale") {
        showItems();
      } else if (answer.managerPortal === "View Low Inventory") {
        lowInv();
      } else if (answer.managerPortal === "Add to Inventory") {
        addInv();
      } else if (answer.managerPortal === "Add New Product") {
        newProduct();
      } else if (answer.managerPortal === "Exit") {
        exit();
      }
    });
}

function printTable(res) {
  var items = [];
  var headings = [
    "Item ID",
    "Product",
    "Department",
    "Price",
    "Quantity in Stock"
  ];

  for (var i = 0; i < res.length; i++) {
    items.push([
      res[i].item_id,
      res[i].product_name,
      res[i].department_name,
      res[i].price,
      res[i].stock_quantity
    ]);
  }
  console.table(headings, items);
}
