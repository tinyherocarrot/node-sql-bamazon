var inquirer = require("inquirer");
var mysql = require ("mysql");
require("colors");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password:"password",
    database: "bamazon"
});

// main function, which prompts user for an action, using a menu list
var run = function() {
	inquirer.prompt([
	{
		type: "list",
		message: "\nWhat would you like to do?",
		choices: [
			"View Products for Sale",
			"View Low Inventory",
			"Add to Inventory",
			"Add New Product"
		],
		name: "action"
	}
	]).then( answer => {
		switch (answer.action) {
			case "View Products for Sale":
				readInventory("view");
				break;

			case "View Low Inventory":
				viewLowInventory();
				break;

			case "Add to Inventory":
				readInventory("add");
				break;

			case "Add New Product":
				addNewProduct();
				break;
		}
	})
}

// SELECT query to database to read the inventory
// takes a string "action", 
// returns an object of objects to either view the inventory, or to add stock to a particular item
var readInventory = function(action) {
	connection.query(
		"SELECT item_id, product_name, price, stock_quantity FROM products", 
		function(err, res) {
			if (err) throw err;

			switch (action) {
				case "view":
					printInventory(res);
					break;

				case "add":
					addWhatToInventory(res);
					break;
			}

		}
	);
}

// function to print the item_id, product_name, price, and stock_quantity properties of each item in the inventory
var printInventory = function(inventory) {
	
	inventory.forEach(item => {
		console.log(`--------------------\n`);
		console.log(`ITEM ID ${item.item_id}`);
		console.log(`${item.product_name}`);
		console.log(`$${item.price}/ea`);
		console.log(`Stock: ${item.stock_quantity}`);
		console.log(`--------------------\n`);
	})

	// then returns user to action menu
	run();
}

// list all items with an inventory count lower than five
var viewLowInventory = function() {
	connection.query(
		"SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity<5", 
		function(err, res) {
			if (err) throw err;

			if (res.length === 0) {
				console.log(`\nNo low stock!\n`.green);
			} else {
				console.log(`\nYou have less than 5 stock of the following:\n`.yellow);
				res.forEach(item => {
					console.log(`ITEM #${item.item_id} -- ${item.product_name}    stock: ${item.stock_quantity}`.red);
				})	
				console.log(`---------------------------\n`);
				
			}

			// then returns user to action menu
			run();
		}

	)
}

// inquirer prompt, which item to be restocked?
var addWhatToInventory = function(inventory) {
	
	// construct inventory (array of strings) with name of product and current quantity
	var printableInventory = [];
	inventory.forEach(item => {
		printableInventory.push(`${item.product_name}, current stock: ${item.stock_quantity}`);
	})

	inquirer.prompt([
	{
		type: "list",
		message: "\nWhat item would you like to restock?",
		choices: printableInventory,
		name: "selected_item",
		pageSize: 12
	},
	{
		type: "input",
		message: "\nHow many would you like to add?",
		name: "numToAdd"
	}
		]).then( answer => {

			// clip name of the item to be restocked,
			var selected_item = answer.selected_item.split(",")[0].trim();

			// clip the item's current stock,
			var current_stock = answer.selected_item.split(",")[1].split(":")[1].trim();
			
			// and calculate the new stock
			var newStock = parseInt(current_stock) + parseInt(answer.numToAdd);

			addToInventory(selected_item, newStock);
		})	
}

// query to update database with new stock of selected_item
var addToInventory = function(selected_item, newStock) {
	connection.query(
		"UPDATE products SET ? WHERE ?",
		[
			{
				stock_quantity: newStock
			},
			{
				product_name: selected_item
			}
		],
		function(err, res) {
			if (err) throw err;
			
			console.log(`\nRestock was successful! Stock of ${selected_item} is now ${newStock}.`.green);
			console.log(`---------------------------\n`);
			
			// then returns user to action menu
			run();
		}
	)
}

// adds a new product row to the database
var addNewProduct = function() {
	inquirer.prompt([
		{
			type: "input",
			message: "\nEnter product name: ",
			name: "new_product_name"
		},
		{
			type: "input",
			message: "\nEnter product category: ",
			name: "new_product_category"
		},
		{
			type: "input",
			message: "\nEnter product price: ",
			name: "new_product_price"
		},
		{
			type: "input",
			message: "\nEnter product stock: ",
			name: "new_product_stock"
		},
	]).then(answers => {

		// construct a query to add a row to database using user inputed data
		// NOTICE the quotations around the inserted parts of the template literal!
		var sql = "INSERT INTO products (product_name, department_name, price, stock_quantity) ";
		sql += `VALUES ('${answers.new_product_name}', '${answers.new_product_category}', ${parseInt(answers.new_product_price)}, ${parseInt(answers.new_product_stock)})`;

		var query = connection.query(sql, function(err, res) {
				if (err) throw err;

				console.log(`\nNew product was successfully added!`.green);
				console.log(`---------------------------\n`);

				// then returns user to action menu
				run();
			}
		)
	})
}

// once connection is establised
connection.connect(function(err) {
	if (err) throw err;

	// indicate connection,
	console.log("connected as id: " + connection.threadId);

	console.log("\n------------------------------------".yellow)
	console.log("Welcome to Bamazon! Manager View".yellow)
	console.log("------------------------------------\n".yellow)
	// and run the main function
	run();
	
});