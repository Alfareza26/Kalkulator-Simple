"use strict";

// ================= ELEMENTS =================
const exprEl = document.getElementById("expr");
const resultEl = document.getElementById("result");
const keys = document.querySelector(".keys");

const overlay = document.getElementById("overlay");
const settingsPanel = document.getElementById("settingsPanel");
const historyPanel = document.getElementById("historyPanel");
const aboutPanel = document.getElementById("aboutPanel");
const historyEl = document.getElementById("history");
const welcomeOverlay = document.getElementById("welcomeOverlay");
const startBtn = document.getElementById("startBtn");

// ================= STATE =================
let expression = "";
let history = [];

function formatDisplay(expr) {
  if (!expr) return "0";

  return expr
    .replace(/Math\.sqrt\(/g, "√")
    .replace(/√\(/g, "√")
    .replace(/\*/g, "x")
    .replace(/\//g, ":")
    .replace(/\)/g, ""); // tanda tutup tidak ditampilkan
}

// ================= DISPLAY =================
function updateDisplay() {
  exprEl.textContent = formatDisplay(expression);

  if (!window.CalcLogic || !expression) {
    resultEl.textContent = "0";
    return;
  }

  // 🧠 AUTO CLOSE KURUNG UNTUK PREVIEW
  let tempExpr = expression;
  const open = (tempExpr.match(/\(/g) || []).length;
  const close = (tempExpr.match(/\)/g) || []).length;
  if (open > close) {
    tempExpr += ")".repeat(open - close);
  }

  const res = window.CalcLogic.evaluate(tempExpr);
  resultEl.textContent = isNaN(res) ? "0" : res;
}


// ================= INPUT =================
function addValue(val) {
  expression += val;
  updateDisplay();
}

function clearAll() {
  expression = "";
  updateDisplay();
}

function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function addParen() {
  const open = (expression.match(/\(/g) || []).length;
  const close = (expression.match(/\)/g) || []).length;
  expression += open > close ? ")" : "(";
  updateDisplay();
}

function addFn(fn) {
  expression += fn + "(";
  updateDisplay();
}

// ================= CALCULATE =================
function calculate() {
  const res = window.CalcLogic.evaluate(expression);
  if (isNaN(res)) return;

  history.unshift(`${expression} = ${res}`);
  if (history.length > 20) history.pop();

  renderHistory();
  expression = String(res);
  updateDisplay();
}

function renderHistory() {
  historyEl.innerHTML = history
    .map(h => `<div class="history-item">${h}</div>`)
    .join("");
}

// ================= BUTTONS =================
keys.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const val = btn.dataset.value;
  const fn = btn.dataset.fn;

  if (val) addValue(val);
  else if (fn === "clear") clearAll();
  else if (fn === "back") backspace();
  else if (fn === "equals") calculate();
  else if (fn === "paren") addParen();
  else if (fn === "sqrt") addValue("√(");
  else if (["sin", "cos", "tan"].includes(fn)) addFn(fn);
});

// ================= KEYBOARD =================
document.addEventListener("keydown", e => {
  if (/[0-9+\-*/.%]/.test(e.key)) addValue(e.key);
  if (e.key === "Enter") calculate();
  if (e.key === "Backspace") backspace();
  if (e.key === "Escape") clearAll();
  if (e.key === "(" || e.key === ")") addValue(e.key);
});

// ================= SETTINGS =================
document.getElementById("theme").onchange = e => {
  document.body.className = e.target.value + "-theme";
};

document.getElementById("fontsize").onchange = e => {
  document.documentElement.style.fontSize = e.target.value + "px";
};

document.getElementById("buttonshape").onchange = e => {
  document.body.dataset.shape = e.target.value;
};

// ================= PANELS =================
function closePanels() {
  settingsPanel.classList.remove("active");
  historyPanel.classList.remove("active");
  aboutPanel.classList.remove("active");
  overlay.classList.remove("show");
}

document.getElementById("menuBtn").onclick = () => {
  settingsPanel.classList.add("active");
  overlay.classList.add("show");
};

document.getElementById("historyBtn").onclick = () => {
  historyPanel.classList.add("active");
  overlay.classList.add("show");
};

document.getElementById("aboutBtn").onclick = () => {
  aboutPanel.classList.add("active");
  overlay.classList.add("show");
};

document.getElementById("closeMainMenu").onclick =
document.getElementById("closeHistory").onclick =
document.getElementById("closeAbout").onclick = closePanels;

overlay.onclick = closePanels;

// ================= WELCOME =================
startBtn.onclick = () => {
  welcomeOverlay.classList.add("hide");
  setTimeout(() => {
    welcomeOverlay.style.display = "none";
  }, 300);
};
// ================= WALLPAPER =================
const wallpaperInput = document.getElementById("wallpaperInput");
const display = document.querySelector(".display");

wallpaperInput.addEventListener("change", () => {
  const file = wallpaperInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    display.style.backgroundImage = `url(${reader.result})`;
    display.style.backgroundSize = "cover";
    display.style.backgroundPosition = "center";
    display.style.backgroundRepeat = "no-repeat";
    display.style.boxShadow = "inset 0 0 40px rgba(0,0,0,.65)";
  };
  reader.readAsDataURL(file);
});

let idleTimer;

function setIdle() {
  display.classList.add("idle");
}

function resetIdle() {
  display.classList.remove("idle");
  clearTimeout(idleTimer);
  idleTimer = setTimeout(setIdle, 3000);
}

["click", "keydown", "touchstart"].forEach(evt => {
  document.addEventListener(evt, resetIdle);
});

idleTimer = setTimeout(setIdle, 3000);

// ================= INIT =================
updateDisplay();
console.log("ModernCalc ready");
