const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");
const express = require("express");
const figlet = require("figlet");
const fs = require("fs");

const PORT = process.env.PORT || 3001;
const app = express();

// middleware
app.use(express.json());

// connect to database
const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    user: "root",
    password: "*Sunshine123*",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

// default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// start server that listens on port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ascii graphic
figlet("Employee Manager", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
});

// options for initial inquirer prompt
function promptUser() {
  const choices = [
    {
      type: "list",
      name: "menu",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add A Department",
        "Add Role",
        "Add Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "View Employees By Manager",
        "View Employees By Department",
        "Get Total Budget By Department",
        "Delete Department",
        "Delete Role",
        "Delete Employee",
        "Exit",
      ],
    },
  ];

  // initialize the menu
  inquirer.prompt(choices).then(handleAnswers);
  // handle user input
  function handleAnswers(answers) {
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
        updateEmployeeManager();
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
        deleteDepartment();
        break;

      case "Delete Role":
        deleteRole();
        break;

      case "Delete Employee":
        deleteEmployee();
        break;

      case "Exit":
        db.end();
        return;

      default:
        console.log("Invalid choice");
    }
  }
}
promptUser();

// function to show all departments
function showDepartments() {
  // SQL query to select all departments from the department table
  db.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    console.table(results);
    promptUser();
  });
}

// function to show all roles
function viewAllRoles() {
  // SQL query to select all roles from the role table
  db.query("SELECT * FROM role", (err, results) => {
    if (err) {
      console.log(err);
    }
    console.table(results);
    promptUser();
  });
}

// function to show all employees
function viewAllEmployees() {
  // SQL query to get all employee information, including their role, department, and manager
  const sql = `
    SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id
    ORDER BY e.id;
`;
  // execute the query and display results in a table
  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    }
    console.table(results);
    promptUser();
  });
}

// function to add a department
function addDepartment() {
  // prompt the user for the name of the new department
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of the department?",
      },
    ])
    .then((answers) => {
      // pull the name from the answers object
      const { name } = answers;
      // SQL query to add the new department into the database
      const sql = "INSERT INTO department (name) VALUES (?)";
      db.query(sql, [name], (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(`Department "${name}" has been added to the database.`);

        promptUser();
      });
    });
}

// function to add a role
function addRole() {
  // prompt user for information about the new role
  inquirer
    .prompt([
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
        type: "input",
        name: "department_name",
        message: "What is the department name for this role?",
      },
    ])
    .then((answers) => {
      // insert the new role information into the database
      db.query(
        "INSERT INTO role SET ?",
        {
          title: answers.name,
          salary: answers.salary,
          department_id: answers.department_id,
        },
        (err, result) => {
          if (err) throw err;
          console.log(
            `New role "${answers.name}" has been added to the database.`
          );

          promptUser();
        }
      );
    });
}

// function to add an employee
// I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
function addEmployee() {
  // get a list of roles to choose from
  db.query("SELECT * FROM role", (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    // create an array of role choices
    const roleChoices = results.map((role) => ({
      name: role.title,
      value: role.id,
    }));
    // get a list of managers to choose from
    db.query(
      "SELECT * FROM employee WHERE manager_id IS NULL",
      (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
        // create an array of manager choices for the inquirer prompt
        const managerChoices = results.map((manager) => ({
          name: `${manager.first_name} ${manager.last_name}`,
          value: manager.id,
        }));

        // use inquirer to prompt user for the new employee's details
        inquirer
          .prompt([
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
            // insert the new employee into the database
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
                console.log(
                  `New employee ${answers.first_name} ${answers.last_name} has been added to the database.`
                );

                promptUser();
              }
            );
          });
      }
    );
  });
}

