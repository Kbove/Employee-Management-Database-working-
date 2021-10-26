INSERT INTO department (name)
VALUES
("Engineering"),
("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES
("Head Engineer",200000.00,1),
("Head of Marketing",140000.00,2);

INSERT INTO employee (first_name, last_name, role_id, manager)
VALUES
("Bob", "Jenkins",1,"Kyle Bove"),
("Shauna", "Jackson",2,"Amy Williams");