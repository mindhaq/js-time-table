let model = {
    company: 'Mister Spex',
    name: '',
    salary: 0,
    list: [
        {
            day: '2019-08-20',
            startTime: 8,
            endTime: 17,
            breakDuration: 1
        },
        {
            day: '2019-08-25',
            startTime: 10,
            endTime: 21,
            breakDuration: 2
        },
        {
            day: '2019-08-29',
            startTime: 9,
            endTime: 15,
            breakDuration: 0.5
        }
    ]
};

const hours = 8.0;
let monthlySalary = 0;

const heading = document.querySelector('h1');
const nameField = document.querySelector('#TTNameSurname');
const salaryField = document.querySelector('#TTHourlyWage');
const appOutput = document.querySelector('#TTHours');
const monthlySalaryOutput = document.querySelector('#TTMonthlySalary');
const scrollContainer = document.querySelector('.tt-c-scrollContainer');

const calculate = () => {
    monthlySalary = hours * model.salary;
};

const render = (model) => {
    heading.innerText = `${model.company} Time Sheet ${model.name}`;
    nameField.value = model.name
    salaryField.value = model.salary
    appOutput.innerText = `${hours} Hours`;
    monthlySalaryOutput.innerText = `${monthlySalary} €`;
    scrollContainer.innerHTML = '<b>This will be my table.</b>';
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
    calculate();
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

    calculate();
    render(model);
});
