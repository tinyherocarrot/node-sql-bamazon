USE bamazon;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("laptop", "Electronics", 300, 20), 
("desk lamp", "Office", 35, 90), 
("boots", "Shoes", 120, 100), 
("heels", "Shoes", 160, 100), 
("blender", "Kitchen", 80, 200), 
("toaster", "Kitchen", 45, 200), 
("frying pan", "Kitchen", 30, 200), 
("camera", "Electronics", 600, 20), 
("stapler", "Office", 10, 150), 
("chapstick", "Misc", 3, 300),
("assless chaps", "Clothing", 60, 3);


INSERT INTO departments (department_id, department_name, overhead_costs)
VALUES (1, "Electronics", 60000),
(2, "Office", 20000),
(3, "Shoes", 80000),
(4, "Kitchen", 30000),
(5, "Misc", 10000),
(6, "clothes", 40000);