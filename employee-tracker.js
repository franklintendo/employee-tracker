const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');

// Initialize global variables to insert information
// depending on user input
const departments = [];
const roles = [];
let newEmployeeFirstName = "";
let newEmployeeLastName = "";
let newEmployeeRoleId = "";
let newEmployeeCoWorkers = "";

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "dbpw1234",
    database: "employee_trackerDB"
});

connection.connect(function(err){
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");

    
    

    // Grab existing departments
    connection.query("SELECT name FROM department", function(err, res) {
        if (err) throw err;
        
        res.forEach(department => {
            departments.push(department.name);
        });
    });

    // Grab existing roles
    connection.query("SELECT title FROM role", function(err, res) {
        if (err) throw err;
        res.forEach(role => {
            roles.push(role.title);
        });
    });

    start();


    // console.log(departments);
    // returnDepartments();
    // viewByDepartment();
    // connection.end();
});


const start = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "answer",
            message: "What would you like to do?",
            choices: ["View All Employees", "View All Employees By Department", "View All Employees By Role", "Add Employee", "Add Department", "Add Role", "Update Employee Roles", "Quit"]
        }
    ]).then(({ answer }) => {
        if (answer === "View All Employees") {
            viewAllEmployees();
        } 
        else if (answer === "View All Employees By Department") {
            viewByDepartment();
        } 
        else if (answer === "View All Employees By Role") {
            viewByRole();
        } 
        else if (answer === "Add Employee") {
            addEmployee();
        } 
        else if (answer === "Add Department") {
            addDepartment();
        } 
        else if (answer === "Add Role") {
            addRole();
        }
        else if (answer === "Update Employee Roles") {
            console.log("Updating Employee Roles...");
        }  
        else if (answer === "Quit") {
            console.log("Quitting application...");
            connection.end();
        }  
    })
}

const addEmployee = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the employee's first name?",
            name: "firstName"
        },
        {
            type: "input",
            message: "What is the employee's last name?",
            name: "lastName"
        },
        {
            type: "list",
            message: "What is the employee's role?",
            name: "role",
            choices: roles
        }
    ]).then(response => {
        newEmployeeFirstName = response.firstName;
        newEmployeeLastName = response.lastName;

        connection.query(`SELECT role.department_id, department.name, role.id FROM role INNER JOIN department ON role.department_id = department.id WHERE (role.title = "${response.role}")`, function(err, res) {
            if (err) throw err;
            newEmployeeRoleId = res[0].id;
            // console.log(res[0]);
            connection.query(
                `SELECT employee.first_name, employee.last_name, employee.id
                FROM ((department INNER JOIN role ON role.department_id = department.id) INNER JOIN employee ON employee.role_id = role.id) WHERE department.name = "${res[0].name}"`,
                function(err, employees) {
                    if (err) throw err;

                    newEmployeeCoWorkers = employees;
                    
                    filteredEmployees = employees.map(employee => {
                        return `${employee.first_name} ${employee.last_name}`
                    });

                    filteredEmployees.push("None");
                    // console.log(filteredEmployees);

                    inquirer.prompt([
                        {
                            type: "list",
                            message: "Who is the employee's manager?",
                            name: "manager",
                            choices: filteredEmployees
                        }  
                    ]).then(response => {
                        if (response.manager === "None") {
                            // console.log("Insert employee with manager id NULL");
                            connection.query(`INSERT INTO employee SET ?`,
                                {
                                    first_name: newEmployeeFirstName,
                                    last_name: newEmployeeLastName,
                                    role_id: newEmployeeRoleId,
                                    manager_id: null
                                }, function(err) {
                                    if (err) throw err;
                                    console.log(`Successfully added ${newEmployeeFirstName} ${newEmployeeLastName}!`);
                                    start();
                                });
                        } else {
                            console.log(`Manager Selected: ${response.manager}`);

                            newEmployeeCoWorkers.forEach(coWorker => {
                                // console.log(coWorker);
                                coWorkerName = `${coWorker.first_name} ${coWorker.last_name}`;
                                // console.log(coWorkerName);
                                if (coWorkerName === response.manager) {
                                    connection.query(`INSERT INTO employee SET ?`,
                                        {
                                            first_name: newEmployeeFirstName,
                                            last_name: newEmployeeLastName,
                                            role_id: newEmployeeRoleId,
                                            manager_id: coWorker.id
                                        }, function(err) {
                                            if (err) throw err;
                                            console.log(`Successfully added ${newEmployeeFirstName} ${newEmployeeLastName}!`);
                                            start();
                                        }
                                    );
                                }
                            });
                        }
                        
                        // console.log(`newEmployeeCoWorkers: ${newEmployeeCoWorkers}`);
                    });
                }
            );

        });

    });
}

