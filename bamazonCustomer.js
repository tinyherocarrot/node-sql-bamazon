var inquirer = require("inquirer");
var mysql = require ("mysql");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password:"password",
    database: "bamazon"
});

// main function
// readInventory >> promptItemSelection >> promptItemQuantity >> updateItemQuantity
var run = function() {

	// call readInventory() to begin chain of calls
	readInventory();
}


var readInventory = function() {
	
	connection.query(
		"SELECT item_id, product_name, price FROM products", 
		function(err, res) {
			if (err) throw err;
			
			// construct inventory (array of strings) with name of each product and prices
			var result = []
			res.forEach(function(item) {
				result.push(` ${item.product_name} | $${item.price}`)
			})
			
			promptItemSelection(result);

		}
	);
}

// inquirer prompt user to choose an item to purchase
var promptItemSelection = function(inventory) {
	
	inquirer.prompt(
	{
		// Displays all of the items available for sale:
		// the ids, names, and prices of products for sale.
		type: "rawlist",
		message: "What would you like to buy? ",
		choices: inventory,
		name: "selected_item",
		pageSize: 12
	}
		).then( ans => {

			// clip name of the selected item
			var item = ans.selected_item.split("|")[0].trim();

			promptItemQuantity(item);
		})
}

// inquirer prompt how many of the selected item they would like to buy
var promptItemQuantity = function(selected_item) {
	inquirer.prompt([
	{
		type: "input",
		message: "How many would you like to buy?",
		name: "selected_quantity"
	}
		]).then( ans => {

			updateItemQuantity(selected_item, ans.selected_quantity);			
		
		})
}

// update stock of selected item
var updateItemQuantity = function(selected_item, selected_quantity) {

	var query = connection.query(
		"SELECT stock_quantity, price FROM products WHERE product_name= ? ", 
		[selected_item],
		function(err, res) {
			if (err) throw err;
			var stock = res[0].stock_quantity;

			// if item is out of stock, send message to user
			if (stock <= 0) {
				console.log(`This item is out of stock. `);
				
				// then return user to purchase menu
				run();
			}

			// if stock is sufficient
			if (stock >= selected_quantity) {

				// calculate new stock
				var new_stock = (stock - selected_quantity);
				var purchase_total = (selected_quantity * res[0].price);

				// and update db with new stock
				connection.query(
					"UPDATE products SET ? WHERE ?",
					[
						{
							stock_quantity: new_stock
						},
						{
							product_name: selected_item
						}
					],
					function(err, res) {
						if (err) throw err;

						// congratulate user with a success message
						console.log(`Purchase successful! You have bought ${selected_quantity} ${selected_item} for $${purchase_total}`);
						console.log(`---------------------------\n`);
						
						// and return user to purchase menu
						run();
					}
				)

			} else { //if stock is insufficient, reject user request
				
				console.log(`Stock insufficient. Try again.`);
				
				// and return user to purchase menu
				promptItemQuantity(selected_item);
			
			}
		}
	);
};





// make connection to db
connection.connect(function(err) {
	if (err) throw err;

	// then console log success message, if no err
	console.log("connected as id: " + connection.threadId);

	// run main fn
	run();
	
})