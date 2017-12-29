const boardFunctions = require("./boardFunctions");
const computeBlackMove = require("./AI");

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
	legalMoves = boardFunctions.getWhiteLegalMoves(blackPieces, whitePieces);
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
				boardFunctions.makeWhiteMove(i, blackPieces, whitePieces);
				legalMoves = boardFunctions.getBlackLegalMoves(blackPieces, whitePieces);
				if(legalMoves.every(x => !x))
				{
					legalMoves = boardFunctions.getWhiteLegalMoves(blackPieces, whitePieces);
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
	legalMoves = boardFunctions.getWhiteLegalMoves(blackPieces, whitePieces);
	if(legalMoves.every(x => !x))
	{
		legalMoves = boardFunctions.getBlackLegalMoves(blackPieces, whitePieces);
		if(legalMoves.every(x => !x))
			state = 2;
		else
			setTimeout(botMove, 400);
	}
	else
		state = 0;
	syncBoard();
}