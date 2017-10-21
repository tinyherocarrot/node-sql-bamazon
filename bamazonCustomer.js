var inquirer = require("inquirer");
// var mysql = require ("mysql");
var mysql = require("promise-mysql");
// global variable which stores array of strings, set by readInventory()
// var inventory = [];

var connection;

mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password:"password",
    database: "bamazon"
})
.then( conn => { // read inventory (QUERY ONLY)
    connection = conn;
    console.log("IN THE FIRST THEN")
    return connection.query("SELECT item_id, product_name, price FROM products");

}).then( (err, rows) => { // read inventory (CONSTRUCTING DISPLAYABLE INVENTORY)

	if (err) throw err;
	// console.log(rows)
	console.log("IN THE SECOND THEN")
	//return an array of strings
	var result = []
	rows.forEach(function(item) {
		result.push(`${item.item_id}) ${item.product_name} || $${item.price}`)
	})
	console.log("in readInventory callback: ");
	console.log( result);

	connection.end();

	return result;
		
}).then( result => {
	console.log("IN THE THIRD THEN")
	console.log(result);
	return inquirer.prompt({
	
		// Display all of the items available for sale. 
		// Include the ids, names, and prices of products for sale.
		type: "rawlist",
		message: "What would you like to buy? ",
		choices: result,
		name: "selected_item"
	})
}).then( answer => {
	console.log("IN THE 4TH THEN")
	console.log(answer)

})
.catch(function(error){
    if (connection && connection.end) connection.end();
    //logs out the error
    console.log(error);
});


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


var promptItemSelection = function(inventory) {
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


// connection.connect(function(err) {
// 	if (err) throw err;
// 	console.log("connected as id: " + connection.threadId);

// 	// console.log(inventory);
// 	readInventory();
// 	// console.log(inventory);
// 	run();
	
// })