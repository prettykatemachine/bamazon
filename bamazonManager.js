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
function showItems() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		console.log("\nAll Products\n");
		printTable(res);
		setTimeout(menu, 1000);
	});
}
function menu() {
	inq.prompt(
		{
			name: "menu",
			type: "confirm",
			message: "Enter Manager Portal"
		}
	).then(function(answer) {
		if (answer.menu) {
			prompt();
		} else {
			exit();
		}
	});
}
function lowInv() {
	connection.query("SELECT * FROM products WHERE stock_quantity < 20", function(err, res) {
		if (err) throw err;
		if (res.length === 0) {
			console.log("\nThere are no items low in stock.\n");
		} else {
			console.log("\nLow Inventory\n");
			printTable(res);
			setTimeout(menu, 1000);
		}
	});
}
function addInv() {
	var selected;

	inq.prompt([
		{
			name: "itemID",
			type: "input",
			message: "Please enter the ID number of the item you'd like to update.",
			validate: function(value) {
				if (value <= 0 || isNaN(value)) {
					console.log("\nPlease enter a valid item ID.\n");
				} else {
					return true;
				}
			}
		},
		{
			name: "quantity",
			type: "input",
			message: "How many units of this item would you like to add?",
			validate: function(value) {
				if (value <= 0 || isNaN(value)) {
					console.log("\nPlease enter a valid number.\n");
				} else {
					return true;
				}
			}
		}
	]).then(function(answer) {
		connection.query("SELECT * FROM products WHERE item_id = ?",[answer.itemID], function(err, res) {
			if (err) throw err;
			selected = res[0]; 
		});

		connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?", [answer.quantity, answer.itemID], function(err, res) {
			if (err) throw err;
			console.log("\nThe inventory has been successfully updated!\n");

			inq.prompt(
				{
					name: "addAnother",
					type: "confirm",
					message: "Would you like to update another item?"
				}
			).then(function(answer) {
				if (answer.addAnother) {
					addInv();
				} else {
					menu();
				}
			});
		});
	});
}

function newProduct() {
	inq.prompt([
		{
			name: "name",
			type: "input",
			message: "Please enter the product name:"
		},
		{
			name: "dept",
			type: "input",
			message: "Please enter the department name:"
		},
		{
			name: "price",
			type: "input",
			message: "Please enter the product's price:"
		},
		{
			name: "quantity",
			type: "input",
			message: "Please enter the quantity of the product:"
		}
	]).then(function(answer) {
		connection.query("INSERT INTO products SET ?",
		{
			product_name: answer.name,
			department_name: answer.dept,
			price: answer.price,
			stock_quantity: answer.quantity
		},
		function(err, res) {
			if (err) throw err;
			var message = "\n" + answer.name + " was successfully added to the inventory!\n";
			console.log(message);
			menu();
		});
	});
}


function exit() {
	console.log("\nSession ended.\n");
	connection.end();
}




