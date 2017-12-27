/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

const router =
{
	'#/':
	{
		pageId: 'about-page',
		linkId: 'about-link'
	},
	'#/othello':
	{
		pageId: 'othello-page',
		linkId: 'othello-link'
	},
	'#/pokemon':
	{
		pageId: 'pokemon-page',
		linkId: 'pokemon-link'
	},
	'#/resume':
	{
		pageId: 'resume-page',
		linkId: 'resume-link'
	}
};

function hashChange(hash)
{
	window.location.hash = hash;
}

function hashHandler()
{
	const hash = window.location.hash;
	if (!router.hasOwnProperty(hash))
		window.location.hash = '#/';
	else
	{
		const pageId = router[hash].pageId;
		Object.keys(router).map(key => router[key].pageId).forEach(id =>
		{
			const domElement = document.getElementById(id);
			if (id === pageId)
				domElement.style.display = 'block';
			else
				domElement.style.display = 'none';
		});
	}
}

function addEvents()
{
	Object.keys(router).forEach(hash =>
	{
		document.getElementById(router[hash].linkId).addEventListener('click', () => hashChange(hash));
	});
	document.getElementById("othello-reset").addEventListener('click', resetGame);
}

window.addEventListener("hashchange", hashHandler, false);
window.addEventListener("DOMContentLoaded", () =>
{
	addEvents();
	hashHandler();
	resetGame();
}, false);


function resetGame()
{
	blackPieces = [];
	whitePieces = [];
	for(let i = 0; i < 64; ++i)
	{
		blackPieces[i] = false;
		whitePieces[i] = false;
	}
	blackPieces[27] = true;
	blackPieces[36] = true;
	whitePieces[28] = true;
	whitePieces[35] = true;
	state = 0;
	legalMoves = getWhiteLegalMoves(blackPieces, whitePieces);
	syncBoard();
}

function syncBoard()
{
	let blackCount = 0;
	let whiteCount = 0;
	for(let i = 0; i < 64; ++i)
	{
		if(blackPieces[i])
		{
			document.getElementById("cell-" + i).className = "space occupied black";
			document.getElementById("cell-" + i).onclick = function(e) {};
			++blackCount;
		}
		else if(whitePieces[i])
		{
			document.getElementById("cell-" + i).className = "space occupied white";
			document.getElementById("cell-" + i).onclick = function(e) {};
			++whiteCount;
		}
		else if(legalMoves[i] && state == 0)
		{
			document.getElementById("cell-" + i).className = "space legal-move";
			document.getElementById("cell-" + i).onclick = function(e)
			{
				makeWhiteMove(i, blackPieces, whitePieces);
				legalMoves = getBlackLegalMoves(blackPieces, whitePieces);
				if(legalMoves.every(x => !x))
				{
					legalMoves = getWhiteLegalMoves(blackPieces, whitePieces);
					if(legalMoves.every(x => !x))
						state = 2;
				}
				else
				{
					state = 1;
					setTimeout(botMove, 400);
				}
				syncBoard();
			};
		}
		else
		{
			document.getElementById("cell-" + i).className = "space";
			document.getElementById("cell-" + i).onclick = function(e) {};
		}
	}
	document.getElementById("black-counter").innerHTML = "Black: " + blackCount;
	document.getElementById("white-counter").innerHTML = "White: " + whiteCount;
	if(state == 0)
		document.getElementById("state-text").innerHTML = "Your move";
	else if(state == 1)
		document.getElementById("state-text").innerHTML = "Thinking...";
	else if(state == 2 && blackCount > whiteCount)
		document.getElementById("state-text").innerHTML = "You lose!";
	else if(state == 2 && blackCount < whiteCount)
		document.getElementById("state-text").innerHTML = "You win!";
	else if(state == 2 && blackCount == whiteCount)
		document.getElementById("state-text").innerHTML = "Tie game!";
}

function botMove()
{
	computeBlackMove();
	legalMoves = getWhiteLegalMoves(blackPieces, whitePieces);
	if(legalMoves.every(x => !x))
	{
		legalMoves = getBlackLegalMoves(blackPieces, whitePieces);
		if(legalMoves.every(x => !x))
			state = 2;
		else
			setTimeout(botMove, 400);
	}
	else
		state = 0;
	syncBoard();
}

