-- ### Alternative way to insert more than one row
-- INSERT INTO products (flavor, price, quantity)
-- VALUES ("vanilla", 2.50, 100), ("chocolate", 3.10, 120), ("strawberry", 3.25, 75);

INSERT INTO department (name)
VALUES ("IT"), ("Accounting"), ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Engineer", 80000, 1), ("IT Intern", 7000, 1), ("Project Lead", 120000, 1), ("Senior Accountant", 120000, 2), ("Junior Accountant", 75000, 2), ("Accountant Intern", 3000, 2), ("Sales Lead", 120000, 3), ("Sales Person", 75000, 3), ("Sales Intern", 3000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jim", "Skanck", 3, null), ("Tim", "Poon", 1, 3), ("Carol", "Turd", 2, 3), ("Hank", "Rickles", 4, null), ("Rick", "Urine", 5, 4), ("Wayne", "Skipples", 6, 4), ("Samantha", "Vindle", 7, null), ("Greg", "Aguilera", 1, 7), ("Remy", "Yart", 2, 7);