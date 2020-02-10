const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');

const departments = [];
const roles = [];

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
            console.log("Viewing All Employees By Role...");
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
        // {
        //     type: "list",
        //     message: "Who is the employee's manager?",
        //     name: "manager",
        //     choices: functionHere()
        // }
    ]).then(response => {

        inquirer.prompt([
            {
                type: "list",
                message: "Who is the employee's manager?",
                name: "manager",
                choices: employeeListForManager(response.role)
            }  
        ]).then(response => {
            console.log(response.manager);
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

// Helper function to return a list of departments
// const returnDepartments = () => {
//     let departments = [];

//     connection.query("SELECT name FROM department", function(err, res) {
//         if (err) throw err;
        
//         res.forEach(department => {
//             departments.push(department.name);
//         });
//     });
//     return departments;
// }

// const returnRoles = () => {
//     let roles = [];

//     connection.query("SELECT title FROM role", function(err, res) {
//         if (err) throw err;
//         res.forEach(role => {
//             roles.push(role.title);
//         });
//     });

//     return roles;
// }

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

    // let departments = returnDepartments();

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