var mysql = require("mysql");
var inq = require("inquirer");
var table = require("console.table");
var itemID = 0;
var itemQuantity = 0;
var selected;
var message;

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "root",
	database: "bamazonDB"
});

connection.connect(function(err) {
	if (err) throw err;
});

function start() {
	console.log("\nThank you for shopping with BAMazon!\n");
	inq.prompt(
		{
			name: "browse",
			type: "confirm",
			message: "Check out our available products!"
		}
	).then(function(answer) {
		if (answer.browse) {
			showItems();
			setTimeout(promptUser, 1000);
		} else {
			exit();
		}
	});
}

function showItems() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		console.log("\nAll Products\n".underline);
		var products = [];
		for (var i = 0; i < res.length; i++) {
			products.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
		}
		var headings = ["Item ID", "Product", "Department", "Price ($)", "Quantity in Stock"];
		console.table(headings, products);
	});
}

function promptUser() {
	inq.prompt([
		{
			name: "id",
			type: "input",
			message: "Please enter the ID number of the item you'd like to purchase.",
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
			message: "Please enter the quantity of the item you'd like to purchase.",
			validate: function(value) {
				if (isNaN(value)) {
					console.log("\nPlease enter a valid number.\n");
				} else {
					return true;
				}
			}
		}
	]).then(function(answer) {
		itemID = answer.id;
		itemQuantity = answer.quantity;

		connection.query("SELECT * FROM products WHERE item_id=" + itemID, function(err, res) {
			selected = res[0];

			if (itemQuantity > selected.stock_quantity && selected.stock_quantity > 1) {
				message = "\nSorry, we only have " + selected.stock_quantity + " " + selected.product_name + "s available.\n";
				console.log(message);
				promptUser();
			} else if (itemQuantity > selected.stock_quantity && selected.stock_quantity === 1) {
				message = "\nSorry, we only have 1 " + selected.product_name + " available.\n";
				console.log(message);
				promptUser();
			} else if (itemQuantity > selected.stock_quantity && selected.stock_quantity < 1) {
				message = "\nSorry, " + selected.product_name + " is out of stock.\n";
				console.log(message);
				promptUser();
			} else if (+itemQuantity === 1) {
				message = "\nYou are purchasing 1 " + selected.product_name + ".";
				buyProduct();
			} else {
				message = "\nYou are purchasing " + itemQuantity + " " + selected.product_name + "s.";
				buyProduct();
			}
		});
	});
}

function buyProduct() {
	inq.prompt(
		{
			name: "buy",
			type: "confirm",
			message: message + " Would you like to check out?"
		}
	).then(function(answer) {
		if (answer.buy) {
			connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [itemQuantity, itemID], function(err, res) {
				if (err) throw err;
				var totalmessage = "\nYour total is $" + (itemQuantity * selected.price) + "\n";
				console.log(totalmessage);
				setTimeout(buyDifferent, 1500);
			});
		} else {
			buyDifferent();
		}
	});
}

function buyDifferent() {
	inq.prompt(
		{
			name: "differentItem",
			type: "confirm",
			message: "Would you like to purchase a different item?"
		}
	).then(function(answer) {
		if (answer.differentItem) {
			showItems();
			setTimeout(promptUser, 1000);
		} else {
			exit();
		}
	});
}

function exit() {
	console.log("\nWe appreciate your business with BAMazon!\n");
	connection.end();
}

