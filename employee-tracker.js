const inquirer = require("inquirer");
const mysql = require("mysql");

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
    start();
    // returnDepartments();
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
            console.log("Viewing All Employees...");
        } 
        else if (answer === "View All Employees By Department") {
            console.log("Viewing All Employees By Department...");
        } 
        else if (answer === "View All Employees By Role") {
            console.log("Viewing All Employees By Role...");
        } 
        else if (answer === "Add Employee") {
            console.log("Adding Employee...");
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

        }
    ]).then(response => {

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
            choices: returnDepartments(),
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
                // send user back to start menu
                start();
              }
        );
    });
}

// Helper function to return a list of departments
const returnDepartments = () => {
    let departments = [];

    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;

        res.forEach(department => {
            departments.push(department.name);
        });
        // console.log(departments);
    });
    return departments;
}