// function to update an employee role
function updateEmployeeRole() {
  // select all employees from the database and display them in a table
  db.query("SELECT id, first_name, last_name FROM employee", (err, results) => {
    if (err) {
      console.log(err);
    }
    console.table(results);
    // prompt the user to select an employee and a new role for them
    inquirer
      .prompt([
        // select an employee from a list of employees
        {
          type: "list",
          name: "id",
          message: "Select the employee you would like to update:",
          choices: results.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },
        // select a new role for the employee from a list of roles
        {
          type: "list",
          name: "roleName",
          message: "Select the new role for the employee:",
          choices: () => {
            return new Promise((resolve, reject) => {
              // select all roles from the database and return their titles as choices
              db.query("SELECT title FROM role", (err, results) => {
                if (err) {
                  reject(err);
                }
                resolve(results.map((role) => role.title));
              });
            });
          },
        },
      ])
      .then((answers) => {
        // select the ID of the new role from the database
        db.query(
          "SELECT id FROM role WHERE title = ?",
          [answers.roleName],
          (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
              // if the new role does not exist in the database, notify the user and prompt them again
              console.log(`Role "${answers.roleName}" does not exist.`);
              promptUser();
            } else {
              // update the employee's role in the database and notify the user
              const roleId = result[0].id;
              db.query(
                "UPDATE employee SET role_id = ? WHERE id = ?",
                [roleId, answers.id],
                (err, result) => {
                  if (err) throw err;
                  console.log(
                    `Employee with ID ${answers.id} has been updated with a new role of "${answers.roleName}".`
                  );
                  promptUser();
                }
              );
            }
          }
        );
      });
  });
}

// function to update employee manager
function updateEmployeeManager() {
  // get a list of employees from the database
  db.query("SELECT id, first_name, last_name FROM employee", (err, results) => {
    if (err) {
      console.log(err);
    }
    // prompt user to select an employee and enter the new manager ID
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee_id",
          message: "Select the employee you'd like to update:",
          choices: results.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },
        {
          type: "list",
          name: "manager_id",
          message: "Select the new manager for this employee:",
          choices: results.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },
      ])
      .then((answers) => {
        // update the selected employee's manager in the database
        db.query(
          "UPDATE employee SET manager_id = ? WHERE id = ?",
          [answers.manager_id, answers.employee_id],
          (err, results) => {
            if (err) throw err;
            console.log(
              `Employee with ID ${answers.employee_id} has been updated with a new manager ID of ${answers.manager_id}.`
            );
            promptUser();
          }
        );
      });
  });
}

// function to view employees by manager
function viewEmployeesByManager() {
  // get a list of managers from the database
  db.query(
    "SELECT DISTINCT e.manager_id, CONCAT(e.first_name, ' ', e.last_name) AS manager_name FROM employee e",
    (err, results) => {
      if (err) {
        console.log(err);
      }
      // display a list of managers in a table
      console.table(results);

      // prompt user to enter the ID of the manager they want to view employees for
      inquirer
        .prompt([
          {
            type: "input",
            name: "managerId",
            message: "Enter the manager's Id",
          },
        ])
        .then((answers) => {
          const { managerId } = answers;
          const sql = "SELECT * FROM employee WHERE manager_id = ?";
          // get a list of employees for the selected manager from the database
          db.query(sql, [managerId], (err, results) => {
            if (err) {
              console.log(err);
            }
            // display the list of employees in a table
            console.table(results);
            promptUser();
          });
        });
    }
  );
}

// function to view employees by department
function viewEmployeesByDepartment() {
  // get a list of departments from the database
  db.query("SELECT id, name FROM department", (err, results) => {
    if (err) {
      console.log(err);
    }
    // display a list of departments in a table
    console.table(results);

    // add "All Departments" option to the list of departments
    results.push({ id: 0, name: "All Departments" });

    // prompt user to select a department
    inquirer
      .prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Select a department:",
          choices: results.map((d) => ({ name: d.name, value: d.id })),
        },
      ])
      .then((answers) => {
        const { departmentId } = answers;
        // SQL query to retrieve employees by department
        let sql = `
            SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
            FROM employee e
            LEFT JOIN role r ON e.role_id = r.id
            LEFT JOIN department d ON r.department_id = d.id
            LEFT JOIN employee m ON e.manager_id = m.id
            `;

        // add WHERE clause to filter results by department if a department is selected
        if (departmentId !== 0) {
          sql += " WHERE d.id = ?";
        }

        sql += " ORDER BY e.id;";

        // execute the SQL query and display the results in a table
        db.query(sql, [departmentId], (err, results) => {
          if (err) {
            console.log(err);
          }
          console.table(results);
          promptUser();
        });
      });
  });
}

