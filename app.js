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
const ttAction = document.querySelector('.t-table__action');
const ttDeleteEntry = document.querySelector('#TTDeleteEntry');
const ttEditEntry = document.querySelector('#TTEditEntry');
const ttDownloadData = document.querySelector('#TTDownloadData');
const ttUploadData = document.querySelector('#TTUploadData');

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
  return hh + ":" + mm;
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
        <td>${value.day}</td>
        <td>${start}</td>
        <td>${end}</td>
        <td>${breakTime}</td>
        <td class="t-entryAction">${hours}</td>
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
  sortByDay(model);
  localStorage.setItem('myData', JSON.stringify(model));
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
    tableRow.addEventListener('click', onEntryClicked);
  });
};

const onEntryClicked = () => {
  const elementClass = event.target.classList;
  const index = event.target.parentElement.rowIndex - 1;

  if (elementClass.contains('t-entryAction')) {
    ttAction.style.top = event.target.offsetHeight + event.target.offsetTop + 'px';
    ttAction.style.display = 'grid';
    indexOfEntry = index;
  } else {
    ttAction.style.display = 'none';
    indexOfEntry = undefined;
  }
}

const onDeleteEntryClicked = () => {
  if (indexOfEntry == undefined) {
    return
  }
  model.list.splice(indexOfEntry, 1);
  ttAction.style.display = 'none';
  saveModelToLocalStorage();
  render(model);
}

const onEditEntryClicked = () => {
  if (indexOfEntry == undefined) {
    return
  }
  ttForm.elements.TTDay.value = model.list[indexOfEntry].day;
  ttForm.elements.TTStartTime.valueAsNumber = model.list[indexOfEntry].startTime;
  ttForm.elements.TTEndTime.valueAsNumber = model.list[indexOfEntry].endTime;
  ttForm.elements.TTBreak.valueAsNumber = model.list[indexOfEntry].breakDuration / 60 / 1000;

  ttDialog.classList.add('editMode')
  ttDialog.showModal();
  ttAction.style.display = 'none';
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

// no error handling included (e.g. empty file)
const onDownloadDataClicked = () => {
  const myData = localStorage.getItem('myData')
  ttDownloadData.setAttribute('href', 'data:text/plain,' + myData)
}

const onUploadDataClicked = () => {
  const fileLoader = document.querySelector('#FileLoader');
  fileLoader.onchange = saveFileToLocalstorage;
  fileLoader.click();
}

const saveFileToLocalstorage = () => {
  const reader = new FileReader();
  reader.onload = handleFileRead;

  const file = event.target.files[0];
  reader.readAsText(file); // fires onload when done.
}

const handleFileRead = (event) => {
  model = JSON.parse(event.target.result);
  saveModelToLocalStorage();
  render(model);
}

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
  printButton.addEventListener('click', () => window.print());
  ttDeleteEntry.addEventListener('click', onDeleteEntryClicked);
  ttEditEntry.addEventListener('click', onEditEntryClicked);
  ttDownloadData.addEventListener('click', onDownloadDataClicked);
  ttUploadData.addEventListener('click', onUploadDataClicked);

  render(model);
});
