CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	id INT(11) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(20) NOT NULL,
    department_name VARCHAR(20),
    price INT(10),
    stock_quantity INT(10),
    PRIMARY KEY (id)
);

CREATE TABLE departments (
	department_id INT(11) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(20) NOT NULL,
    over_head_costs INT(10),
    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs) VALUES ("Electronics", 20000);
INSERT INTO departments (department_name, over_head_costs) VALUES ("Pets", 4000);
INSERT INTO departments (department_name, over_head_costs) VALUES ("Food", 8000);
INSERT INTO departments (department_name, over_head_costs) VALUES ("Kitchen", 6000);
INSERT INTO departments (department_name, over_head_costs) VALUES ("Toys", 2000);
INSERT INTO departments (department_name, over_head_costs) VALUES ("Sporting Goods", 10000);


INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Laptop", "Electronics", 700, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Dog Food", "Pets", 25, 138);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Watermelon", "Food", 5, 70);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Knife Set", "Kitchen", 85, 43);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Playstation 4", "Electronics", 400, 30);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Waterballoons", "Toys", 8, 200);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Sleeping Bag", "Sporting Goods", 105, 38);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Flea Collar", "Pets", 30, 63);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Beyblade", "Toys", 10, 120);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Headphones", "Electronics", 60, 94);


SELECT * FROM products;
SELECT * FROM departments;