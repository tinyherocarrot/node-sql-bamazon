var inquirer = require("inquirer");
var mysql = require ("mysql");
require('console.table');
require('colors');

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
			"View Product Sales by Department",
			"Create New Department"
		],
		name: "action"
	}
	]).then( answer => {
		switch (answer.action) {
			case "View Product Sales by Department":
				viewProductSales();
				break;

			case "Create New Department":
				createNewDepartment();
				break;
		}
	})
}


var viewProductSales = function() {

	var sql = "SELECT departments.department_id, departments.department_name, departments.overhead_costs, products.product_sales, products.product_sales - departments.overhead_costs AS total_profit "
	sql += "FROM bamazon.departments LEFT JOIN bamazon.products "
	sql += "ON products.department_name = departments.department_name GROUP BY department_name "
	sql += "ORDER BY department_id"
	
	connection.query(sql, function(err, res) {
		if (err) throw err;

		console.log(`\n`);
		console.table(res);		
		console.log(`\n`);

		run();
		})	
}


var createNewDepartment = function() {
	inquirer.prompt([
		{
			type: "input",
			message: "\nEnter department name: ",
			name: "new_department_name"
		},
		{
			type: "input",
			message: "\nEnter department overhead costs: ",
			name: "new_department_OC"
		},
		
	]).then(answers => {

		// construct a query to add a row to database using user inputed data
		// NOTICE the quotations around the inserted parts of the template literal!
		var sql = "INSERT INTO departments (department_name, overhead_costs) ";
		sql += `VALUES ('${answers.new_department_name}', ${parseInt(answers.new_department_OC)})`;

		var query = connection.query(sql, function(err, res) {
				if (err) throw err;

				console.log(`\nNew department was successfully added!`.green);
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
	console.log("Welcome to Bamazon! Supervisor View".yellow)
	console.log("------------------------------------\n".yellow)
	// and run the main function
	run();
	
});