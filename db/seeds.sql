
-- INSERT INTO department (id, name)
-- VALUES ("Design", 1),
--        ("Technical Design", 2),
--        ("Merchandising", 3),
--        ("Sourcing", 4);

INSERT INTO department (name)
VALUES ("Design"),
       ("Merchandising"),
       ("Technical Design"),
       ("Sourcing");

INSERT INTO role (title, salary,department_id)
VALUES ("Director", 225000, 1),
       ("Sr. Deisgner", 150000, 1),
       ("Designer", 80000, 1),
       ("Associate Designer", 55000, 1),
       ("Assistant Designer", 40000, 1),
       ("Sr. Technical Deisgner", 150000, 2),
       ("Technical Designer", 80000, 2),
       ("Associate Technical Designer", 55000, 2),
       ("Assistant Technical Designer", 40000, 2)
       ("Sr. Buyer", 150000, 3),
       ("Buyer", 80000, 3),
       ("Associate Buyer", 55000, 3),
       ("Assistant Buyer", 40000, 3),
       ("Sr. Sourcing Manager", 150000, 4),
       ("Sourcing Manager", 80000, 4),
       ("Associate Sourcing Manager", 55000, 4),
       ("Assistant Sourcing Manager", 40000, 4);
       

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Lexi", "Gray", 2, NULL),
       ("Amaya", "Davis", 3, 1),
       ("Poppie", "Bonilla", 4, 2),
       ("Charles", "Perry", 5, 2),
       ("Mina", "Gutierrez", 6, 4),
       ("Alastair", "Barton", 7, 6),
       ("Tatiana", "Erickson", 8, 7),
       ("Aston", "Welsh", 9, 8),
       ("Cordelia", "Hendricks", 10, 8),
       ("Elodie", "Khan", 11, 10),
       ("Ismael", "Elliott", 12, 10),
       ("Liam", "Park", 13, 12),
       ("Lacey", "O'Neill", 14, 12);