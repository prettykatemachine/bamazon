DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
item_id INT(11) NOT NULL AUTO_INCREMENT,
product_name VARCHAR(150) NOT NULL,
department_name VARCHAR(50) NULL,
price DECIMAL(10,4) NOT NULL,
stock_quantity INT(11) NOT NULL,
PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Cooking with Coolio", "Celebrity Cookbooks", 4.20, 15);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("In the Kitchen with Miss Piggy", "Celebrity Cookbooks", 29.95, 10);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Al Roker’s Big Bad Book of Barbecue", "Celebrity Cookbooks", 13.50, 5);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Shamwow", "As Seen on TV", 9.99, 50);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Shake Weight", "As Seen on TV", 15.99, 25);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Chia Pet", "As Seen on TV", 9.99, 75);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Speedo", "Clothing", 12.95, 10);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Jean Shorts", "Clothing", 4.99, 15);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Polyester Leisure Suit", "Clothing", 38.42, 25);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Rhinestone Leather Jacket", "Clothing", 200, 17);