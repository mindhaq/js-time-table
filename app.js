let model = {
  company: 'Mister Spex',
  name: '',
  salary: 0,
  list: []
};

let workingHours = 0;
let totalHours = 0;
let monthlySalary = 0;
let indexOfEntry = undefined;
let tableRows;

const heading = document.querySelector('.t-header__title');
const nameField = document.querySelector('#TTNameSurname');
const salaryField = document.querySelector('#TTHourlyWage');
const appOutput = document.querySelector('#TTHours');
const monthlySalaryOutput = document.querySelector('#TTMonthlySalary');
const scrollContainer = document.querySelector('.t-c-scrollContainer');
const ttDialog = document.querySelector('dialog');
const openDialogButton = document.querySelector('#TTOpenTimeDialog');
const closeDialogButton = document.querySelector('#TTCloseTimeDialog');
const ttForm = document.querySelector('dialog form');
const clearButton = document.querySelector('#clearButton');
const addButton = document.querySelector('#TTAddTime');
const printButton = document.querySelector('#TTPrintButton');
const tableBody = document.querySelector('table').tBodies[0];


const totalTimestamp = value => value.endTime - value.startTime - value.breakDuration;
const toHoursOfDay = value => parseFloat((totalTimestamp(value) / 1000 / 60 / 60).toFixed(2));
const bySumming = (acc, value) => acc += value;
const allHours = entries => entries.map(toHoursOfDay).reduce(bySumming);
const allHoursOutput = (entries) => {
  const total = entries.map(totalTimestamp).reduce(bySumming)
  return msToHHMM(total)
}
const getBreakDuration = () => ttForm.elements.TTBreak.valueAsNumber * 60 * 1000;
const getStartTime = () => ttForm.elements.TTStartTime.valueAsNumber;
const getEndTime = () => ttForm.elements.TTEndTime.valueAsNumber;

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
  monthlySalary = (totalHours * model.salary).toLocaleString("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });
};

const convertListIntoTable = (acc, value) => {
  const totalms = totalTimestamp(value);
  const hours = msToHHMM(totalms);
  const start = msToHHMM(value.startTime);
  const end = msToHHMM(value.endTime);
  const breakTime = msToHHMM(value.breakDuration);
  return `${acc}
      <tr>
        <td class="t-editEntry">${value.day}</td>
        <td>${start}</td>
        <td>${end}</td>
        <td>${breakTime}</td>
        <td class="t-deleteEntry">${hours}</td>
      </tr>`;
}

const sortByDay = () => {
  model.list.sort((next, current) => {
    if (next.day < current.day) return -1;
    if (next.day > current.day) return 1;
    return 0;
  });
};

const saveModelToLocalStorage = () => {
  sortByDay(model)
  localStorage.setItem('myData', JSON.stringify(model))
};

const render = (model) => {
  const tableHTMLString = model.list.reduce(convertListIntoTable, '');
  if (model.list.length > 0) {
    totalHours = allHours(model.list);
    workingHours = allHoursOutput(model.list);
  } else {
    totalHours = 0;
    workingHours = 0;
  }
  calculate();

  heading.innerText = model.name;
  nameField.value = model.name;
  salaryField.value = model.salary;
  appOutput.innerText = workingHours;
  monthlySalaryOutput.innerText = monthlySalary;

  tableBody.innerHTML = tableHTMLString;

  tableRows = document.querySelectorAll("tbody > tr");
  tableRows.forEach(tableRow => {
    const index = tableRow.rowIndex - 1
    tableRow.addEventListener('click', () => onEntryClicked(index))
  });
};

const onEntryClicked = (index) => {
  const elementClass = event.target.classList
  // console.log(elementClass)

  if (elementClass == '') {
    return
  }
  if (elementClass.contains('t-deleteEntry')) {
    model.list.splice(index, 1);
  }
  if (elementClass.contains('t-editEntry')) {
    indexOfEntry = index;
    ttForm.elements.TTDay.value = model.list[index].day;
    ttForm.elements.TTStartTime.valueAsNumber = model.list[index].startTime;
    ttForm.elements.TTEndTime.valueAsNumber = model.list[index].endTime;
    ttForm.elements.TTBreak.valueAsNumber = model.list[index].breakDuration / 60 / 1000;

    ttDialog.classList.add('editMode')
    ttDialog.showModal();
  }

  saveModelToLocalStorage();
  render(model);
}

const onDialogClosed = () => {
  const returnValue = ttDialog.returnValue;
  ttDialog.classList.remove('editMode');

  if (returnValue !== 'add' && returnValue !== 'edit') {
    return;
  }

  if (returnValue === 'edit' && indexOfEntry != undefined) {
    model.list.splice(indexOfEntry, 1);
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


  model.list.push(newEntry);
  ttDialog.returnValue = ''; // reset to avoid 'add'-state with next opening
  saveModelToLocalStorage();
  render(model);
};

const onNameFieldChanged = (event) => {
  const newName = event.target.value;
  model.name = newName;

  saveModelToLocalStorage();
  render(model);
};

const onSalaryFieldChanged = (event) => {
  const newSalary = event.target.value;
  model.salary = newSalary;

  saveModelToLocalStorage();
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

  ttDialog.returnValue = 'add'; // polyfill isn't handling returnValues correctly. It must be set here!
};

document.addEventListener('DOMContentLoaded', () => {
  const myData = localStorage.getItem('myData')

  if (myData !== null) {
    model = JSON.parse(myData)
  }

  nameField.addEventListener('keyup', onNameFieldChanged);
  salaryField.addEventListener('keyup', onSalaryFieldChanged);
  openDialogButton.addEventListener('click', () => ttDialog.showModal());
  closeDialogButton.addEventListener('click', () => ttDialog.close());
  ttDialog.addEventListener('close', onDialogClosed);
  clearButton.addEventListener('click', onClearButtonClicked);
  addButton.addEventListener('click', onAddButtonClicked);
  printButton.addEventListener('click', () => window.print())

  render(model);
});
