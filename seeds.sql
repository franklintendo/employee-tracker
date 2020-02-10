-- ### Alternative way to insert more than one row
-- INSERT INTO products (flavor, price, quantity)
-- VALUES ("vanilla", 2.50, 100), ("chocolate", 3.10, 120), ("strawberry", 3.25, 75);

INSERT INTO department (name)
VALUES ("IT"), ("Accounting"), ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Engineer", 80000, 1), ("IT Intern", 7000, 1), ("Project Lead", 120000, 1), ("Senior Accountant", 120000, 2), ("Junior Accountant", 75000, 2), ("Accountant Intern", 3000, 2), ("Sales Lead", 120000, 3), ("Sales Person", 75000, 3), ("Sales Intern", 3000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jim", "Skanck", 3, null), ("Tim", "Poon", 1, 3), ("Carol", "Turd", 2, 3), ("Hank", "Rickles", 4, null), ("Rick", "Urine", 5, 4), ("Wayne", "Skipples", 6, 4), ("Samantha", "Vindle", 7, null), ("Greg", "Aguilera", 8, 7), ("Remy", "Yart", 9, 7);

-- ### View all employees

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary
FROM ((department INNER JOIN role ON role.department_id = department.id) INNER JOIN employee ON employee.role_id = role.id);

-- ### View all employees by department

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary
FROM ((department INNER JOIN role ON role.department_id = department.id) INNER JOIN employee ON employee.role_id = role.id) WHERE department.name = "IT";

-- ### Return all employees in same department as new hire (by their role)
-- ##### 1. Get department name from role title 
SELECT role.department_id, department.name FROM role INNER JOIN department ON role.department_id = department.id WHERE (role.title = "Engineer");
-- ##### 2. Get employees from department name
SELECT employee.first_name, employee.last_name
FROM ((department INNER JOIN role ON role.department_id = department.id) INNER JOIN employee ON employee.role_id = role.id) WHERE department.name = "IT";