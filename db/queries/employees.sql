SELECT employee.id AS Employee_ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Job_Title, department.name AS Department_Name, role.salary AS Salary, employee.manager_id AS Manager
FROM employee
JOIN role
ON employee.id = role.department_id
JOIN department
ON employee.id = department.id;