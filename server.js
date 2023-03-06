const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");
const express = require("express");
const figlet = require('figlet');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const app = express();

const stream = fs.createReadStream('myfile.txt');

stream.on('error', (err) => {
  console.error('An error occurred:', err);
});

// middleware
app.use(express.json());

// connect to database
const db = mysql.createConnection(
    {
      host: '127.0.0.1',
      user: 'root',
      password: '*Sunshine123*',
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
//   app.listen(3001, () => {
//     console.log('Server started on port 3001');
//   });

// ascii graphic
figlet('Employee Manager', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});
  
// quetions for initial inquirer prompt
const questions = [
    {
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: ["View All Departments", "View All Roles", "View All Employees", "Add A Department", "Add Role", "Add Employee", "Update Employee Role", "Update Employee Manager", "View Employees By Manager", "View Employees By Department", "Get Total Budget By Department", "Delete Department", "Delete Role", "Delete Employee"]
      },
  ];

  // initial inquirer prompt
  inquirer.prompt(questions).then(answers => {
    // The selected choice is available in answers.menu
    console.log(`You selected: ${answers.menu}`);

    switch (answers.menu) {
        case "View All Departments":
            showDepartments();
            break;

        case "View All Roles":
            viewAllRoles();
            break;

        case "View All Employees":
            viewAllEmployees();
            break;

        case "Add A Department":
            addDepartment();
            break;

        case "Add Role":
            addRole();
            break;

        case "Add Employee":
            addEmployee();
            break;

        case "Update Employee Role":
            updateEmployeeRole();
            break;

        case "Update Employee Manager":
            updateEmployeeManager()
            break;
        
        case "View Employees By Manager":
            viewEmployeesByManager();
            break;

        case "View Employees By Department":
            viewEmployeesByDepartment();
        break;

        case "Get Total Budget By Department":
            getTotalDepartmentBudget();
        break;

        case "Delete Department":
            deleteDepartment()
            break;

        case "Delete Role":
            deleteRole()
            break;

        case "Delete Employee":
            deleteEmployee()
            break;

        default:
            Connection.end();
            console.log("Invaild choice")
    }

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
    db.query("SELECT * FROM role", (err, results) => {
      if (err) {
        console.log(err);
      }
      console.table(results);
    });
  }

// function to show all employees
function viewAllEmployees() {
const sql = `
    SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id
    ORDER BY e.id;
`;
    db.query(sql, (err, results) => {
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
        const sql = 'INSERT INTO department (name) VALUES (?)';
        db.query(sql, [name], (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log(`Department "${name}" has been added to the database.`);
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
        db.query("INSERT INTO role SET ?",
            {
              title: answers.name,
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
    db.query("SELECT * FROM role", (err, results) => {
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
        db.query("SELECT * FROM employee WHERE manager_id IS NULL", (err, results) => {
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
            "INSERT INTO employee SET ?",
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
                    console.log(`New employee ${answers.first_name} ${answers.last_name} has been added to the database.`);
                }
            );
        });
    });
 });
            
}

// function to update an employee role
// I am prompted to select an employee to update and their new role and this information is updated in the database
function updateEmployeeRole() {
    db.query("SELECT id, first_name, last_name, FROM employee", (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        inquirer.prompt([
            {
                type: "number",
                name: "id",
                message: "Enter the role ID for the employee you would like to update:"
            },
            {
                type: "number",
                name: "roleId",
                message: "Enter the new role ID for the employee:"
            }
        ]).then(answers => {
            db.query(
                "UPDATE employee SET role_id = ? WHERE id = ?",
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
function updateEmployeeManager() {
    inquirer.prompt([
        {
            type: "number",
            name: "employee_id",
            message: "Enter the Id for the employee you'd like to update:"
        },
        {
            type: "number",
            name: "manager_id",
            message: "Enter the Id of the new manager for this employee:"  
        },
    ]).then(answers => {
        db.query("UPDATE employees SET manager_id = ? WHERE id = ?", [answers.manager_id, answers.employee_id], (err, results) => {
            if (err) throw err;
            console.log(err);
            }
        );
    });
}
// function to view employees by manager
function viewEmployeesByManager() {
    inquirer.prompt([
        {
            type: "input",
            name: "managerId",
            message: "Enter the manager's Id"
        },
    ]).then(answers => {
        const {managerId} = answers;
        const sql = "SELECT * FROM employee WHERE manager_id = ?";
        db.query(sql, [managerId], (err, results) => {
            if (err) {
                console.log(err);
            }
            console.table(results);
        });
    });
}
// function to view employees by department
function viewEmployeesByDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "Enter the name of the department:",
        },
    ]).then(answers => {
        const {department} = answers;
        const sql =`
        SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
        FROM employee e
        LEFT JOIN role r ON e.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id
        WHERE d.name = ?
        ORDER BY e.id;
      `;
    //   SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    
    db.query(sql, [department], (err, results) => {
        if (err){
        console.log(err);
        }
        console.table(results);
        });
    });
}

// function to delete department
function deleteDepartment() {
// get list of existing departments
db.query('SELECT * FROM department', (err, results) => {
if (err) {
    console.log(err);
}
const departmentChoices = results.map(department => {
    return {
        name: department.name,
        value: department.id
    }
  });

    inquirer.prompt([
        {
            type: "list",
            name: "department_id",
            message: "Which department would you like to delete?",
            choices: departmentChoices
        }
    ]).then(answers => {
        const departmentId = answers.department_id;
        const sql = 'DELETE FROM department WHERE id = ?';
        db.query(sql, [departmentId, departmentId], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.length > 0 && result[0].length > 0) {
                const departmentName = result[0][0].name;
                console.log(`Department ${departmentName} with ID ${departmentId} has been deleted from the database.`);
            } else {
                console.log(`Department with ID ${departmentId} has been deleted from the database.`);
            }
          }
        });
    });
  });
}

// function to delete role
function deleteRole() {
 // get list of existing roles
 db.query('SELECT * FROM role', (err, results) => {
    if (err) {
        console.log(err);
    }
    const roleChoices = results.map(role => {
        return {
            name: role.title,
            value: role.id
        }
    });
    inquirer.prompt([
        {
            type: "list",
            name: "role_id",
            message: "Which role would you like to delete?",
            choices: roleChoices
        }
    ]).then(answers => {
        const roleId = answers.role_id;
        const sql = 'DELETE FROM role WHERE id = ?';
        db.query(sql, [roleId], (err, result) => {
            if (err) {
                console.log(err);
            } else if (result.affectedRows === 0) {
                console.log(`Role with the ID ${roleId} does not exist.`)
            } else {
                console.log(`Role with ID ${roleId} has been deleted from the database.`)
            }
        });
    });
 });
}

// function to delete employee
function deleteEmployee() {
    // get list of existing employees
    db.query('SELECT * FROM employee', (err, results) => {
    if (err) {
        console.log(err);
    }
    const employeeChoices = results.map(employee => {
        return {
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }
      });
    
        inquirer.prompt([
            {
                type: "list",
                name: "employee_id",
                message: "Which employee would you like to delete?",
                choices: employeeChoices
            }
        ]).then(answers => {
            const employeeId = answers.employee_id;
            const sql = 'DELETE FROM employee WHERE id = ?';
            db.query(sql, [employeeId], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Employee with ID ${employeeId} has been deleted from the database. `);
                }
            });
        });
      });
    }

// function to view the total utilized budget of a department—in other words, the combined salaries of all employees in that department
function getTotalDepartmentBudget() {
    inquirer.prompt([
        {
            type: "imput",
            name: "departmentName",
            message: "Enter the name of the department:",
        },
    ]).then(answers => {
        const {departmentName} = answers;
        const sql = 
        `SELECT SUM(salary) AS total_budget
        FROM employee e
        JOIN role r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id
        WHERE d.name = ?`;
    db.query(sql, departmentName, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.log(`The total budget for ${departmentName} is ${results[0].total_budget}`);
    });
  });
}