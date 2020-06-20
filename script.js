const buttons = document.querySelectorAll('button');
const textField = document.getElementById('text-field');

const values = {
    previousNumber: '',
    currentNumber: '',
    displayedNumber: '',
    previousOperator: '',
    currentOperator: '',
    result: '',
    operatorWait : '',
    previousResultWait : ''
}

let waitForSecondNumber = false;
let performedEqual = false;
let waitForPrecedence = false;

document.addEventListener('keydown', (e) => {
    buttons.forEach(button => {
        if (button.dataset.key == e.which) {
            input(button);
        };
    });
});

buttons.forEach(button => button.addEventListener('mousedown', (e) => {
    input(e.target);
}));

function input (target) {
    const currentClass = target.classList;

    if (currentClass.contains('number')) {

        if (waitForSecondNumber) {
            values.previousNumber = values.currentNumber;
            values.currentNumber = '';
            waitForSecondNumber = false;
        };

        if (performedEqual) {
            reset ();
            performedEqual = false;
        };

        // Max input length is 9 digits
        if (values.currentNumber.toString().length > 8) return;

        // Input number is stored and displayed
        values.currentNumber += target.innerText.toString();
        values.displayedNumber = values.currentNumber;
        textField.innerText = values.displayedNumber;
    };

        // Number can have decimals if not a decimal yet
        if (currentClass.contains('point')) {
            if (!values.currentNumber.includes('.')) {
                values.currentNumber += target.innerText.toString();
                values.displayedNumber = values.currentNumber;
                textField.innerText = values.displayedNumber;
            };
        };

    if (currentClass.contains('operator')) {
        values.currentOperator = target.innerText.toString();
        

        if ((values.currentOperator === 'x' || values.currentOperator === '/') 
            && (waitForPrecedence === false)
            && (performedEqual === false)) {
            values.previousResultWait = values.previousNumber;
            values.operatorWait = values.previousOperator;
            values.previousNumber = '';
            waitForPrecedence = true;
        }

        performedEqual = false;

        if (values.previousNumber === '') {
            waitForSecondNumber = true;
            values.previousOperator = values.currentOperator;
            return;
        };

        equal();
        values.previousNumber = values.displayedNumber;
        values.currentNumber = '';
        values.previousOperator = target.innerText.toString();
   };

    // Equal function
    if (currentClass.contains('equalBTN')) {
        performedEqual = true;
        equal ();
        values.operatorWait = '';
        values.previousNumber = '';
        waitForPrecedence = false;

    };
    // Reset function
    if (currentClass.contains('reset')) {
        reset ();
    };
    // Delete function
    if (currentClass.contains('delete')) {
        values.currentNumber = textField.innerText.slice(0, -1);
        values.displayedNumber = values.currentNumber;
        textField.innerText = values.displayedNumber;
    };
};

function operate (operator, a, b) {
    switch (operator) {
        case '+': return add (+a, +b);
        case '-': return substract (+a, +b);
        case 'x': return multiply (+a, +b);
        case '/': return divide (+a, +b);
        case '%': return mod (+a, +b);
    };
}

function add (a, b) {return a + b;}
function substract (a, b) {return a - b;}
function multiply (a, b) {return a * b;}
function divide (a, b) {return a / b;}
function mod (a, b) {return ((a % b) + b) % b;}

function reset () {
    Object.keys(values).forEach(value => values[value] = ''); 
    waitForSecondNumber = false;
    performedEqual = false;
    waitForPrecedence = false;
    textField.innerText = '';
}

function equal () {
    // Return error if operand missing or in case of a division by 0
    if (values.previousNumber === '' ||
        (values.previousOperator === '/' && values.currentNumber === '0')) {
        error();
        return;
    }

    // Get the result of the operation
    values.result = operate(values.previousOperator, values.previousNumber, values.currentNumber);
    
    if (waitForPrecedence === true && 
       (values.currentOperator === '+' || values.currentOperator === '-' || performedEqual)) {

        if (values.previousResultWait === '') values.previousResultWait = 0;
        if (values.operatorWait === '') values.operatorWait = '+';
        
        values.result = operate(values.operatorWait, values.previousResultWait, values.result);
        waitForPrecedence = false;
        values.previousResultWait = '';
    }
    // Format the result if too many decimales or digits
    values.result = formatResult(+values.result);
    
    // Result is displayed and variables are set for the next operation
    values.displayedNumber = values.result;
    textField.innerText = values.displayedNumber;
    values.currentNumber = values.displayedNumber;
    values.currentOperator = '';
    values.previousOperator = '';
}

function error () {
    reset(); 
    textField.innerText = 'Error';
}

function formatResult (result) {
     // Too large decimales are rounded 
     result = +result.toFixed(8);

     // Too large value are diplayed in scientific notation
     if (result.toString().length > 10) {
         result = result.toExponential(2);
     }
     return result;
}