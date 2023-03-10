
INSERT INTO department (name)
VALUES ("Design"),
       ("Merchandising"),
       ("Technical Design"),
       ("Sourcing");

INSERT INTO role (title, salary,department_id)
VALUES ("Director of Design", 225000, 1),
       ("Sr. Designer", 150000, 1),
       ("Designer", 90000, 1),
       ("Associate Designer", 65000, 1),
       ("Assistant Designer", 50000, 1),
       ("Director of Merchandising", 235000, 2),
       ("Sr. Buyer", 160000, 2),
       ("Buyer", 100000, 2),
       ("Associate Buyer", 70000, 2),
       ("Assistant Buyer", 55000, 2),
       ("Director of Technical Design", 200000, 3),
       ("Sr. Technical Designer", 115000, 3),
       ("Technical Designer", 80000, 3),
       ("Associate Technical Designer", 55000, 3),
       ("Assistant Technical Designer", 40000, 3),
       ("Director of Sourcing", 200000, 4),
       ("Sr. Sourcing Manager", 150000, 4),
       ("Sourcing Manager", 80000, 4),
       ("Associate Sourcing Manager", 55000, 4),
       ("Assistant Sourcing Manager", 40000, 4);
       

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Lexi", "Gray", 1, NULL),
       ("Amaya", "Davis", 2, 1),
       ("Poppie", "Bonilla", 3, 1),
       ("Charles", "Perry", 4, 2),
       ("Nelli", "Furlong", 5, 4),
       ("Mina", "Gutierrez", 6, NULL),
       ("Alastair", "Barton", 7, 6),
       ("Tatiana", "Erickson", 8, 6),
       ("Aston", "Welsh", 9, 7),
       ("Cordelia", "Hendricks", 10, 8),
       ("Elodie", "Khan", 11, NULL),
       ("Ismael", "Elliott", 12, 11),
       ("Liam", "Park", 13, 11),
       ("Lacey", "O'Neill", 14, 12),
       ("Darian", "Knight", 15, 12),
       ("Sawyer", "Strong", 16, NULL),
       ("Lacey", "O'Neill", 17, 16),
       ("Anya", "Lee", 18, 16),
       ("Kurt", "Nolan", 19, 17),
       ("Jenia", "Long", 20, 17);

    