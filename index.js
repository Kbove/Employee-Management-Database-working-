// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer')
const cTable = require('console.table');

const newDeptArr = []


// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password here
      password: 'password',
      database: 'cms_db'
    },
    console.log(`Connected to the cms_db database.`)
);

function menu() {
inquirer.prompt([
    {
       name: 'mainMenu',
       message: 'What would you like to do?',
       type: 'list',
       choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role']
    }
]).then(ans => {
    switch(ans.mainMenu){
        case 'View all departments':
            console.log("View depts selected")
            viewDepts();
            break;
        case 'View all roles':
            console.log("View roles selected")
            viewRoles();
            break;
        case 'View all employees':
            console.log("View employees selected")
            viewEmps();
            break;
        case 'Add a department':
            console.log("Add a dept selected")
            addDept();
            break;
        case 'Add a role':
            console.log("Add a role selected")
            addRole();
            break;
        case 'Add an employee':
            console.log("Add an employee selected")
            addEmp();
            break;
        case 'Update employee role':
            console.log("Update employee")
            updateEmp();
            break;
        default:
            menu();
            console.log("Looks like we're done here!")
            break;    
    }
})
}

function viewDepts(){
    db.query('SELECT * FROM department', function (err, results) {
        console.table("Departments", results);
        if (err) throw err;
    });
    menu();
}

function viewRoles(){
    db.query(/*'SELECT role.title AS Job_Title, employee.role_id AS Role_ID, department.name AS Department, role.salary AS Salary FROM role JOIN department ON department.id = role.department_id JOIN employee ON role.id = employee.role_id;'*/'SELECT * FROM role', function (err, results) {
        console.table("Roles", results);
        if (err) throw err;
    });
    db.query('SELECT role.title AS Job_Title, employee.role_id AS Role_ID, department.name AS Department, role.salary AS Salary FROM role LEFT JOIN department ON department.id = role.department_id LEFT JOIN employee ON role.id = employee.role_id;', function (err, results) {
        console.table("Roles", results);
        if (err) throw err;
    });
    menu();
}

function viewEmps(){
    db.query(/*'Select employee.id AS Employee_ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Job_Title, department.name AS Department_Name, role.salary AS Salary, employee.manager AS Manager FROM employee JOIN role ON employee.id = role.department_id JOIN department ON employee.id = department.id;'*/'SELECT * FROM employee', function (err, results) {
        console.table("Employees", results);
        if (err) throw err;
    });
    db.query('Select employee.id AS Employee_ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Job_Title, department.name AS Department_Name, role.salary AS Salary, employee.manager_id AS Manager FROM employee LEFT JOIN role ON employee.id = role.department_id LEFT JOIN department ON employee.id = department.id;', function (err, results) {
        console.table("Employees", results);
        if (err) throw err;
    });
    menu();
}

function addDept(){
    inquirer.prompt([
        {
           name: 'name',
           message: 'Type in a department name',
           type: 'input'
        }
    ]).then(deptObj=>{
        console.log(deptObj)
        const newDept = deptObj.name
        newDeptArr.push(newDept)
        console.log(newDept)
            db.query(`INSERT INTO department (name)
            VALUES (?)`, newDept, (err, result) => {
                console.log(newDept)
              if (err) throw err;
            menu()
    })
})
};


function addRole(){
    inquirer.prompt([
        {
           name: 'title',
           message: 'What is the name of the role?',
           type: 'input'
        },
        {
            name: 'salary',
            message: 'Type in a salary for this role',
            type: 'input'
        },
        {
            name: 'roleDept',
            message: 'Which department is this role in?',
            type: 'list',
            choices: newDeptArr
        }
    ]).then(data=>{
        console.log(data)
        const newTitle = data.title
        const newSalary = data.salary
        const newDept = data.roleDept

        console.log(newTitle,newSalary,newDept)
            db.query(`INSERT INTO role (title,salary)
            VALUES (?,?)`,[newTitle,newSalary], (err, result) => {
                console.log(newTitle,newSalary,newDept)
              if (err) throw err;
            menu()
    })
})
};

function addEmp(){
    inquirer.prompt([
        {
           name: "firstName",
           message: "What is the employees first name?",
           type: "input"
        },
        {
            name: 'lastName',
            message: "What is the employee's last name?",
            type: 'input'
        },
        {
            name: "empRole",
            message: "What is this employees role?",
            type: "input"
        },
        {
            name: "manager",
            message: "Who is this employee's manager?",
            type: "input"
        }
    ]).then(data=>{
        console.log(data)
        const newFirstName = data.firstName
        const newLastName = data.lastName
        const newEmpRole = data.empRole
        const newEmpManager = data.empManager
        console.log(newFirstName,newLastName,newEmpRole,newEmpManager)

        const managersArr = []
        managersArr.push(newEmpManager)
        console.log(managersArr)

        const roleArr = []
        roleArr.push(newEmpRole)
        console.log(roleArr)

            db.query(`INSERT INTO employee (first_name,last_name)
            VALUES (?,?)`,[newFirstName,newLastName], (err, result) => {
              if (err) throw err;
            menu()
    })
})
}

menu();
