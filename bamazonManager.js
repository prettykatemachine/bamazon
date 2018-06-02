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