function getWhiteLegalMoves(blackBoard, whiteBoard)
{
	let directionShiftsX = [-1, 0, 1, -1, 1, -1, 0, 1];
	let directionShiftsY = [-1, -1, -1, 0, 0, 1, 1, 1];
	let newLegalMoves = [];
	for(let i = 0; i < 64; ++i)
		newLegalMoves[i] = false;
	for(let position = 0; position < 64; ++position)
	{
		if(blackBoard[position] || whiteBoard[position])
			continue;
		for(let d = 0; d < 8 && !newLegalMoves[position]; ++d)
		{
			let x = position % 8 + directionShiftsX[d];
			let y = Math.floor(position / 8 + .01) + directionShiftsY[d];
			while(x >= 0 && x < 8 && y >= 0 && y < 8 && blackBoard[8 * y + x])
			{
				x += directionShiftsX[d];
				y += directionShiftsY[d];
				if(x >= 0 && x < 8 && y >= 0 && y < 8 && whiteBoard[8 * y + x])
				{
					newLegalMoves[position] = true;
					break;
				}
			}
		}
	}
	return newLegalMoves;
}

function getBlackLegalMoves(blackBoard, whiteBoard)
{
	let directionShiftsX = [-1, 0, 1, -1, 1, -1, 0, 1];
	let directionShiftsY = [-1, -1, -1, 0, 0, 1, 1, 1];
	let newLegalMoves = [];
	for(let i = 0; i < 64; ++i)
		newLegalMoves[i] = false;
	for(let position = 0; position < 64; ++position)
	{
		if(blackBoard[position] || whiteBoard[position])
			continue;
		for(let d = 0; d < 8 && !newLegalMoves[position]; ++d)
		{
			let x = position % 8 + directionShiftsX[d];
			let y = Math.floor(position / 8) + directionShiftsY[d];
			while(x >= 0 && x < 8 && y >= 0 && y < 8 && whiteBoard[8 * y + x])
			{
				x += directionShiftsX[d];
				y += directionShiftsY[d];
				if(x >= 0 && x < 8 && y >= 0 && y < 8 && blackBoard[8 * y + x])
				{
					newLegalMoves[position] = true;
					break;
				}
			}
		}
	}
	return newLegalMoves;
}

function makeWhiteMove(position, blackBoard, whiteBoard)
{
	whiteBoard[position] = true;
	let directionShiftsX = [-1, 0, 1, -1, 1, -1, 0, 1];
	let directionShiftsY = [-1, -1, -1, 0, 0, 1, 1, 1];
	for(let d = 0; d < 8; ++d)
	{
		let x = position % 8 + directionShiftsX[d];
		let y = Math.floor(position / 8) + directionShiftsY[d];
		while(x >= 0 && x < 8 && y >= 0 && y < 8 && blackBoard[8 * y + x])
		{
			x += directionShiftsX[d];
			y += directionShiftsY[d];
			if(x >= 0 && x < 8 && y >= 0 && y < 8 && whiteBoard[8 * y + x])
			{
				do
				{
					x -= directionShiftsX[d];
					y -= directionShiftsY[d];
					blackBoard[8 * y + x] = false;
					whiteBoard[8 * y + x] = true;
				}
				while(blackBoard[8 * (y - directionShiftsY[d]) + x - directionShiftsX[d]]);
				break;
			}
		}
	}
}

function makeBlackMove(position, blackBoard, whiteBoard)
{
	blackBoard[position] = true;
	let directionShiftsX = [-1, 0, 1, -1, 1, -1, 0, 1];
	let directionShiftsY = [-1, -1, -1, 0, 0, 1, 1, 1];
	for(let d = 0; d < 8; ++d)
	{
		let x = position % 8 + directionShiftsX[d];
		let y = Math.floor(position / 8) + directionShiftsY[d];
		while(x >= 0 && x < 8 && y >= 0 && y < 8 && whiteBoard[8 * y + x])
		{
			x += directionShiftsX[d];
			y += directionShiftsY[d];
			if(x >= 0 && x < 8 && y >= 0 && y < 8 && blackBoard[8 * y + x])
			{
				do
				{
					x -= directionShiftsX[d];
					y -= directionShiftsY[d];
					whiteBoard[8 * y + x] = false;
					blackBoard[8 * y + x] = true;
				}
				while(whiteBoard[8 * (y - directionShiftsY[d]) + x - directionShiftsX[d]]);
				break;
			}
		}
	}
}

