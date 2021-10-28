DROP DATABASE IF EXISTS cms_db;
CREATE DATABASE cms_db;

USE cms_db;

CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY not null,
    name VARCHAR(30)
);

CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT not null,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    
);

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT not null,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    ON DELETE SET NULL
);