const inquirer = require("inquirer");
const mysql = require("mysql");


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
            console.log("Adding Department...");
        } 
        else if (answer === "Add Role") {
            console.log("Adding Role...");
        }
        else if (answer === "Update Employee Roles") {
            console.log("Updating Employee Roles...");
        }  
        else if (answer === "Quit") {
            console.log("connection.end()");
        }  
    })
}

start();