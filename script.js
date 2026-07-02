const historyEl = document.getElementById("history");
const currentEl = document.getElementById("current");
const keys = document.querySelectorAll(".key");

let currentValue = "0";
let previousValue = null;
let operator = null;
let shouldResetCurrent = false;

function updateDisplay() {
  currentEl.textContent = currentValue;

  if (operator && previousValue !== null) {
    historyEl.textContent = `${previousValue} ${symbolFor(operator)}`;
  } else {
    historyEl.textContent = "";
  }
}

function symbolFor(op) {
  return { add: "+", subtract: "−", multiply: "×", divide: "÷" }[op] || "";
}

function inputDigit(digit) {
  if (currentValue === "0" || shouldResetCurrent) {
    currentValue = digit;
    shouldResetCurrent = false;
  } else {
    currentValue += digit;
  }
}

function inputDecimal() {
  if (shouldResetCurrent) {
    currentValue = "0";
    shouldResetCurrent = false;
  }
  if (!currentValue.includes(".")) {
    currentValue += ".";
  }
}

function chooseOperator(nextOperator) {
  if (operator && !shouldResetCurrent) {
    compute();
  }
  previousValue = currentValue;
  operator = nextOperator;
  shouldResetCurrent = true;
}

function compute() {
  if (operator === null || previousValue === null) return;

  const a = parseFloat(previousValue);
  const b = parseFloat(currentValue);
  let result;

  switch (operator) {
    case "add":
      result = a + b;
      break;
    case "subtract":
      result = a - b;
      break;
    case "multiply":
      result = a * b;
      break;
    case "divide":
      result = b === 0 ? "Undefined" : a / b;
      break;
    default:
      return;
  }

  currentValue = typeof result === "number"
    ? String(Math.round(result * 1e10) / 1e10)
    : result;

  operator = null;
  previousValue = null;
  shouldResetCurrent = true;
}

function clearAll() {
  currentValue = "0";
  previousValue = null;
  operator = null;
  shouldResetCurrent = false;
}

function negate() {
  if (currentValue === "0") return;
  currentValue = currentValue.startsWith("-")
    ? currentValue.slice(1)
    : "-" + currentValue;
}

function percent() {
  currentValue = String(parseFloat(currentValue) / 100);
}

keys.forEach((key) => {
  key.addEventListener("click", () => {
    const digit = key.dataset.number;
    const action = key.dataset.action;

    if (digit !== undefined) {
      inputDigit(digit);
    } else if (action === "decimal") {
      inputDecimal();
    } else if (action === "clear") {
      clearAll();
    } else if (action === "negate") {
      negate();
    } else if (action === "percent") {
      percent();
    } else if (action === "equals") {
      compute();
    } else if (["add", "subtract", "multiply", "divide"].includes(action)) {
      chooseOperator(action);
    }

    updateDisplay();
  });
});

window.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") inputDigit(e.key);
  else if (e.key === ".") inputDecimal();
  else if (e.key === "+") chooseOperator("add");
  else if (e.key === "-") chooseOperator("subtract");
  else if (e.key === "*") chooseOperator("multiply");
  else if (e.key === "/") chooseOperator("divide");
  else if (e.key === "Enter" || e.key === "=") compute();
  else if (e.key === "Escape") clearAll();
  else return;

  updateDisplay();
});

updateDisplay();
