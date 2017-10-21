var inquirer = require("inquirer");
var mysql = require ("mysql");
var promise-mysql = require("promise-mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password:"password",
    database: "bamazon"
});

// global variable which stores array of strings, set by readInventory()
var inventory = [];

// run as NOT part of prmise
// OR use promise-mysql
var readInventory = function() {
	// var query = ;

			console.log("in inventory read")

	// returns a callback which will produce the inventory
	connection.query(
		"SELECT item_id, product_name, price FROM products", 
		function(err, rows, fields) {
			if (err) throw err;
			console.log(rows)
			//return an array of strings
			var result = []
			res.forEach(function(item) {
				result.push(`${item.item_id}) ${item.product_name} || $${item.price}`)
			})
			setInventory(result);
			console.log("in readInventory callback: " + inventory);
		});
	
}

function setInventory(value) {
  inventory = value;
  console.log(inventory);
}

var promptItemSelection = function() {
	// var choices = readInventory();
	console.log("in item selection")
	console.log(inventory);
	// console.log("in prompt selection")
	return inquirer.prompt({
		// Display all of the items available for sale. 
		// Include the ids, names, and prices of products for sale.
		type: "rawlist",
		message: "What would you like to buy? ",
		choices: inventory,
		name: "selected_item"
	})
}

var run = function() {

	var allCommands = Promise.resolve();

	allCommands = allCommands
	.then( () => promptItemSelection() )
	.then( answer => console.log(answer) )

	// connection.end()
}


connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id: " + connection.threadId);

	// console.log(inventory);
	readInventory();
	// console.log(inventory);
	run();
	
})