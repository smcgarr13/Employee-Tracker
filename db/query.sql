-- view all departments
SELECT *
FROM department;

-- view all roles
SELECT r.title, r.id AS role_id, d.name AS department, r.salary 
FROM role r
JOIN department d ON r.department_id = d.id;

-- view all employees
SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
FROM employee e
LEFT JOIN role r ON e.role_id = r.id
LEFT JOIN department d ON r.department_id = d.id
LEFT JOIN employee m ON e.manager_id = m.id
ORDER BY e.id;

-- view employees by department
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
WHERE department.name = 'Design';

-- view all managers
SELECT m.id AS manager_id, 
       CONCAT(m.first_name, ' ', m.last_name) AS manager_name, 
       GROUP_CONCAT(CONCAT(e.first_name, ' ', e.last_name) SEPARATOR ', ') AS employees
FROM employee e
LEFT JOIN employee m ON e.manager_id = m.id
GROUP BY manager_id, manager_name;

-- total budget by department
SELECT SUM(salary) AS total_budget
FROM employee e
JOIN role r ON e.role_id = r.id
JOIN department d ON r.department_id = d.id
WHERE d.name = 'Design';