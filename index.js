const btnStart = document.querySelector('.actions button');
const dataInput = document.getElementById('dataInput');
const decrementBtn = document.getElementById('decrement');
const final = document.querySelector('div.finish');
const finalScore = document.querySelector('h2.result');
const gameCanvas = document.querySelector('.game');
const incrementBtn = document.getElementById('increment');
const moles = document.querySelectorAll('.mole');
const timeInput = dataInput.querySelector('input');
const scoreBoard = document.querySelector('span.score');
const selectDifficultyBox = document.querySelector('.chooseOption');

/**
 * Game levels, time in miliseconds
 * 
 * @type {Object}
 */
const level = {
	easy: {
		difficulty: "easy",
		interval: [2000, 3000],
	},
	medium: {
		difficulty: "medium",
		interval: [1300, 2000],
	},
	hard: {
		difficulty: "hard",
		interval: [1000, 2000],
	},
};

let gamePlayTime = 0; //seconds
let hasFinished;
let chosenLevel;
let intervalBetweenMoles;

/**
 * Adds 10 to game time.
 * 
 * @return {Void} 
 */
function increment() {
	timeInput.value = Math.min(100, +timeInput.value + 10);
}

/**
 * Subtracts 10 from game time.
 * 
 * @return {Void}   
 */
function decrement() {
	timeInput.value = Math.max(10, timeInput.value - 10);
}


/**
 * When the button @btnStart is clicked, we initialize the game through this function.
 * 
 * @return {Void}
 */
function initGame() {
	hasFinished = false;
	gamePlayTime = timeInput.value;
	chosenLevel = selectDifficultyBox.value.toLowerCase();

	scoreBoard.textContent = 0;

	hideGameConfigurationUI();
	showMoles();
	endGame();
}

/**
 * Hides user interface.
 * 
 * @return {Void} 
 */
function hideGameConfigurationUI() {
	dataInput.classList.add('disappear');
	btnStart.classList.add("disappear");
	final.classList.add('disappear');
}

let moleInterval;

/**
 * This function executes with random time until timeout. It makes moles appear from their holes.
 * 
 * @return {Void}
 */
function showMoles() {
	if (hasFinished) {
		clearTimeout(moleInterval);
		return;
	}

	makeAllMolesClickable();
	showRandomMole();

	intervalBetweenMoles = getRandomInt(level[chosenLevel].interval[0], level[chosenLevel].interval[1]);
	
	moleInterval = setTimeout(showMoles, intervalBetweenMoles);
};

/**
 * Resets all moles to being clickable after the current mole is down
 * 
 * @return {Void} 
 */
function makeAllMolesClickable() {
	moles.forEach(mole => {
		mole.classList.add('hasPoint');
		mole.classList.remove('hasBeenHit');
		mole.classList.remove('animateMole');
	});
}

/**
 * Shows a random mole, that hides on transition or on click.
 * 
 * @return {Void} 
 */
function showRandomMole() {
	let currentMoleHole = Math.round(getRandomInt(1, 6));
	let mole = document.querySelector(`.mole[data-num="${currentMoleHole}"]`);
	let currentLevel = level[chosenLevel].difficulty;
	mole.classList.add(currentLevel);
	mole.parentNode.classList.add('up');
	mole.parentNode.addEventListener("transitionend", hideMole);
}

/**
 * Executes after the given @gamePlayTime and stops the moles from coming out.
 * 
 * @return {void} [description]
 */
function endGame() {
	setTimeout(function() {
		hasFinished = true; // acts like a stop for moles to appear
		showUI();

	}, gamePlayTime * 1000);
}
/**
 * Shows user interface.
 * 
 * @return {Void} 
 */
function showUI() {
	dataInput.classList.remove('disappear');
	btnStart.textContent = 'Restart';
	btnStart.classList.remove("disappear");
	btnStart.style.backgroundColor = "red";
	btnStart.style.color = "rgba(255,255,255,0.9)";

	const suffix = scoreBoard.textContent == 1 ? '' : 's';

	setTimeout(function() {
		final.classList.remove('disappear');
		let result = `<h2>${scoreBoard.textContent} mole${suffix}</h2>`;
		finalScore.innerHTML = result;
	}, 1000);
}

/**
 * Makes sure to remove the mole after a certain time (see classes up,[easy,medium,hard]).
 * 
 * @param  {hole} e 
 * @return {Removes class from the hole that the mole that we clicked on is.}   
 */
function hideMole(e) {
	this.classList.remove('up');
}

/**
 * Gets a whole number between min and max .
 * 
 * @param  {Number} min
 * @param  {Number} max 
 * @return {Number}    
 */
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Makes sure that hitting the mole more than once doesn`t result in more than 1 point
 * 
 * @param  {mole} e Each mole that we click on
 * @return {scoreBoard + 1} Adds 1 to the scoreboard.  
 */
function plusOne(e) {
	let currentScore = +scoreBoard.textContent + 1;

	if (this.classList.contains('hasPoint')) {
		this.classList.remove('hasPoint');
		this.classList.remove('up');
		this.classList.add('hasBeenHit');
		this.classList.add('animateMole');
		scoreBoard.textContent = currentScore;
	}
}

gameCanvas.addEventListener('mousedown', function() {
	this.classList.add('mouse-down')
});

gameCanvas.addEventListener('mouseup', function() {
	this.classList.remove('mouse-down')
});
incrementBtn.addEventListener('click', increment);
decrementBtn.addEventListener('click', decrement);
btnStart.addEventListener("click", initGame);

moles.forEach(mole => {
	mole.addEventListener('click', plusOne);
});
