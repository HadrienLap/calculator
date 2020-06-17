const buttons = document.querySelectorAll('button');
const textField = document.getElementById('text-field');

const values = {
    result: '',
    previousNumber: '',
    displayedNumber: '',
    previousOperator: '',
    currentOperator: ''
}

buttons.forEach(button => button.addEventListener('click', (e) => {
    const currentClass = e.srcElement.classList;

    if (currentClass.contains('number')) {
        // Max input length is 9 digits
        if (values.displayedNumber.toString().length > 8) return;

        // Input number is stored and displayed
        values.displayedNumber += e.srcElement.innerText.toString();
        textField.innerText = values.displayedNumber;
        }

        // Number can have decimals if not a decimal yet
        if (currentClass.contains('point')) {
            if (!values.displayedNumber.includes('.')) {
                values.displayedNumber += e.srcElement.innerText.toString();
                textField.innerText = values.displayedNumber;
            }  
        }     

    if (currentClass.contains('operator')) {
        values.currentOperator = e.srcElement.innerText.toString();

        if (values.previousNumber === '') {
            values.previousNumber = values.displayedNumber;
            values.displayedNumber = '';
            values.previousOperator = e.srcElement.innerText.toString();
            return;
        }
        values.previousOperator = e.srcElement.innerText.toString();
    }

    // Equal function
    if (currentClass.contains('equalBTN')) {
        equal ();
    }
        
    // Reset function
    if (currentClass.contains('reset')) {
        reset ();
        return;
    }
    // Delete function
    if (currentClass.contains('delete')) {
        values.displayedNumber = textField.innerText.slice(0, -1);
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
    if (!values.previousNumber ||
        values.previousOperator === '/' && values.displayedNumber === '0') {
        error();
        return;
    }

    // Get the result of the operation
    values.result = operate(values.previousOperator, values.previousNumber, values.displayedNumber);
    
    // Too large decimales are rounded 
    values.result = +values.result.toFixed(8);

    // Too large value are diplayed in scientific notation
    if (values.result.toString().length > 10) {
        values.result = values.result.toExponential(2);
    }
    
    // Result is displayed and variables are set for the next operation
    values.displayedNumber = values.result;
    textField.innerText = values.displayedNumber;
    values.previousNumber = '';
}

function error () {
    reset(); 
    textField.innerText = 'Error';
    return;
}