const mysql = require('mysql2');
const inquirer = require('inquirer')
const cTable = require('console.table');

const deptsArray = []
const rolesArray = []
const managersArray = []
const employeesArray = []

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

function roleDeptChoices() {
    db.query(`SELECT * FROM department`, (err, result) => {
        for (let j = 0; j < result.length; j++) {
            const deptString = result[j].name
            deptsArray.push(deptString)
        }
    })
}

function empRoleChoices() {
    db.query(`SELECT * FROM role`, (err, result) => {
        for (let k = 0; k < result.length; k++) {
            const roleString = result[k].title
            rolesArray.push(roleString)
        }
    })
}

function managerChoices() {
    db.query(`SELECT CONCAT(first_name, ' ',last_name) AS name FROM employee`, (err, results) => {
        if (err) {
            console.log(err)
        } else {
            console.log(results)
            for (let x = 0; x < results.length; x++) {
                const managerString = results[x].name
                managersArray.push(managerString)
            }
        }
    })
}

function menu() {
    inquirer.prompt([
        {
            name: 'mainMenu',
            message: 'What would you like to do?',
            type: 'list',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role']
        }
    ]).then(ans => {
        switch (ans.mainMenu) {
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

function viewDepts() {
    db.query('SELECT * FROM department', function (err, results) {
        console.table("Departments", results);
        if (err) throw err;
    });
    menu();
}

function viewRoles() {
    db.query('SELECT role.id AS Role_ID, role.title AS Job_Title, department.name AS Department, role.salary AS Salary FROM role LEFT JOIN department ON department.id = role.department_id LEFT JOIN employee ON role.id = employee.role_id;', function (err, results) {
        console.table("Roles", results);
        if (err) throw err;
    });
    menu();
}

function viewEmps() {
    db.query('SELECT * FROM employee', function (err, results) {
        console.table("Employees", results);
        if (err) throw err;
    });
    console.log("==================================")
    const sql = `SELECT employee.id, employee.first_name,employee.last_name, role.title, department.name AS Department,role.salary, CONCAT(m.first_name, ' ',m.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee m ON employee.manager_id = m.id;`
    db.query(sql, (err, results) => {
        console.table(results)
    })
    menu();
}



function addDept() {
    inquirer.prompt([
        {
            name: 'name',
            message: 'Type in a department name',
            type: 'input'
        }
    ]).then(data => {
        console.log(data)
        const newDept = data.name;
        db.query(`INSERT INTO department (name)
            VALUES (?)`, newDept, (err, result) => {
            console.log(newDept)
            if (err) {
                console.log(err)
            } else {
                deptsArray.push(newDept)
            }
            menu();
        })
    })
};



function addRole() {
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
            name: 'dept',
            message: 'Which department is this role in?',
            type: 'list',
            choices: deptsArray
        }
    ]).then(data => {
        console.log(data)
        const roleTitle = data.title
        const roleSalary = data.salary
        const roleDept = data.dept

        db.query(`SELECT * FROM department`, (err, results) => {
            if (err) {
                console.log(err)
            } else {
                console.log(results)

                db.query(`SELECT * FROM department WHERE name = (?)`, roleDept, (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(results);
                        for (let i = 0; i < results.length; i++) {
                            const deptID = results[i].id

                            console.log(roleTitle, roleSalary, deptID)
                            db.query(`INSERT INTO role (title,salary,department_id)
                    VALUES (?,?,?)`, [roleTitle, roleSalary, deptID], (err, result) => {
                                console.log(roleTitle, roleSalary, deptID)
                                if (err) {
                                    console.log(err)
                                } else {
                                    rolesArray.push(roleTitle)
                                }
                            })
                            menu()
                        }
                    }
                });
            }
        })
    });
};

function addEmp() {
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
            name: "role",
            message: "What is this employee's title?",
            type: "list",
            choices: rolesArray
        },
        {
            name: "manager",
            message: "Who is this employee's manager?",
            type: "list",
            choices: [...managersArray, "No Manager"],
        }
    ]).then(data => {
        console.log(data)
        const empFirstName = data.firstName
        const empLastName = data.lastName
        const empRole = data.role
        const empManager = data.manager


        db.query(`SELECT * FROM role WHERE title = (?)`, empRole, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                console.log(results);
                for (let y = 0; y < results.length; y++) {
                    const roleID = results[y].id

                    let str = empManager
                    const managerSplit = str.split(" ")
                    console.log(managerSplit)
                    const managerFirstName = managerSplit[0]
                    const managerLastName = managerSplit[1]
                    console.log(managerFirstName, managerLastName)
                    db.query(`SELECT * FROM employee WHERE first_name = "${managerFirstName}" AND last_name = "${managerLastName}"`, (err, results) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(results)
                            if (!results.length) {
                                db.query(`INSERT INTO employee (first_name,last_name,role_id)
                                VALUES (?,?,?)`, [empFirstName, empLastName, roleID], (err, result) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        const newManager = empFirstName.concat(empLastName)
                                        managersArray.push(newManager)
                                    }
                                    menu()
                                })
                            } else {
                                for (let z = 0; z < results.length; z++) {
                                    const managerID = results[z].id
                                    console.log(empFirstName, empLastName, roleID, managerID)

                                            db.query(`INSERT INTO employee (first_name,last_name,role_id,manager_id)
                                    VALUES (?,?,?,?)`, [empFirstName, empLastName, roleID, managerID], (err, result) => {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    const newManager = empFirstName.concat(empLastName)
                                                    managersArray.push(newManager)
                                                }
                                                menu()
                                    })
                                }
                            }
                        }
                    })
                }
            }
        })
        //     }
        // })
    })
}

function updateEmp() {
    db.query('SELECT * FROM employee', function (err, results) {
        if (err) {
            console.log(err);
        } else {
        for (let i = 0; i < results.length; i++) {
            let employeeName = results[i].first_name + " " + results[i].last_name
            employeesArray.push(employeeName)
        }
        inquirer.prompt([
            {
                name: 'empName',
                message: 'Select an employee to update',
                type: 'list',
                choices: employeesArray,
            },
            {
                name: 'newRole',
                message: "What is this employee's new role?",
                type: 'list',
                choices: rolesArray
            }
        ]).then(data => {
            let fullName = data.empName.split(' ')
            let firstName = fullName[0]
            let lastName = fullName[1]
            let role = data.newRole
            db.query(`SELECT * FROM role WHERE title = "${role}"`, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result)
                    let newRoleID = result[0].id
                    db.query(`UPDATE employee SET role_id = "${newRoleID}" WHERE first_name = "${firstName}" AND last_name = "${lastName}"`, (err, userData) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(userData)
                        }
                    })
                }
            })
        })
    }});
    menu()
}


menu();
roleDeptChoices();
empRoleChoices();
managerChoices();
