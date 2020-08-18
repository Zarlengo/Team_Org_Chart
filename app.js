const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const FileIO = require("./lib/fileIO");
const fileIO = new FileIO();

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

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

const employeeQuestions = {
    type: "input",
    name: "name",
    message: "What is the name of the employee",
    validate: (name) => name !== ""
}

function getDetailedQuestions(employeeName) {
    return [{
            type: "input",
            name: "id",
            message: `What is the employee id for ${employeeName}`,
            validate: (name) => name !== ""
        },{
            type: "input",
            name: "email",
            message: `What is the email for ${employeeName}`,
            validate: (name) => name !== ""
        },{
            type: "list",
            name: "role",
            message: `What is the role for ${employeeName}`,
            choices: [
                "Manager",
                "Engineer",
                "Intern"],
            default: "Engineer",
            validate: (name) => name !== ""
        }];
}

function getBonusQuestion(employeeName, employeeRole) {
    return [{
            type: "input",
            name: "bonus",
            message: `What is the office number for ${employeeName}`,
            validate: (name) => name !== "",
            when: () => employeeRole == "Manager"
        },{
            type: "input",
            name: "bonus",
            message: `What is the github username for ${employeeName}`,
            validate: (name) => name !== "",
            when: () => employeeRole == "Engineer"
        },{
            type: "input",
            name: "bonus",
            message: `What is the school for ${employeeName}`,
            validate: (name) => name !== "",
            when: () => employeeRole == "Intern"
        }];
}

const additionalEmployee = {
    type: "confirm",
    name: "confirmation",
    message: "Would you like to add another employee",
    validate: (name) => name !== ""
}


async function init() {
    let keepAddingEmployees = true;
    let employeeArray = [];
    while (keepAddingEmployees) {
        let name = "";
        let id = "";
        let email = "";
        let role = "";
        let bonus = "";
        await inquirer.prompt(employeeQuestions)
                      .then(response => {name = response.name})
                      .catch(error => console.log(error));

        await inquirer.prompt(getDetailedQuestions(name))
                      .then(response => {
                        id = response.id;
                        email = response.email;
                        role = response.role;
                      })
                      .catch(error => console.log(error));

        await inquirer.prompt(getBonusQuestion(name, role))
                      .then(response => {
                        bonus = response.bonus;
                      })
                      .catch(error => console.log(error));

        let member = null;
        switch (role) {
            case "Manager":
                member = new Manager(name, id, email, bonus);
                break;
            case "Engineer":
                member = new Engineer(name, id, email, bonus);
                break;
            case "Intern":
                member = new Intern(name, id, email, bonus);
                break;
            default:
                member = new Engineer(name, id, email, bonus);
                break;
        }

        employeeArray.push(member);
        await inquirer.prompt(additionalEmployee)
                      .then(response => {keepAddingEmployees = response.confirmation;})
                      .catch(error => console.log(error));
    }
    fileIO.write(outputPath, render(employeeArray));
}

init();