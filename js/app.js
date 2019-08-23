let model = {
    company: 'Mister Spex',
    name: '',
    salary: 0,
    list: [
        {
            day: '',
            startTime: '',
            endTime: '',
            breakDuration: ''
        }
    ]
};

const hours = 8.0;

const heading = document.querySelector('h1');
const nameField = document.querySelector('#TTNameSurname');
const salaryField = document.querySelector('#TTHourlyWage');
const appOutput = document.querySelector('#TTHours');

const render = (model) => {
    heading.innerText = `${model.company} Time Sheet ${model.name}`;
    nameField.value = model.name
    salaryField.value = model.salary
    appOutput.innerText = `${hours} Hours`;
};

const onNameFieldChanged = (event) => {
    const newName = event.target.value;
    model.name = newName;

    localStorage.setItem('myData', JSON.stringify(model))
    console.log(`name field was changed to ${newName}`);
    render(model);
};

const onSalaryFieldChanged = (event) => {
    const newSalary = event.target.value;
    model.salary = newSalary;

    localStorage.setItem('myData', JSON.stringify(model))
    console.log(`salary field was changed to ${newSalary}`);
    render(model);
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('Hello, Mister Spex!');
    const myData = localStorage.getItem('myData')

    if(myData !== null) {
        model = JSON.parse(myData)
    }

    nameField.addEventListener('keyup', onNameFieldChanged);
    salaryField.addEventListener('keyup', onSalaryFieldChanged)

    render(model);
});
