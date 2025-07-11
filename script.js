const display = document.querySelector('.display');
const buttons = document.querySelectorAll('button');
const lightIcon = document.getElementById("light-icon");
const darkIcon = document.getElementById("dark-icon");

const lightBackspace = document.getElementById("light-backspace");
const darkBackspace = document.getElementById("dark-backspace");

const specialChars = ["%", "/", "*", "-", "+", "=", "^"];
let output = "";
let backspaceInterval;
let backspaceTimeout;

const calculate = (btnValue) => {
  // Clear Error on any input
  if (output === "Error") output = "";

  // Prevent multiple dots in same number segment
  if (btnValue === ".") {
    const segments = output.split(/[\+\-\*\/\%\^\(\)]/);
    const currentSegment = segments[segments.length - 1];

    if (currentSegment.includes(".")) return; // already has a dot
    if (output === "" || /[+\-*/%^]$/.test(output)) {
      output += "0"; // allow 0. prefix like `.5` => `0.5`
    }
  }

  if (btnValue === "=" && output !== "") {
    try {
      let parsed = output
        .replace(/(\d+(?:\.\d+)?)([+\-])(\d+(?:\.\d+)?)%/g,
          (match, base, operator, percent) => `${base}${operator}(${base}*${percent}/100)`)
        .replace(/\^/g, "**");

      let result = eval(parsed);
      let rounded = result.toFixed(3).replace(/\.?0+$/, "");
      output = rounded;
    } catch {
      output = "Error";
    }
  }

  else if (btnValue === "AC") {
    output = "";
  }

  else if (btnValue === "( )") {
    const open = (output.match(/\(/g) || []).length;
    const close = (output.match(/\)/g) || []).length;
    output += open > close ? ")" : "(";
  }

  else if (specialChars.includes(btnValue)) {
    if (output === "") return;
    const lastChar = output[output.length - 1];
    if (specialChars.includes(lastChar)) {
      try {
        let parsed = output
          .replace(/(\d+(?:\.\d+)?)([+\-])(\d+(?:\.\d+)?)%/g,
            (match, base, operator, percent) => `${base}${operator}(${base}*${percent}/100)`)
          .replace(/\^/g, "**");

        let result = eval(parsed);
        let rounded = result.toFixed(3).replace(/\.?0+$/, "");
        output = rounded;
      } catch {
        output = "Error";
      }
    }
    output += btnValue;
  }

  else {
    output += btnValue;
  }

  display.value = output;
};

// Button click handler
buttons.forEach((button) => {
  button.addEventListener('click', (e) => calculate(e.target.dataset.value));
});

// Backspace logic (click and hold)
[lightBackspace, darkBackspace].forEach(button => {
  const startDeleting = () => {
    if (output === "Error") {
      output = "";
      display.value = output;
      return;
    }

    output = output.slice(0, -1);
    display.value = output;

    backspaceTimeout = setTimeout(() => {
      backspaceInterval = setInterval(() => {
        if (output === "Error") {
          output = "";
          clearInterval(backspaceInterval);
        } else {
          output = output.slice(0, -1);
        }
        display.value = output;
      }, 100);
    }, 300);
  };

  const stopDeleting = () => {
    clearTimeout(backspaceTimeout);
    clearInterval(backspaceInterval);
  };

  button.addEventListener("mousedown", startDeleting);
  button.addEventListener("mouseup", stopDeleting);
  button.addEventListener("mouseleave", stopDeleting);

  button.addEventListener("touchstart", (e) => {
    e.preventDefault();
    startDeleting();
  });
  button.addEventListener("touchend", stopDeleting);
});

function toggleTheme() {
  document.body.classList.toggle("light-theme");
}
lightIcon.addEventListener("click", toggleTheme);
darkIcon.addEventListener("click", toggleTheme);