// function to delete department
function deleteDepartment() {
  // get a list of existing departments from the database
  db.query("SELECT * FROM department", (err, results) => {
    if (err) {
      console.log(err);
    }
    // map the results to an array of department choices
    const departmentChoices = results.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });
    // prompt user to select a department to delete
    inquirer
      .prompt([
        {
          type: "list",
          name: "department_id",
          message: "Which department would you like to delete?",
          choices: departmentChoices,
        },
      ])
      .then((answers) => {
        const departmentId = answers.department_id;
        const sql = "DELETE FROM department WHERE id = ?";
        // delete selected department
        db.query(sql, [departmentId], (err, result) => {
          if (err) {
            console.log(err);
          } else {
            const deletedDepartment = results.find(
              (department) => department.id === departmentId
            );
            console.log(
              `Department ${deletedDepartment.name} with ID ${departmentId} has been deleted from the database.`
            );

            promptUser();
          }
        });
      });
  });
}

// function to delete role
function deleteRole() {
  // get a list of existing roles from the database
  db.query("SELECT * FROM role", (err, results) => {
    if (err) {
      console.log(err);
    }
    // map the results to an array of role choices
    const roleChoices = results.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });
    // prompt user to select a role to delete
    inquirer
      .prompt([
        {
          type: "list",
          name: "role_id",
          message: "Which role would you like to delete?",
          choices: roleChoices,
        },
      ])
      .then((answers) => {
        const roleId = answers.role_id;
        const sql = "DELETE FROM role WHERE id = ?";
        // delete selected role
        db.query(sql, [roleId], (err, result) => {
          if (err) {
            console.log(err);
          } else if (result.affectedRows === 0) {
            console.log(`Role with the ID ${roleId} does not exist.`);
          } else {
            console.log(
              `Role with ID ${roleId} has been deleted from the database.`
            );

            promptUser();
          }
        });
      });
  });
}

// function to delete employee
function deleteEmployee() {
  // get a list of existing employees from the database
  db.query("SELECT * FROM employee", (err, results) => {
    if (err) {
      console.log(err);
    }
    // map the list of employees to an array of choice objects
    const employeeChoices = results.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });

    // prompt user to select an employee to delete
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee_id",
          message: "Which employee would you like to delete?",
          choices: employeeChoices,
        },
      ])
      .then((answers) => {
        const employeeId = answers.employee_id;
        const sql = "DELETE FROM employee WHERE id = ?";

        // delete the selected employee from database
        db.query(sql, [employeeId], (err, result) => {
          if (err) {
            console.log(err);
          } else if (result.affectedRows === 0) {
            console.log(`Employee with the ID ${employeeId} does not exist.`);
          } else {
            console.log(
              `Employee with ID ${employeeId} has been deleted from the database.`
            );

            promptUser();
          }
        });
      });
  });
}

// function to view the total utilized budget of a department
function getTotalDepartmentBudget() {
  // get a list of departments from the database
  db.query("SELECT id, name FROM department", (err, results) => {
    if (err) {
      console.log(err);
    }
    // display list of departments in a table
    console.table(results);

    // add "All Departments" option to the list of departments
    results.push({ id: 0, name: "All Departments" });

    inquirer
      .prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Select a department:",
          choices: results.map((d) => ({ name: d.name, value: d.id })),
        },
      ])
      .then((answers) => {
        const departmentId = answers.departmentId;
        let sql = `SELECT SUM(salary) AS total_budget
            FROM employee e
            JOIN role r ON e.role_id = r.id
            JOIN department d ON r.department_id = d.id`;
        if (departmentId !== 0) {
          sql += ` WHERE d.id = ${departmentId}`;
        }
        db.query(sql, (err, results) => {
          if (err) {
            console.log(err);
          }
          if (departmentId === 0) {
            console.log(
              `The total budget for all departments is ${results[0].total_budget}`
            );
          } else {
            console.log(
              `The total budget for department ${answers.departmentId} is ${results[0].total_budget}`
            );
          }
          promptUser();
        });
      });
  });
}