function computeBlackMove()
{
	let bestValue = Number.NEGATIVE_INFINITY;
	let bestMove = -1;
	let alpha = Number.NEGATIVE_INFINITY;
	let beta = Number.POSITIVE_INFINITY;
	let value, newBlackBoard, newWhiteBoard;
	for(let move = 0; move < 64; ++move)
	{
		if(legalMoves[move])
		{
			newBlackBoard = blackPieces.slice();
			newWhiteBoard = whitePieces.slice();
			makeBlackMove(move, newBlackBoard, newWhiteBoard);
			value = valueStateWhite(11, newBlackBoard, newWhiteBoard, alpha, beta);
			if(value > bestValue)
			{
				alpha = value;
				bestValue = value;
				bestMove = move;
			}
			if(beta <= alpha)
				break;
		}
	}
	makeBlackMove(bestMove, blackPieces, whitePieces);
	console.log(bestValue);
}

function valueStateBlack(evaluationDepth, blackBoard, whiteBoard, alpha, beta)
{
	if(evaluationDepth == 0)
		return terminalEvaluation(blackBoard, whiteBoard);
	newLegalMoves = getBlackLegalMoves(blackBoard, whiteBoard);
	if(newLegalMoves.every(x => !x))
	{
		if(getWhiteLegalMoves(blackBoard, whiteBoard).every(x => !x))
			return terminalEvaluation(blackBoard, whiteBoard);
		else
			return valueStateWhite(evaluationDepth, blackBoard, whiteBoard, alpha, beta);
	}
	let value = Number.NEGATIVE_INFINITY;
	let newBlackBoard, newWhiteBoard;
	for(let move = 0; move < 64; ++move)
	{
		if(newLegalMoves[move])
		{
			newBlackBoard = blackBoard.slice();
			newWhiteBoard = whiteBoard.slice();
			makeBlackMove(move, newBlackBoard, newWhiteBoard);
			value = Math.max(value, valueStateWhite(evaluationDepth - 1, newBlackBoard, newWhiteBoard, alpha, beta));	
			alpha = Math.max(alpha, value);
			if(beta <= alpha)
				break;
		}
	}
	return value;
}

function valueStateWhite(evaluationDepth, blackBoard, whiteBoard, alpha, beta)
{
	if(evaluationDepth == 0)
		return terminalEvaluation(blackBoard, whiteBoard);
	newLegalMoves = getWhiteLegalMoves(blackBoard, whiteBoard);
	if(newLegalMoves.every(x => !x))
	{
		if(getBlackLegalMoves(blackBoard, whiteBoard).every(x => !x))
			return terminalEvaluation(blackBoard, whiteBoard);
		else
			return valueStateBlack(evaluationDepth, blackBoard, whiteBoard, alpha, beta);
	}
	let value = Number.POSITIVE_INFINITY;
	let newBlackBoard, newWhiteBoard;
	for(let move = 0; move < 64; ++move)
	{
		if(newLegalMoves[move])
		{
			newBlackBoard = blackBoard.slice();
			newWhiteBoard = whiteBoard.slice();
			makeWhiteMove(move, newBlackBoard, newWhiteBoard);
			value = Math.min(value, valueStateBlack(evaluationDepth - 1, newBlackBoard, newWhiteBoard, alpha, beta));
			beta = Math.min(beta, value);
			if(beta <= alpha)
				break;
		}
	}
	return value;
}

function terminalEvaluation(blackBoard, whiteBoard)
{
	if(blackBoard.every(x => !x))
		return -64;
	else if(whiteBoard.every(x => !x))
		return 64;
	else
	{
		let count = 0;
		for(let k = 0; k < 64; ++k)
		{
			if(blackBoard[k])
				++count;
			else if(whiteBoard[k])
				--count;
		}
		return count;
	}
}

/***/ })
/******/ ]);