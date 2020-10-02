const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

let employees = [];

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
inquirer
    .prompt([
        {
            type: "input",
            message: "What is the manager's name?",
            name: "name"
        },
        {
            type: "input",
            message: "What is the manager's employee id?",
            name: "id"
        },
        {
            type: "input",
            message: "What is the manger's email address?",
            name: "email"
        },
        {
            type: "input",
            message: "What is the manager's office number?",
            name: "officeNumber"
        }
    ]).then(function (res) {

        const manager = new Manager(res.name, res.id, res.email, res.officeNumber);

        employees.push(manager);
        addEmployee();
    });

function addEmployee() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Which type of employee would you like to add?",
                choices: ["Engineer", "Intern"],
                name: "role"
            },
            {
                type: "input",
                message: "What is their name?",
                name: "name"
            },
            {
                type: "input",
                message: "What is their employee id?",
                name: "id"
            },
            {
                type: "input",
                message: "What is their email address?",
                name: "email"
            },
            {
                type: "input",
                message: "What is their github account?",
                name: "github",
                when: (res) => res.role === "Engineer"
            },
            {
                type: "input",
                message: "What is their university?",
                name: "school",
                when: (res) => res.role === "Intern"
            },
            {
                type: "list",
                message: "Would you like to add any more employees?",
                choices: ["Yes", "No"],
                name: "addEmployee"
            }
        ]).then(function (res) {
            console.log(res.role);
            console.log(res.addEmployee);
            if (res.role === "Engineer") {
                const engineer = new Engineer(res.name, res.id, res.email, res.github);
                employees.push(engineer);
            } else if (res.role === "Intern") {
                const intern = new Intern(res.name, res.id, res.email, res.school);
                employees.push(intern);
            }

            if (res.addEmployee === "Yes") {
                addEmployee();
            } else if (res.addEmployee === "No") {
                const renderEmployees = render(employees);

                if (!fs.existsSync('\output')) {
                    console.log('Creating new directory');
                    fs.mkdirSync('\output');
                } else {
                    console.log('Directory already exists');
                }
                fs.writeFile(outputPath, renderEmployees, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log('Employees html generated!');
                });

            }
        })
        
}
    // After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
