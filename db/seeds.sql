INSERT INTO department (name)
VALUES
("Engineering"),
("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES
("Head Engineer",200000.00,1),
("Head of Marketing",140000.00,2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Bob", "Jenkins",1,1),
("Shauna", "Jackson",2,2);