// Helper function for when user wants to add a role
const addRole = () => {
    // Ask for title, salary, and department
    inquirer.prompt([
        {
            type: "input",
            message: "What is the title of the role?",
            name: "title"
        },
        {
            type: "number",
            message: "What is the salary of the role?",
            name: "salary"
        },
        {
            type: "list",
            message: "What department does this role belong to?",
            choices: departments,
            name: "department"
        }
    ]).then(role => {
        // Run query to obtain the department
        // id of the department that the user chose
        connection.query(`SELECT id FROM department WHERE (department.name = "${role.department}")`, function(err, res) {
            if (err) throw err;
            
            // Run query to insert the title, salary,
            // and the obtained department id into
            // the role table
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: role.title,
                    salary: role.salary,
                    department_id: res[0].id
                },
                function(err) {
                    if (err) throw err;
                    console.log(`The role "${role.title}" has been added!`);
                    console.log(`Role: ${role.title}  || Salary: ${role.salary} || Department: ${role.department}`);
                    // Update roles list
                    roles.push(role.title);
                    // send user back to start menu
                    start();   
                }
            );

        });
        
    });
} 

// Helper function to add a department
const addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department?",
            name: "department"
        }
    ]).then(({ department }) => {
        // Run query to insert the department that the
        // user entered
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: department
            },
            function(err) {
                if (err) throw err;
                console.log(`The department "${department}" has been added!`);
                // Update departments list
                departments.push(department);
                // send user back to start menu
                start();
              }
        );
    });
}

const employeeListForManager = (role) => {
    // Return employees of the role selected,
    // For the user to choose a manager
    // in the addEmployee function above
    connection.query(
        `SELECT employee.first_name, employee.last_name, department.name, role.title FROM ((employee INNER JOIN role ON employee.id = role.id) INNER JOIN department ON role.department_id = department.id))`
    , function(err, res) {
        if (err) throw err;
    });
}

const viewAllEmployees = () => {
    connection.query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary FROM ((department INNER JOIN role ON role.department_id = department.id) INNER JOIN employee ON employee.role_id = role.id);",
        function(err, res) {
            // console.log(res);
            if (err) throw err;
            const table = cTable.getTable(res);
            console.log("\n");
            console.log(table);

            start();
        });
}

const viewByDepartment = () => {

    inquirer.prompt([
        {
            type: "list",
            message: "Choose a department to view their employees",
            choices: departments,
            name: "department"
        }
    ]).then(response => {
        // console.log(`Viewing employees of ${response.department}`);
        connection.query(
            `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary
            FROM ((department INNER JOIN role ON role.department_id = department.id) INNER JOIN employee ON employee.role_id = role.id) WHERE department.name = "${response.department}"`, 
             function(err, res) {
                // console.log(res);
                if (err) throw err;
                const table = cTable.getTable(res);
                console.log("\n");
                console.log(table);

                start();
             }
        );
    });

}

const viewByRole = () => {

    inquirer.prompt([
        {
            type: "list",
            message: "Choose a role to view their employees",
            choices: roles,
            name: "role"
        }
    ]).then(response => {
        // console.log(`Viewing employees of ${response.department}`);
        connection.query(
            `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary
            FROM ((department INNER JOIN role ON role.department_id = department.id) INNER JOIN employee ON employee.role_id = role.id) WHERE role.title = "${response.role}"`, 
             function(err, res) {
                // console.log(res);
                if (err) throw err;
                const table = cTable.getTable(res);
                console.log("\n");
                console.log(table);

                start();
             }
        );
    });
}