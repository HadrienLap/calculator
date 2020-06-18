const buttons = document.querySelectorAll('button');
const textField = document.getElementById('text-field');

const values = {
    previousNumber: '',
    currentNumber: '',
    displayedNumber: '',
    previousOperator: '',
    currentOperator: '',
    result: '',
    previousResultWait: ''
}

let waitForSecondNumber = false;
let performedEqual = false;

buttons.forEach(button => button.addEventListener('click', (e) => {
    const currentClass = e.srcElement.classList;

    if (currentClass.contains('number')) {

        if (waitForSecondNumber) {
            values.previousNumber = values.currentNumber;
            values.currentNumber = '';
            waitForSecondNumber = false;
        }

        if (performedEqual) {
            reset ();
            performedEqual = false;
        }

        // Max input length is 9 digits
        if (values.currentNumber.toString().length > 8) return;

        // Input number is stored and displayed
        values.currentNumber += e.srcElement.innerText.toString();
        values.displayedNumber = values.currentNumber;
        textField.innerText = values.displayedNumber;
        }

        // Number can have decimals if not a decimal yet
        if (currentClass.contains('point')) {
            if (!values.currentNumber.includes('.')) {
                values.currentNumber += e.srcElement.innerText.toString();
                values.displayedNumber = values.currentNumber;
                textField.innerText = values.displayedNumber;
            }  
        }     

    if (currentClass.contains('operator')) {
        values.currentOperator = e.srcElement.innerText.toString();
        performedEqual = false;

        if (values.previousNumber === '') {
            waitForSecondNumber = true;
            values.previousOperator = values.currentOperator;
            return;
        }

        if (currentClass.contains('proceed')) {
            equal();
            values.previousNumber = values.displayedNumber;
            values.currentNumber = '';
        }

        values.previousOperator = e.srcElement.innerText.toString();
    }

    // Equal function
    if (currentClass.contains('equalBTN')) {
        performedEqual = true;
        equal ();
    }
        
    // Reset function
    if (currentClass.contains('reset')) {
        reset ();
        return;
    }
    // Delete function
    if (currentClass.contains('delete')) {
        values.currentNumber = textField.innerText.slice(0, -1);
        values.displayedNumber = values.currentNumber;
        textField.innerText = values.displayedNumber;
        return;
    }
}));

function operate (operator, a, b) {
    switch (operator) {
        case '+': return add (+a, +b);
        case '-': return substract (+a, +b);
        case 'x': return multiply (+a, +b);
        case '/': return divide (+a, +b);
        case '%': return mod (+a, +b);
    }
}

function add (a, b) {return a + b;}
function substract (a, b) {return a - b;}
function multiply (a, b) {return a * b;}
function divide (a, b) {return a / b;}
function mod (a, b) {return ((a % b) + b) % b;}

function reset () {
    Object.keys(values).forEach(value => values[value] = ''); 
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
    
    // Too large decimales are rounded 
    values.result = +values.result.toFixed(8);

    // Too large value are diplayed in scientific notation
    if (values.result.toString().length > 10) {
        values.result = values.result.toExponential(2);
    }
    
    // Result is displayed and variables are set for the next operation
    values.displayedNumber = values.result;
    textField.innerText = values.displayedNumber;
    values.currentNumber = values.displayedNumber;
    values.previousNumber = '';
}

function error () {
    reset(); 
    textField.innerText = 'Error';
}