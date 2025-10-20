      (function () {
        const exprEl = document.getElementById("expr");
        const resultEl = document.getElementById("result");
        const historyEl = document.getElementById("history");
        const welcomeOverlay = document.getElementById("welcomeOverlay");
        const startBtn = document.getElementById("startBtn");
        const settingsBtn = document.getElementById("settingsBtn");
        const settingsPanel = document.getElementById("settingsPanel");
        const overlay = document.getElementById("overlay");
        const closeSettings = document.getElementById("closeSettings");
        const themeSel = document.getElementById("theme");
        const fontSel = document.getElementById("fontsize");
        const buttonShape = document.getElementById("buttonshape");

        let expr = "";
        let isFinal = false;
        const history = [];
        const OPS = ["+", "-", "*", "/", "%", "^"];

        // Welcome popup
        startBtn.onclick = () => (welcomeOverlay.style.display = "none");

        // Settings toggle
        settingsBtn.onclick = () => {
          settingsPanel.classList.add("open");
          overlay.style.display = "block";
        };
        closeSettings.onclick = overlay.onclick = () => {
          settingsPanel.classList.remove("open");
          overlay.style.display = "none";
        };

        function render() {
          exprEl.textContent = expr || "0";
          if (!isFinal) {
            try {
              const val = Function('"use strict";return(' + expr + ")")();
              resultEl.textContent = isNaN(val) ? "0" : val;
            } catch {
              resultEl.textContent = "0";
            }
          }
        }

        function append(v) {
          if (isFinal) {
            expr = "";
            isFinal = false;
          }
          const last = expr.slice(-1);
          if (OPS.includes(v) && OPS.includes(last)) {
            expr = expr.slice(0, -1) + v;
          } else {
            expr += v;
          }
          render();
        }

        function handleFn(f) {
          if (f === "clear") {
            expr = "";
            isFinal = false;
            render();
            return;
          }
          if (f === "back") {
            expr = expr.slice(0, -1);
            render();
            return;
          }
          if (f === "paren") {
            const o = (expr.match(/\(/g) || []).length;
            const c = (expr.match(/\)/g) || []).length;
            expr += o > c ? ")" : "(";
            render();
            return;
          }
          if (f === "equals") {
            try {
              const val = Function('"use strict";return(' + expr + ")")();
              history.unshift(expr + " = " + val);
              resultEl.textContent = val;
              expr = String(val);
              isFinal = true;
              renderHistory();
            } catch {
              resultEl.textContent = "Error";
            }
          }
        }

        function renderHistory() {
          historyEl.innerHTML = history
            .map((h) => `<div class="hist-item">${h}</div>`)
            .join("");
        }

        document.querySelectorAll(".keys button").forEach((b) => {
          b.onclick = () =>
            b.dataset.value
              ? append(b.dataset.value)
              : handleFn(b.dataset.fn);
        });

        window.onkeydown = (e) => {
          if (e.key === "Enter") return handleFn("equals");
          if (e.key === "Backspace") return handleFn("back");
          if (e.key === "c") return handleFn("clear");
          if (/^[0-9+\-*/%^().]$/.test(e.key)) return append(e.key);
        };

        // Hapus history via keyboard (Delete)
        window.addEventListener("keydown", (e) => {
          if (e.key === "d") {
            history.length = 0;
            renderHistory();
          }
          if (e.ctrlKey && e.key.toLowerCase() === "h") {
            historyEl.style.display =
              historyEl.style.display === "none" ? "block" : "none";
          }
        });

        // Tema & pengaturan
        themeSel.onchange = (e) => {
          const v = e.target.value;
          if (v === "blue")
            document.documentElement.style.setProperty("--accent", "#3b82f6");
          else if (v === "green")
            document.documentElement.style.setProperty("--accent", "#22c55e");
          else if (v === "light") {
            document.documentElement.style.setProperty("--bg", "#f8fafc");
            document.documentElement.style.setProperty("--card", "#fd0909ff");
            document.body.style.background =
              "linear-gradient(180deg,#f8fafc,#e2e8f0)";
            document.body.style.color = "#111111ff";
          } else
            document.documentElement.style.setProperty("--accent", "#7c3aed");
        };
        fontSel.oninput = (e) =>
          document.documentElement.style.setProperty(
            "--font-size",
            e.target.value + "px"
          );
        buttonShape.onchange = (e) => {
          const v = e.target.value;
          if (v === "round")
            document.documentElement.style.setProperty("--button-radius", "50%");
          else if (v === "square")
            document.documentElement.style.setProperty("--button-radius", "0");
          else
            document.documentElement.style.setProperty("--button-radius", "10px");
        };

        render();
      })();