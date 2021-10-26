SELECT role.title AS Job_Title, employee.role_id AS Role_ID, department.name AS Department, role.salary AS Salary
FROM role
JOIN department 
ON department.id = role.department_id
JOIN employee 
ON role.id = employee.role_id;

