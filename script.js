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

        operatorSelectionBGRemove ();

        if (waitForSecondNumber) waitForSecondNumber = false;

        // Entering a number (instead of an operator) after performing equal reset and start a new operation
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
                if (values.currentNumber === '') values.currentNumber = '0';
                values.currentNumber += target.innerText.toString();
                values.displayedNumber = values.currentNumber;
                textField.innerText = values.displayedNumber;
            };  
        };

    if (currentClass.contains('operator')) {
        values.currentOperator = target.innerText.toString();

        // Style BG color of selected operator only
        operatorSelectionBGRemove ();
        operatorSelectionBG (currentClass);
        
        // Check if waiting for precedence is needed
        if ((values.currentOperator === 'x' || values.currentOperator === '/') 
            && waitForPrecedence === false
            && performedEqual === false
            && values.previousOperator !== 'x' 
            && values.previousOperator !== '/') {
                values.previousResultWait = values.previousNumber;
                values.operatorWait = values.previousOperator;
                values.previousNumber = '';
                waitForPrecedence = true;
        };

        performedEqual = false;

        if (values.previousNumber === '') {
            waitForSecondNumber = true;
            values.previousOperator = values.currentOperator;
            values.previousNumber = values.currentNumber;
            values.currentNumber = '';
            return;
        };

        equal();
        // Setting variables to receive next number
        values.previousNumber = values.displayedNumber;
        values.currentNumber = '';
        values.previousOperator = target.innerText.toString();
   };
    // Equal function
    if (currentClass.contains('equalBTN')) {
        performedEqual = true;
        equal ();

        // Setting variables to receive next number or operator
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
    operatorSelectionBGRemove ();
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
    };
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
         result = result.toExponential(6);
     }
     return result;
}

function operatorSelectionBG (currentClass) {
    currentClass.add('selectedOperator');
}

function operatorSelectionBGRemove () {
    buttons.forEach(button => button.classList.remove('selectedOperator'));
}