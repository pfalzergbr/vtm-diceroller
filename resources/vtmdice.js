//simple version of Vampire the Masquerade diceroller, no objects used. Want to figure out how much easier it becomes, if I make it with objects later. 

/* Variables and Constants 
==========================*/

//Setup area selectors 
const dicePoolNext = document.getElementById('next-dicepool');
const dicePoolPrevious = document.getElementById('previous-dicepool');
const dicePool = document.getElementById('dicepool-number');
const hungerDiceNext = document.getElementById('next-hunger-dicepool');
const hungerDicePrevious = document.getElementById('previous-hunger-dicepool');
const hungerDicePool = document.getElementById('hunger-dicepool-number');
const diceRollButton =  document.getElementById('diceroll-button')
const diceBox = document.querySelector('.dicebox');
const resultMessage = document.querySelector('.result-message-paragraph');
const endResultMessage = document.querySelector('.end-result-paragraph');


/*Dicepool steppers, to add or deduct dices from the pool*/

/*Event Listeners*/

//increase dicepool
dicePoolNext.addEventListener('click', increaseDicePool);
//decrease dicepool
dicePoolPrevious.addEventListener('click', decreaseDicePool);
//increase hunger dice
hungerDiceNext.addEventListener('click', increaseHunger);
//decrease hunger dice
hungerDicePrevious.addEventListener('click', decreaseHunger);
//roll event listener to read dice setup 
diceRollButton.addEventListener('click', rollTheDice);


//Function to increase dicepool
function increaseDicePool(){
    if(dicePool.innerText < 15)
        dicePool.innerText++;
    else 
        dicePool.innerText = 0;
}
//Function to decrease dicepool
function decreaseDicePool(){
    if (dicePool.innerText > 0)
        dicePool.innerText--;
    else
        dicePool.innerText = 15;
}

//function to increase hunger
function increaseHunger(){
    if(hungerDicePool.innerText < 5)
        hungerDicePool.innerText++;
    else 
        hungerDicePool.innerText = 0;
}

//function to decrease hunger
function decreaseHunger(){
    if(hungerDicePool.innerText > 0 )
        hungerDicePool.innerText--;
    else 
        hungerDicePool.innerText = 5;
}

//tester function to check event listeners
function rollTheDice() {
    const dicePoolValue = dicePool.innerText;
    const hungerDicePoolValue = hungerDicePool.innerText;

    const currentRegRoll = regularDiceRoll(dicePoolValue, hungerDicePoolValue);
    const currentHungerRoll = hungerDiceRoll(hungerDicePoolValue);
    const currentInterpret = interpretDice(currentRegRoll, currentHungerRoll);
    const currentSuccesses = successCounter(currentInterpret.regularDiceResult, currentInterpret.hungerDiceResult);
    const endResult = evaluateRoll(currentSuccesses)
    //roll results
    let successes = currentSuccesses.successes;
    let criticals = currentSuccesses.criticals + currentSuccesses.hungerCriticals;
    let finalSuccesses = currentSuccesses.finalSuccesses;
    let bestial = currentSuccesses.bestial;

    //createRegularDice();
    clearDiceBox();
    createRoll(currentRegRoll,'regular-dice','dice-value');
    createRoll(currentHungerRoll,'blood-dice', 'blood-dice-value');
    printMessage(successes, criticals, finalSuccesses, bestial, endResult);
}



/* dice values, used for interpreting result.
==================*/

const regularDice = {
    0: 'Critical Success',
    1: 'Fail',
    2: 'Fail',
    3: 'Fail',
    4: 'Fail',
    5: 'Fail',
    6: 'Success',
    7: 'Success',
    8: 'Success',
    9: 'Success',
}

const hungerDice = {
    0: 'Critical Success',
    1: 'Bestial Failiure',
    2: 'Fail',
    3: 'Fail',
    4: 'Fail',
    5: 'Fail',
    6: 'Success',
    7: 'Success',
    8: 'Success',
    9: 'Success',
}


/*Functions for underlying logic
==================*/


//Generates a random diceroll on 10 sided dice. 

function generateDiceRoll(){
    return Math.floor(Math.random()*10);
}

// Generates regular diceroll, number of total dice minus hungerdice, returns an array of numbers. 

function regularDiceRoll(numOfDice, hungerDice){
    let regularDice = [];
    let dicePool = numOfDice - hungerDice;
    //loops for the number of dice in dicepool, fills the array up with numbers rolled on dice
    for (let i = 0; i < dicePool; i++)
        regularDice.push(generateDiceRoll())
    return regularDice;
}

//Generates hunger diceroll, number of total hunger dice. Returns an array of numbers

function hungerDiceRoll(numOfHungerDice){
    let hungerDice = [];

    for (let i = 0; i < numOfHungerDice; i++)
        hungerDice.push(generateDiceRoll())
    return hungerDice;
}

