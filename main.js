const buttons = document.querySelectorAll(".button");
const display = document.getElementById("display");
const preDisplay = document.getElementById("pre-operation");
const acButton = document.getElementById("ac");

const originalSizeFont = parseInt(getComputedStyle(display).fontSize);
const maxInt = 15;

let stateOperation = 0;
let firsTerm = 0;
let operator = "";
let secondTerm = 0;
let decimalPoint = 1;



const clickInButton = (event) => {
    const innerButton = event.target.innerHTML;
    const idButton = event.target.id;
    const typeButton = event.target.className.split(" ")[1];
    
    selectorButton(innerButton, idButton, typeButton);
}
buttons.forEach(boton => boton.addEventListener("click", clickInButton));


const selectorButton = (innerButton, idButton, typeButton)=> {

    if (idButton === "dot" && decimalPoint === 1) { 
        decimalPoint = 10;
        writeDisplay(".");
    }


    if  (typeButton === "digit") {
        controlDigit(innerButton);
    } else {
        controlFunctions(idButton);
        if (typeButton === "operator") {
            controlOperator(idButton);
        }
    }
    
}




const controlOperator = (idButton) => {
    decimalPoint = 1;

    acButton.innerHTML = "AC";

    calculate();

    if (idButton === "equal") {
        writePreDisplay("");
        stateOperation = 2;
        secondTerm = 0;
        operator = "";
    } else {

        if (stateOperation === 0 || stateOperation === 2){
            writeDisplay(0);
        }
        switch (idButton){
            case "addition":
                writePreDisplay(firsTerm, "+ ...");
                break;
            case "subtration":
                writePreDisplay(firsTerm, "- ...");
                break;
            case "multiplication":
                writePreDisplay(firsTerm, "\u00D7 ...");
                break;
            case "division":
                writePreDisplay(firsTerm, "\u00F7 ...");
                break;
        }

        stateOperation = 1;
        operator = idButton;
    }

}

const controlFunctions = (idButton) => {
    switch (idButton) {
        case "ac":
            functionAC();
            break;
        case "plus-minus":
            if (stateOperation === 0 || stateOperation === 2) {
                firsTerm = 0 - firsTerm;
                writeDisplay(firsTerm);
            }
            else if (stateOperation === 1 ) {
                secondTerm = 0 - secondTerm;
                writeDisplay(secondTerm);
            }
            break;
        case "percentage":
            if (stateOperation !== 1 ) {
                decimalPoint = 1;
                firsTerm = decimalAjust(firsTerm / 100);
                writeDisplay(decimalAjust(firsTerm));
            }
            else {
                decimalPoint = 1;
                if (operator === "addition" || operator === "subtration")
                    secondTerm = (firsTerm / 100) * secondTerm;
                else
                    secondTerm = secondTerm / 100;
                writeDisplay(decimalAjust(secondTerm));
            }
            break;
    }
}

const controlDigit = (innerButton) => {
    if (stateOperation === 2){
        stateOperation = 0;
        firsTerm = 0;
        writeDisplay(firsTerm);
    }
    if (!isNaN(Number(innerButton))) {
        completeValue(innerButton);
        switch (stateOperation) {
            case 0:
                writeDisplay(firsTerm);
                break;
            case 1:
                writeDisplay(secondTerm);
                break;
        }
    }

    if (secondTerm > 0)
        acButton.innerHTML = "C";
}



const functionAC = () => {
    decimalPoint = 1; 
    if (stateOperation === 0 || stateOperation === 2) {
        firsTerm = 0;
        operator = "";
        writePreDisplay("");    
    } else if (stateOperation === 1) {
        if (secondTerm === 0) {
            firsTerm = 0;
            operator = "";
            stateOperation = 0;
            writePreDisplay("");
        } else {
            secondTerm = 0;
        }
            
    }

    writeDisplay(0);
    
    acButton.innerHTML = "AC";

}

const completeValue = (digit) => {
    if (decimalPoint > 1) {
 
        if (decimalPoint <= Math.pow(10,10) && stateOperation === 0){ 
            digit /= decimalPoint;
            decimalPoint *= 10;
            firsTerm = decimalAjust(firsTerm + digit);
        }
        else if (decimalPoint <= Math.pow(10,10) && stateOperation === 1){
            digit /= decimalPoint;
            decimalPoint *= 10;
            secondTerm = decimalAjust(secondTerm + digit);
        }
    }
    else {
        if (String(firsTerm).length < maxInt && stateOperation === 0) 
            firsTerm = Number(String(firsTerm) + digit);
        else if (String(secondTerm).length < maxInt && stateOperation === 1)
                secondTerm = Number(String(secondTerm) + digit);
    }
}

const decimalAjust = (numero) => {
    return parseFloat(numero.toFixed(10));
}



const calculate = () => {

    if (operator === "division") {
        firsTerm = decimalAjust(firsTerm / secondTerm);

        if (!isFinite(firsTerm)) {
            firsTerm = 0;
            stateOperation = 0;
            writeDisplay("Division by zero");
        } else {
            writeDisplay(firsTerm);
        }

    } else {

        switch (operator) {
            case "addition":
                firsTerm = decimalAjust(firsTerm + secondTerm);
                break;
            case "subtration":
                firsTerm = decimalAjust(firsTerm - secondTerm);
            break;
            case "multiplication":
                firsTerm = decimalAjust(firsTerm * secondTerm);
                break;
        }

        writeDisplay(firsTerm);
    }

    secondTerm = 0;
}



const autoSizeFont = () => {

    let sizeNumbers;
    let sizeDisplay;
    let overflowFont;

    display.style.fontSize = originalSizeFont.toString() + "px";
    sizeNumbers = display.scrollWidth;
    sizeDisplay = parseInt(getComputedStyle(display).width) + (parseInt(getComputedStyle(display).paddingLeft) * 2) + 2;
    sizeFont = parseInt(getComputedStyle(display).fontSize);
    overflowFont = sizeDisplay < sizeNumbers;
    
    while (overflowFont) {
        sizeFont--;
        display.style.fontSize = sizeFont.toString() + "px";
        sizeNumbers = display.scrollWidth;
        sizeDisplay = parseInt(getComputedStyle(display).width) + (parseInt(getComputedStyle(display).paddingLeft) * 2) + 2;
        
        overflowFont = sizeDisplay < sizeNumbers;
    }
}

const putMillar = (number) => {
    return number.toLocaleString('es');
 }

const writeDisplay = (number) => {
  
    if (number === ".") {
        if (stateOperation === 0)
            display.innerHTML = putMillar(firsTerm) + ",";
        else    
            display.innerHTML = putMillar(secondTerm) + ",";
    }
    else {
        if (decimalPoint > 1)
            display.innerHTML = putMillar(number);
        else
            display.innerHTML = putMillar(number);
    }

    autoSizeFont();
}

const writePreDisplay = (number, oper) => {
    
    const numberMod = putMillar(number);
    
    if (oper !== undefined) {
        if (number < 0)
            preDisplay.innerText = `(${numberMod})` + oper;
        else
            preDisplay.innerText = numberMod + " " + oper;
    }
    else 
        preDisplay.innerText = numberMod
}
