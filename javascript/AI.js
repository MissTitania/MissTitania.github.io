const boardFunctions = require("./boardFunctions");

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
			boardFunctions.makeBlackMove(move, newBlackBoard, newWhiteBoard);
			value = valueStateWhite(10, newBlackBoard, newWhiteBoard, alpha, beta);
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
	boardFunctions.makeBlackMove(bestMove, blackPieces, whitePieces);
	console.log(bestValue);
}

function valueStateBlack(evaluationDepth, blackBoard, whiteBoard, alpha, beta)
{
	if(evaluationDepth == 0)
		return terminalEvaluation(blackBoard, whiteBoard);
	let newLegalMoves = boardFunctions.getBlackLegalMoves(blackBoard, whiteBoard);
	if(newLegalMoves.every(x => !x))
	{
		if(boardFunctions.getWhiteLegalMoves(blackBoard, whiteBoard).every(x => !x))
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
			boardFunctions.makeBlackMove(move, newBlackBoard, newWhiteBoard);
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
	let newLegalMoves = boardFunctions.getWhiteLegalMoves(blackBoard, whiteBoard);
	if(newLegalMoves.every(x => !x))
	{
		if(boardFunctions.getBlackLegalMoves(blackBoard, whiteBoard).every(x => !x))
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
			boardFunctions.makeWhiteMove(move, newBlackBoard, newWhiteBoard);
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

module.exports = computeBlackMove