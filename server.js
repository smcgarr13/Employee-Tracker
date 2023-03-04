const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");
const express = require("express");
const artwork = require('/Users/mchong/bootcamp/Module-12/Employee-Tracker/ascii/ascii-art');

const PORT = process.env.PORT || 3001;
const app = express();

// middleware
app.use(express.json());

// connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password
      password: '',
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
  );
  
  // default response for any other request (Not Found)
  app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });


// ascii graphic
app.get('/', (req, res) => {
    res.send(artwork);
  });
  
//   app.listen(3001, () => {
//     console.log('Server started on port 3001');
//   });


// initial inquirer prompt
const questions = [
    {
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: ["View All Departments", "View All Roles", "View All Employees", "Add A Department", "Add Role", "Add Employee", "Update Employee Role", "Update Employee Manager", "Delete Department", "Delete Role", "Delete Employee"]
      },
  ];

  inquirer.prompt(questions).then(answers => {
    // The selected choice is available in answers.menu
    console.log(`You selected: ${answers.menu}`);
  });

// function to show all departments
function showDepartments() {
    db.query("SELECT * FROM department", function (err, results) {
      if (err) throw err;
      console.table(results);
    });
  }

// function to show all roles
function viewAllRoles() {
    db.query("SELECT * FROM roles", (err, results) => {
      if (err) {
        console.log(err);
      }
      console.table(results);
    });
  }

// function to show all employees
function viewAllEmployees() {
    db.query("SELECT * FROM employees", (err, results) => {
      if (err) {
        console.log(err);
      }
      console.table(results);
    });
  }

// function to add a department
// I am prompted to enter the name of the department and that department is added to the database
function addDepartment() {
    inquirer.prompt([
{
    type: "input",
    name: "name",
    message: "What is the name of the department?",
}
    ]).then(answers => {
        const {name} = answers;
        const sql = 'INSERT INTO departments (name) VALUES (?)';
        db.query(sql, [name], (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log('Department "${name}" has been added to the database.');
        });
    });
}

// function to add a role
// I am prompted to enter the name, salary, and department for the role and that role is added to the database

function addRole() {
    inquirer.prompt([
{
    type: "input",
    name: "name",
    message: "What is the name of the role?",
},
{
    type: "number",
    name: "salary",
    message: "What is the salary for this role?",
},
{
    type: "number",
    name: "department_id",
    message: "What is the department ID for this role?",
},
]).then(answers => {
        db.query("INSERT INTO roles SET ?",
            {
              title: answers.title,
              salary: answers.salary,
              department_id: answers.department_id,
            },
            (err, result) => {
                if (err) throw err;
                console.log(`New role "${answers.name}" has been added to the database.`);
            }
          );
        });
    }
// function to add an employee
// I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
function addEmployee() {
    // query the database to get a list of roles to choose from
    db.query("SELECT * FROM roles", (err, results) => {
        if (err) {
            console.log(err);
            return;
        }
        // create an array of role choices for the inquirer prompt
        const roleChoices = results.map((role) => ({
            name: role.title,
            value: role.id,
        }));
         // query the database to get a list of managers to choose from
        db.query("SELECT * FROM employees WHERE manager_id IS NULL", (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
         // create an array of manager choices for the inquirer prompt
         const managerChoices = results.map((manager) => ({
            name: `${manager.first_name} ${manager.last_name}`,
            value: manager.id,
         }));
         inquirer.prompt([
            {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?",
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?",
        },
        {
            type: "list",
            name: "role_id",
            message: "What is the employee's role?",
            choices: roleChoices,
        },
        {
            type: "list",
            name: "manager_id",
            message: "Who is the employee's manager?",
            choices: managerChoices,
        },
    ])
    .then((answers) => {
        db.query(
            "INSERT INTO employees SET ?",
            {
                first_name: answers.first_name,
                last_name: answers.last_name,
                role_id: answers.role_id,
                manager_id: answers.manager_id,
            },
            (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                    console.log(
                        `new emplyee ${answers.first_name} ${answers.last_name} has been added to the database.`
                    );
                }
            );
        });
    });
 });
            
}

// function to update an employee role
// I am prompted to select an employee to update and their new role and this information is updated in the database
function updateEmployeeRole() {
    db.query("SELECT id, first_name, last_name, FROM employees", (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        inquirer.prompt([
            {
                type: "number",
                name: "roleId",
                message: "Enter the new role ID for the employee:"
            }
        ]).then(corners => {
            db.query(
                "UPDATE employees SET role_id = ? WHERE id = ?",
                [answers.roleId, answers.id],
                (err, result) => {
                    if (err) throw err;
                    console.log(`Employee with ID ${answers.id} has been updated with a new role ID of ${answers.roleId}.`);
                }
            );
        });
    });
}


// function to update employee managers

// function to view employees by manager

// function to view employees by department

// function to delete departments, roles, and employees

// function to view the total utilized budget of a department—in other words, the combined salaries of all employees in that department