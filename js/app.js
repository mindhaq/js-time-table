const model = {
    company: 'Mister Spex',
    name: '',
    salaray: 0,
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
const appOutput = document.querySelector('#TTHours');

const render = (model) => {
    heading.innerText = `${model.company} Time Sheet${model.name !== '' ? ` for ${model.name}` : ''}`;
    appOutput.innerText = `${hours} Hours`;
};

const onNameFieldChanged = (event) => {
    const newName = event.target.value;
    model.name = newName;
    console.log(`name field was changed to ${newName}`);
    render(model);
};

const onSalaryFieldChanged = (event) => {
    const newSalaray = event.target.value;
    model.salaray = newSalaray;
    console.log(`salary field was changed to ${newSalaray}`);
    render(model);
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('Hello, Mister Spex!');
    console.log(`Heading is ${heading.innerText}.`);

    nameField.addEventListener('keyup', onNameFieldChanged);

    render(model);
});
