let model = {
    company: 'Mister Spex',
    name: '',
    salary: 0,
    list: []
};

let workingHours = 0;
let totalHours = 0;
let monthlySalary = 0;

const heading = document.querySelector('h1');
const nameField = document.querySelector('#TTNameSurname');
const salaryField = document.querySelector('#TTHourlyWage');
const appOutput = document.querySelector('#TTHours');
const monthlySalaryOutput = document.querySelector('#TTMonthlySalary');
const scrollContainer = document.querySelector('.tt-c-scrollContainer');
const ttDialog = document.querySelector('dialog');
const openDialogButton = document.querySelector('button.tt-button--opendialog');
const closeDialogButton = document.querySelector('button.tt-button--closedialog');
const ttForm = document.querySelector('dialog form');
const clearButton = document.querySelector('#clearButton');
const addButton = document.querySelector('button.tt-button--add');

const totalTimestamp = value => value.endTime - value.startTime - value.breakDuration;
const toHoursOfDay = value => parseFloat((totalTimestamp(value) / 1000 / 60 / 60).toFixed(2));
const bySumming = (acc, value) => acc += value;
const allHours = entries => entries.map(toHoursOfDay).reduce(bySumming);
const allHoursOutput = (entries) => {
    const total = entries.map(totalTimestamp).reduce(bySumming)
    return msToHHMM(total)
}

const msToHHMM = (ms) => {
    let min = ms / 1000 / 60;
    let hours = min / 60;
    let hh = Math.floor(min / 60);
    let mm = Math.round((hours - hh) * 60);
  
    hh = String(hh).padStart(2, "0");
    mm = String(mm).padStart(2, "0");
    return hh + ":" + mm
}

const calculate = () => { 
    monthlySalary = (totalHours * model.salary).toLocaleString("de-DE", {style: "currency", currency: "EUR", minimumFractionDigits: 2});
};

const convertListIntoTable = (acc, value) => {
    const totalms = totalTimestamp(value)
    const hours = msToHHMM(totalms)
    return `${acc}<tr><td>${value.day}</td><td>${hours} Hours</td></tr>`
}

const saveModelToLocalStorage = () => localStorage.setItem('myData', JSON.stringify(model));

const render = (model) => {
    const tableHTMLString = model.list.reduce(convertListIntoTable, '<table><tbody>') + '</tbody></table>';
    if(model.list.length > 0) {
        totalHours = allHours(model.list);
        workingHours = allHoursOutput(model.list)
    } else {
        totalHours = 0;
        workingHours = 0;
    }
    console.log(totalHours, workingHours)
    calculate();

    heading.innerText = `${model.company} Time Sheet ${model.name}`;
    nameField.value = model.name
    salaryField.value = model.salary
    appOutput.innerText = `${workingHours} Hours`;
    monthlySalaryOutput.innerText = monthlySalary;

    scrollContainer.innerHTML = tableHTMLString;
};

const getBreakDuration = () => ttForm.elements.TTBreak.valueAsNumber;
const getStartTime = () => ttForm.elements.TTStartTime.valueAsNumber;
const getEndTime = () => ttForm.elements.TTEndTime.valueAsNumber;

const onDialogClosed = () => {
    const returnValue = ttDialog.returnValue;
    console.log(`Dialog was closed with ${returnValue}.`);
    if (returnValue !== 'add') {
        return;
    }

    const day = ttForm.elements.TTDay.value;
    const breakDuration = getBreakDuration();
    const startTime = getStartTime();
    const endTime = getEndTime();

    const newEntry = {
        day,
        startTime,
        endTime,
        breakDuration
    };

    console.log('Adding new timetable entry.', newEntry);

    model.list.push(newEntry);
    saveModelToLocalStorage();

    render(model);
};

const onNameFieldChanged = (event) => {
    const newName = event.target.value;
    model.name = newName;

    saveModelToLocalStorage();
    console.log(`name field was changed to ${newName}`);
    render(model);
};

const onSalaryFieldChanged = (event) => {
    const newSalary = event.target.value;
    model.salary = newSalary;

    saveModelToLocalStorage();
    console.log(`salary field was changed to ${newSalary}`);
    render(model);
};

const onClearButtonClicked = (event) => {
    if (window.confirm('Do you really want to delete all entries?')) {
        model.list = [];
        saveModelToLocalStorage();
        render(model);
    }
};

const isStartBeforeEnd = () => getStartTime() < getEndTime();

const isBreakDurationLongerThanWorkday = () => getBreakDuration() > (getEndTime() - getStartTime());

const isDateAfterToday = () => ttForm.elements.TTDay.valueAsDate > new Date();

const onAddButtonClicked = (event) => {
    if (ttForm.reportValidity() === false) {
        event.preventDefault();
        return;
    }

    if (isStartBeforeEnd() === false) {
        window.alert('Start must be before end!');
        event.preventDefault();
        return;
    }

    if (isBreakDurationLongerThanWorkday()) {
        window.alert(`You didn't work at all?`);
        event.preventDefault();
        return;
    }

    if (isDateAfterToday()) {
        window.alert(`You cannot enter data for the future, McFly!`);
        event.preventDefault();
        return;
    }

    if (window.confirm('Are you sure your data makes sense?') == false) {
        event.preventDefault();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('Hello, Mister Spex!');
    const myData = localStorage.getItem('myData')

    if(myData !== null) {
        model = JSON.parse(myData)
    }

    nameField.addEventListener('keyup', onNameFieldChanged);
    salaryField.addEventListener('keyup', onSalaryFieldChanged);
    openDialogButton.addEventListener('click', () => {
        ttDialog.showModal();
    });
    closeDialogButton.addEventListener('click', () => ttDialog.close());
    ttDialog.addEventListener('close', onDialogClosed);
    clearButton.addEventListener('click', onClearButtonClicked);
    addButton.addEventListener('click', onAddButtonClicked);

    render(model);
});
