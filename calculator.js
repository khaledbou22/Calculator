// Get display elements
const previousOperandElement = document.querySelector('.previous-operand');
const currentOperandElement = document.querySelector('.current-operand');

// Calculator state
let currentOperand = '0';
let previousOperand = '';
let operation = null;
let shouldResetScreen = false;

// Get all buttons
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const clearButton = document.querySelector('[data-action="clear"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const percentButton = document.querySelector('[data-action="percent"]');
const equalsButton = document.querySelector('[data-action="equals"]');

// Add event listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => appendNumber(button.dataset.number));
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => setOperation(button.dataset.operator));
});

clearButton.addEventListener('click', clear);
deleteButton.addEventListener('click', deleteNumber);
percentButton.addEventListener('click', applyPercent);
equalsButton.addEventListener('click', calculate);

// Keyboard support
document.addEventListener('keydown', handleKeyboard);

function handleKeyboard(e) {
    if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
    if (e.key === '.') appendNumber(e.key);
    if (e.key === '=' || e.key === 'Enter') calculate();
    if (e.key === 'Backspace') deleteNumber();
    if (e.key === 'Escape') clear();
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        setOperation(e.key);
    }
}

function appendNumber(number) {
    if (shouldResetScreen) {
        currentOperand = '0';
        shouldResetScreen = false;
    }
    
    if (number === '.' && currentOperand.includes('.')) return;
    
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
    
    updateDisplay();
}

function setOperation(operator) {
    if (currentOperand === '') return;
    
    if (previousOperand !== '') {
        calculate();
    }
    
    operation = operator;
    previousOperand = currentOperand;
    currentOperand = '';
    shouldResetScreen = false;
    updateDisplay();
}

function calculate() {
    let result;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Division by zero is not possible.!!');
                clear();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    currentOperand = roundResult(result).toString();
    operation = null;
    previousOperand = '';
    shouldResetScreen = true;
    updateDisplay();
}

function roundResult(number) {
    return Math.round(number * 100000000) / 100000000;
}

function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = null;
    shouldResetScreen = false;
    updateDisplay();
}

function deleteNumber() {
    if (shouldResetScreen) return;
    
    currentOperand = currentOperand.toString().slice(0, -1);
    if (currentOperand === '') {
        currentOperand = '0';
    }
    updateDisplay();
}

function applyPercent() {
    const current = parseFloat(currentOperand);
    if (isNaN(current)) return;
    
    currentOperand = (current / 100).toString();
    updateDisplay();
}

function updateDisplay() {
    currentOperandElement.textContent = formatNumber(currentOperand);
    
    if (operation != null && previousOperand !== '') {
        previousOperandElement.textContent = 
            `${formatNumber(previousOperand)} ${getOperatorSymbol(operation)}`;
    } else {
        previousOperandElement.textContent = '';
    }
}

function formatNumber(number) {
    if (number === '') return '0';
    
    const stringNumber = number.toString();
    const parts = stringNumber.split('.');
    const integerPart = parseFloat(parts[0]);
    
    if (isNaN(integerPart)) return '0';
    
    let formattedInteger = integerPart.toLocaleString('en');
    
    if (parts.length > 1) {
        return `${formattedInteger}.${parts[1]}`;
    } else {
        return formattedInteger;
    }
}

function getOperatorSymbol(operator) {
    switch(operator) {
        case '+': return '+';
        case '-': return '-';
        case '*': return '×';
        case '/': return '÷';
        default: return '';
    }
}

// Initialize display
updateDisplay();
