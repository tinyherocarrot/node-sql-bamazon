DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
item_id INTEGER AUTO_INCREMENT NOT NULL,
PRIMARY KEY (item_id),
product_name VARCHAR(30) NOT NULL,
department_name VARCHAR(30) NOT NULL,
price INTEGER(10) NOT NULL,
stock_quantity INTEGER(10) NOT NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("laptop", "electronics", 300, 20), 
("desk lamp", "office", 35, 90), 
("boots", "shoes", 120, 100), 
("heels", "shoes", 160, 100), 
("blender", "kitchen", 80, 200), 
("toaster", "kitchen", 45, 200), 
("frying pan", "kitchen", 30, 200), 
("camera", "electronics", 600, 20), 
("stapler", "office", 10, 150), 
("chapstick", "misc", 3, 300);