// Interprets the result of the roll into successes and fails, returns an object of results, containing an array of regular dice an hunger dice results. 
function interpretDice(regRollResult, hungerRollResult){
    const rollResult = {
        regularDiceResult: [],
        hungerDiceResult: []
    }
    //maps numbers on regular dice to the dice object keys
    regRollResult.map(element => {
        rollResult.regularDiceResult.push(regularDice[element]);
    })
    //maps numbers on hunger dice to the dice object keys
    hungerRollResult.map(element => {
        rollResult.hungerDiceResult.push(hungerDice[element]);
    })
    return rollResult;
}

//Counts successes and failures from the interpreted arrays
function successCounter(regularResults, hungerResults){
    let resultCounter = {
        successes: 0,
        criticals: 0,
        hungerCriticals: 0,
        bestial: 0,
        extraCriticals: 0,
        finalSuccesses: 0
    }

    //Checks the results for all the regular dice
    regularResults.forEach(result => {
        if (result === 'Success')
            resultCounter.successes++;
        if (result === 'Critical Success')
            resultCounter.criticals++;
    })
    
    //Checks results for hunger dice
    
    hungerResults.forEach(result => {
        if (result === 'Success')
            resultCounter.successes++;
        if (result === 'Critical Success')
            resultCounter.hungerCriticals++;
        if (result === 'Bestial Failiure')
            resultCounter.bestial++;
    })    

    //counts and sets extra successes from criticals - For every two successes, adds extra two. 
    resultCounter.extraCriticals = Math.floor((resultCounter.criticals + resultCounter.hungerCriticals) / 2 ) * 2
    resultCounter.finalSuccesses = resultCounter.successes + resultCounter.criticals + resultCounter.hungerCriticals + resultCounter.extraCriticals;
    
    
    return resultCounter;
}


//Evaluates the end result of the roll, 
function evaluateRoll(resultObject){
    if (resultObject['finalSuccesses'] === 0 && resultObject['bestial'] >= 1)
        return 'Bestial Failure';
    if (resultObject['finalSuccesses'] === 0)
         return 'Failure';
    if (resultObject['hungerCriticals']>= 2 && resultObject['criticals'] < 2)
        return 'Messy Critical';
    if (resultObject['finalSuccesses'] >= 5 && resultObject['extraCriticals'] <= 2)
            return 'Critical Success';
    if (resultObject['finalSuccesses'] >= 0 && resultObject['finalSuccesses'] <= 5)
        return 'Success';
}  


//Creates a dice from 3 argumments. This could be regular or hunger dice. 
function createDice(number, diceType, diceValue){
    let diceDiv = document.createElement('div');
    let sideNumber = document.createElement('h3');

    diceDiv.classList.add('dice-container');
    diceDiv.classList.add(diceType);
    sideNumber.classList.add(diceValue);
    sideNumber.innerText = number;

    diceBox.appendChild(diceDiv);
    diceDiv.appendChild(sideNumber);
}


//Creates the full roll, either regular or hunger
function createRoll(diceArray, diceType, diceValue){
    diceArray.forEach(dice => { 
        createDice(dice, diceType, diceValue);
    })
}


//Clears the dicebox from the previous roll
function clearDiceBox (){
    if (diceBox.hasChildNodes()){
        let diceArray = Array.from(document.querySelectorAll('.dice-container'))
        diceArray.forEach(dice =>{
            diceBox.removeChild(dice);
        })
    }

}

//Prints the end result for the user. IDEA: expan to custom messages, based on the end result. Specific phrasing for successes, fails, messy crits and bestials. 
function printMessage(success, critical, total, bestial, result){
    if (result === 'Bestial Failure'){
        resultMessage.innerText = `No Successes, ${bestial} Critical fails`
        endResultMessage.innerText = result;
        endResultMessage.classList.toggle('bestial-fail');
        resultMessage.classList.toggle('bestial-fail');
    } else if (result === 'Failure') {
        resultMessage.innerText = `No Successes, no Criticals.`
        endResultMessage.innerText = result;
        resultMessage.classList.remove('bestial-fail');
        endResultMessage.classList.remove('bestial-fail');
    } else if (result === 'Messy Critical'){
        resultMessage.innerText = `${success} Successes, ${critical} Criticals, ${total} Successes all together`
        endResultMessage.innerText = result;
        resultMessage.classList.toggle('bestial-fail');
        endResultMessage.classList.toggle('bestial-fail');
    } else if(result === 'Success'){
        resultMessage.innerText = ``
            if (total === 1){
                endResultMessage.innerText = `${total} Success`;
            }else{
                endResultMessage.innerText = `${total} Succeses`;
            }
        resultMessage.classList.remove('bestial-fail');
        endResultMessage.classList.remove('bestial-fail');
    } else if (result === 'Critical Success'){
        resultMessage.innerText = `${success} Successes, ${critical} Criticals`
        endResultMessage.innerText = `${total} Successes, ` + result;
        resultMessage.classList.remove('bestial-fail');
        endResultMessage.classList.remove('bestial-fail');
    
    
    }
}
