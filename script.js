const display = document.querySelector('.display');
const buttons = document.querySelectorAll('button');
const specialChars = ["%", "/", "*", "-", "+", "="];

let output = "";

const calculate = (btnValue) => {
  if (btnValue === "=" && output !== "") {
    try {
      const parsed = output.replace(/(\d+(?:\.\d+)?)([+\-])(\d+(?:\.\d+)?)%/g, (match, base, operator, percent) => {
        return `${base}${operator}(${base}*${percent}/100)`;
      });

      let result = eval(parsed);
      let rounded = result.toFixed(3).replace(/\.?0+$/, "");
      output = rounded;
        
    } catch {
      output = "Error";
    }
  } else if (btnValue === "AC") {
    output = "";
  } else if (btnValue === "DEL") {
    output = output.slice(0, -1);
  } else {
    if (output === "" && specialChars.includes(btnValue)) return;
    output += btnValue;
  }
  
  display.value = output;
};


buttons.forEach((button) => {
  button.addEventListener('click', (e) => calculate(e.target.dataset.value));
});

