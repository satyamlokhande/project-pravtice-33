const expressionEl = document.querySelector("#expression");
const resultEl = document.querySelector("#result");
const calculator = document.querySelector(".calculator");
const themeToggle = document.querySelector("#themeToggle");

let current = "0";
let expression = "";
let justEvaluated = false;

function render() {
  expressionEl.textContent = expression || "Ready";
  resultEl.textContent = current;
}

function appendValue(value) {
  if (justEvaluated && /[0-9.]/.test(value)) {
    current = "0";
    expression = "";
    justEvaluated = false;
  }

  if (value === ".") {
    if (current.includes(".")) return;
    current += ".";
    if (current === "0.") render();
    else render();
    return;
  }

  if (["+", "-", "*", "/"].includes(value)) {
    if (current === "Error") return clear();
    expression = `${expression || current} ${value}`;
    current = "0";
    justEvaluated = false;
  } else if (value === "%") {
    current = formatNumber(Number(current) / 100);
  } else {
    current = current === "0" ? value : current + value;
  }
  render();
}

function clear() {
  current = "0";
  expression = "";
  justEvaluated = false;
  render();
}

function backspace() {
  if (justEvaluated) return clear();
  current = current.length > 1 ? current.slice(0, -1) : "0";
  if (current === "-") current = "0";
  render();
}

function calculate() {
  if (!expression || current === "Error") return;
  const fullExpression = `${expression} ${current}`;
  const tokens = fullExpression.trim().split(/\s+/);
  let total = Number(tokens[0]);

  if (!Number.isFinite(total)) return showError();
  for (let index = 1; index < tokens.length; index += 2) {
    const operator = tokens[index];
    const next = Number(tokens[index + 1]);
    if (!Number.isFinite(next)) return showError();
    if (operator === "+") total += next;
    if (operator === "-") total -= next;
    if (operator === "*") total *= next;
    if (operator === "/") {
      if (next === 0) return showError();
      total /= next;
    }
  }

  expression = `${fullExpression} =`;
  current = formatNumber(total);
  justEvaluated = true;
  render();
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return "Error";
  return String(Number(value.toPrecision(12)));
}

function showError() {
  expression = "Cannot divide by zero";
  current = "Error";
  justEvaluated = true;
  render();
}

calculator.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.action === "clear") clear();
  else if (button.dataset.action === "backspace") backspace();
  else if (button.dataset.action === "equals") calculate();
  else appendValue(button.dataset.value);
});

document.addEventListener("keydown", (event) => {
  const keyMap = { Enter: "equals", Escape: "clear", Backspace: "backspace" };
  if (keyMap[event.key]) {
    event.preventDefault();
    calculator.querySelector(`[data-action="${keyMap[event.key]}"]`).click();
  } else if ("0123456789.+-*/%".includes(event.key)) {
    event.preventDefault();
    appendValue(event.key);
  }
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☾" : "☼";
});

render();
