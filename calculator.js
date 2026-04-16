
// ======= ELEMENT REFERENCES =======

const displayEl = document.getElementById('display');
const keysBasic = document.querySelector('.basic-keys');
const keysSci = document.querySelector('.sci-keys');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');

const clearHistoryBtn = document.getElementById('clear-history');
const runSampleBtn = document.getElementById('run-sample');
const toggleSciBtn = document.getElementById('toggle-scientific');
const toggleHistoryBtn = document.getElementById('toggle-history');

// ======= STATE =======

let currentExpression = '';
let history = [];

// Sample expressions for Run Sample
const samples = [
  '2+2',
  '7*3',
  '10/2',
  '9-4',
  '3+5*2',
  '12/3+1',
  '8*8-10'
];

let lastSampleIndex = null;

// ======= DISPLAY HELPERS =======

function updateDisplay(value) {
  displayEl.textContent = value;
}

// ======= BASIC INPUT =======

function appendValue(value) {
  if (displayEl.textContent === '0' && value !== '.') {
    currentExpression = value;
  } else {
    currentExpression += value;
  }
  updateDisplay(currentExpression);
}

function clearAll() {
  currentExpression = '';
  updateDisplay('0');
}

function deleteLast() {
  currentExpression = currentExpression.slice(0, -1);
  updateDisplay(currentExpression || '0');
}

// ======= EVALUATION =======

function evaluateExpression() {
  if (!currentExpression) return;

  try {
    const result = Function('"use strict";return (' + currentExpression + ')')(); // [web:83]
    addToHistory(currentExpression, result);
    currentExpression = String(result);
    updateDisplay(currentExpression);
  } catch (e) {
    updateDisplay('Error');
    currentExpression = '';
  }
}

// ======= HISTORY =======

function addToHistory(expr, result) {
  const item = `${expr} = ${result}`;
  history.unshift(item);
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = '';
  history.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = entry;
    historyList.appendChild(li);
  });
}

// ======= EVENT: CLEAR HISTORY =======

clearHistoryBtn.addEventListener('click', () => {
  history = [];
  renderHistory();
});

// ======= EVENT: BASIC KEYS (NUMBERS / OPS / = / AC / DEL) =======

keysBasic.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const action = btn.dataset.action;
  const value = btn.dataset.value;

  if (action === 'clear') {
    clearAll();
  } else if (action === 'delete') {
    deleteLast();
  } else if (action === 'equals') {
    evaluateExpression();
  } else if (value !== undefined) {
    appendValue(value);
  }
});

// ======= EVENT: SCIENTIFIC KEYS =======

keysSci.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const fn = btn.dataset.fn;

  if (fn === 'pi') {
    appendValue(Math.PI.toFixed(6));
    return;
  }

  if (!currentExpression) return;

  const x = parseFloat(currentExpression);
  if (Number.isNaN(x)) return;

  let result;
  switch (fn) {
    case 'sin':
      result = Math.sin(x);
      break;
    case 'cos':
      result = Math.cos(x);
      break;
    case 'tan':
      result = Math.tan(x);
      break;
    case 'sqrt':
      result = Math.sqrt(x);
      break;
    case 'pow2':
      result = Math.pow(x, 2);
      break;
    default:
      return;
  }

  addToHistory(`${fn}(${x})`, result);
  currentExpression = String(result);
  updateDisplay(currentExpression);
});

// ======= EVENT: RUN SAMPLE (RANDOM EACH CLICK) =======

runSampleBtn.addEventListener('click', () => {
  let idx;
  do {
    idx = Math.floor(Math.random() * samples.length);
  } while (idx === lastSampleIndex && samples.length > 1);

  lastSampleIndex = idx;

  const expr = samples[idx];
  currentExpression = expr;
  updateDisplay(expr);
  evaluateExpression();
});

// ======= EVENT: TOGGLE SCIENTIFIC KEYS =======

toggleSciBtn.addEventListener('click', () => {
  keysSci.classList.toggle('hidden');
});

// ======= EVENT: TOGGLE HISTORY PANEL =======

toggleHistoryBtn.addEventListener('click', () => {
  historyPanel.classList.toggle('hidden');
});

// ======= INIT =======

updateDisplay('0');
renderHistory();
