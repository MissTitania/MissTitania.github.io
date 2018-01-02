const boardFunctions = require("./boardFunctions");

function computeBlackMove()
{
	let bestValue = Number.NEGATIVE_INFINITY;
	let bestMove = -1;
	let alpha = Number.NEGATIVE_INFINITY;
	let beta = Number.POSITIVE_INFINITY;
	let value, newBlackBoard, newWhiteBoard;
	let pieceCount = 0;
	for(let k = 0; k < 64; ++k)
	{
		if(blackPieces[k] || whitePieces[k])
			++pieceCount;
	}
	for(let move = 0; move < 64; ++move)
	{
		if(legalMoves[move])
		{
			newBlackBoard = blackPieces.slice();
			newWhiteBoard = whitePieces.slice();
			boardFunctions.makeBlackMove(move, newBlackBoard, newWhiteBoard);
			if(pieceCount < 50)
				value = valueStateWhite(7, newBlackBoard, newWhiteBoard, alpha, beta, false);
			else
				value = valueStateWhite(13, newBlackBoard, newWhiteBoard, alpha, beta, true);
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
}

function valueStateBlack(evaluationDepth, blackBoard, whiteBoard, alpha, beta, terminal)
{
	if(evaluationDepth == 0)
		return terminalEvaluation(blackBoard, whiteBoard, terminal);
	let newLegalMoves = boardFunctions.getBlackLegalMoves(blackBoard, whiteBoard);
	if(newLegalMoves.every(x => !x))
	{
		if(boardFunctions.getWhiteLegalMoves(blackBoard, whiteBoard).every(x => !x))
			return terminalEvaluation(blackBoard, whiteBoard, true);
		else
			return valueStateWhite(evaluationDepth, blackBoard, whiteBoard, alpha, beta, terminal);
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
			value = Math.max(value, valueStateWhite(evaluationDepth - 1, newBlackBoard, newWhiteBoard, alpha, beta, terminal));	
			alpha = Math.max(alpha, value);
			if(beta <= alpha)
				break;
		}
	}
	return value;
}

function valueStateWhite(evaluationDepth, blackBoard, whiteBoard, alpha, beta, terminal)
{
	if(evaluationDepth == 0)
		return terminalEvaluation(blackBoard, whiteBoard, terminal);
	let newLegalMoves = boardFunctions.getWhiteLegalMoves(blackBoard, whiteBoard);
	if(newLegalMoves.every(x => !x))
	{
		if(boardFunctions.getBlackLegalMoves(blackBoard, whiteBoard).every(x => !x))
			return terminalEvaluation(blackBoard, whiteBoard, true);
		else
			return valueStateBlack(evaluationDepth, blackBoard, whiteBoard, alpha, beta, terminal);
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
			value = Math.min(value, valueStateBlack(evaluationDepth - 1, newBlackBoard, newWhiteBoard, alpha, beta, terminal));
			beta = Math.min(beta, value);
			if(beta <= alpha)
				break;
		}
	}
	return value;
}

function terminalEvaluation(blackBoard, whiteBoard, terminal)
{
	if(terminal)
	{
		if(blackBoard.every(x => !x))
			return -1064;
		else if(whiteBoard.every(x => !x))
			return 1064;
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
			if(count > 0)
				return count + 1000;
			else if(count < 0)
				return count - 1000;
			else
				return 0;
		}
	}

	let result = 0;
	//Move Differential Computation
	let blackLegalMoves = boardFunctions.getBlackLegalMoves(blackBoard, whiteBoard);
	let whiteLegalMoves = boardFunctions.getWhiteLegalMoves(blackBoard, whiteBoard);
	for(let k = 0; k < 64; ++k)
	{
		if(blackLegalMoves[k])
			result += neuralCoefficients[24];
		if(whiteLegalMoves[k])
			result -= neuralCoefficients[24];
	}
	//Horizontal Row Precomps
	result += neuralCoefficients[16] * precomps[14][extractIndex(blackBoard, whiteBoard, [0, 1, 2, 3, 4, 5, 6, 7])];
	result += neuralCoefficients[18] * precomps[14][extractIndex(blackBoard, whiteBoard, [8, 9, 10, 11, 12, 13, 14, 15])];
	result += neuralCoefficients[18] * precomps[14][extractIndex(blackBoard, whiteBoard, [48, 49, 50, 51, 52, 53, 54, 55])];
	result += neuralCoefficients[16] * precomps[14][extractIndex(blackBoard, whiteBoard, [56, 57, 58, 59, 60, 61, 62, 63])];
	result += neuralCoefficients[17] * precomps[15][extractIndex(blackBoard, whiteBoard, [0, 1, 2, 3, 4, 5, 6, 7])];
	result += neuralCoefficients[19] * precomps[15][extractIndex(blackBoard, whiteBoard, [8, 9, 10, 11, 12, 13, 14, 15])];
	result += neuralCoefficients[21] * precomps[15][extractIndex(blackBoard, whiteBoard, [16, 17, 18, 19, 20, 21, 22, 23])];
	result += neuralCoefficients[23] * precomps[15][extractIndex(blackBoard, whiteBoard, [24, 25, 26, 27, 28, 29, 30, 31])];
	result += neuralCoefficients[23] * precomps[15][extractIndex(blackBoard, whiteBoard, [32, 33, 34, 35, 36, 37, 38, 39])];
	result += neuralCoefficients[21] * precomps[15][extractIndex(blackBoard, whiteBoard, [40, 41, 42, 43, 44, 45, 46, 47])];
	result += neuralCoefficients[19] * precomps[15][extractIndex(blackBoard, whiteBoard, [48, 49, 50, 51, 52, 53, 54, 55])];
	result += neuralCoefficients[17] * precomps[15][extractIndex(blackBoard, whiteBoard, [56, 57, 58, 59, 60, 61, 62, 63])];
	//Vertical Row Precomps
	result += neuralCoefficients[16] * precomps[14][extractIndex(blackBoard, whiteBoard, [0, 8, 16, 24, 32, 40, 48, 56])];
	result += neuralCoefficients[18] * precomps[14][extractIndex(blackBoard, whiteBoard, [1, 9, 17, 25, 33, 41, 49, 57])];
	result += neuralCoefficients[18] * precomps[14][extractIndex(blackBoard, whiteBoard, [6, 14, 22, 30, 38, 46, 54, 62])];
	result += neuralCoefficients[16] * precomps[14][extractIndex(blackBoard, whiteBoard, [7, 15, 23, 31, 39, 47, 55, 63])];
	result += neuralCoefficients[17] * precomps[15][extractIndex(blackBoard, whiteBoard, [0, 8, 16, 24, 32, 40, 48, 56])];
	result += neuralCoefficients[19] * precomps[15][extractIndex(blackBoard, whiteBoard, [1, 9, 17, 25, 33, 41, 49, 57])];
	result += neuralCoefficients[21] * precomps[15][extractIndex(blackBoard, whiteBoard, [2, 10, 18, 26, 34, 42, 50, 58])];
	result += neuralCoefficients[23] * precomps[15][extractIndex(blackBoard, whiteBoard, [3, 11, 19, 27, 35, 43, 51, 59])];
	result += neuralCoefficients[23] * precomps[15][extractIndex(blackBoard, whiteBoard, [4, 12, 20, 28, 36, 44, 52, 60])];
	result += neuralCoefficients[21] * precomps[15][extractIndex(blackBoard, whiteBoard, [5, 13, 21, 29, 37, 45, 53, 61])];
	result += neuralCoefficients[19] * precomps[15][extractIndex(blackBoard, whiteBoard, [6, 14, 22, 30, 38, 46, 54, 62])];
	result += neuralCoefficients[17] * precomps[15][extractIndex(blackBoard, whiteBoard, [7, 15, 23, 31, 39, 47, 55, 63])];
	//Diagonal Precomps
	result += 2 * neuralCoefficients[0] * precomps[0][extractIndex(blackBoard, whiteBoard, [7])];
	result += neuralCoefficients[4] * precomps[4][extractIndex(blackBoard, whiteBoard, [5, 14, 23])];
	result += neuralCoefficients[5] * precomps[5][extractIndex(blackBoard, whiteBoard, [5, 14, 23])];
	result += neuralCoefficients[6] * precomps[6][extractIndex(blackBoard, whiteBoard, [4, 13, 22, 31])];
	result += neuralCoefficients[7] * precomps[7][extractIndex(blackBoard, whiteBoard, [4, 13, 22, 31])];
	result += neuralCoefficients[8] * precomps[8][extractIndex(blackBoard, whiteBoard, [3, 12, 21, 30, 39])];
	result += neuralCoefficients[9] * precomps[9][extractIndex(blackBoard, whiteBoard, [3, 12, 21, 30, 39])];
	result += neuralCoefficients[10] * precomps[10][extractIndex(blackBoard, whiteBoard, [2, 11, 20, 29, 38, 47])];
	result += neuralCoefficients[11] * precomps[11][extractIndex(blackBoard, whiteBoard, [2, 11, 20, 29, 38, 47])];
	result += neuralCoefficients[15] * precomps[15][extractIndex(blackBoard, whiteBoard, [0, 9, 18, 27, 36, 45, 54, 63])];
	result += neuralCoefficients[10] * precomps[10][extractIndex(blackBoard, whiteBoard, [16, 25, 34, 43, 52, 61])];
	result += neuralCoefficients[11] * precomps[11][extractIndex(blackBoard, whiteBoard, [16, 25, 34, 43, 52, 61])];
	result += neuralCoefficients[8] * precomps[8][extractIndex(blackBoard, whiteBoard, [24, 33, 42, 51, 60])];
	result += neuralCoefficients[9] * precomps[9][extractIndex(blackBoard, whiteBoard, [24, 33, 42, 51, 60])];
	result += neuralCoefficients[6] * precomps[6][extractIndex(blackBoard, whiteBoard, [32, 41, 50, 59])];
	result += neuralCoefficients[7] * precomps[7][extractIndex(blackBoard, whiteBoard, [32, 41, 50, 59])];
	result += neuralCoefficients[4] * precomps[4][extractIndex(blackBoard, whiteBoard, [40, 49, 58])];
	result += neuralCoefficients[5] * precomps[5][extractIndex(blackBoard, whiteBoard, [40, 49, 58])];
	result += 2 * neuralCoefficients[0] * precomps[0][extractIndex(blackBoard, whiteBoard, [56])];
	//Anti-Diagonal Precomps
	result += 2 * neuralCoefficients[0] * precomps[0][extractIndex(blackBoard, whiteBoard, [0])];
	result += neuralCoefficients[4] * precomps[4][extractIndex(blackBoard, whiteBoard, [2, 9, 16])];
	result += neuralCoefficients[5] * precomps[5][extractIndex(blackBoard, whiteBoard, [2, 9, 16])];
	result += neuralCoefficients[6] * precomps[6][extractIndex(blackBoard, whiteBoard, [3, 10, 17, 24])];
	result += neuralCoefficients[7] * precomps[7][extractIndex(blackBoard, whiteBoard, [3, 10, 17, 24])];
	result += neuralCoefficients[8] * precomps[8][extractIndex(blackBoard, whiteBoard, [4, 11, 18, 25, 32])];
	result += neuralCoefficients[9] * precomps[9][extractIndex(blackBoard, whiteBoard, [4, 11, 18, 25, 32])];
	result += neuralCoefficients[10] * precomps[10][extractIndex(blackBoard, whiteBoard, [5, 12, 19, 26, 33, 40])];
	result += neuralCoefficients[11] * precomps[11][extractIndex(blackBoard, whiteBoard, [5, 12, 19, 26, 33, 40])];
	result += neuralCoefficients[15] * precomps[15][extractIndex(blackBoard, whiteBoard, [7, 14, 21, 28, 35, 42, 49, 56])];
	result += neuralCoefficients[10] * precomps[10][extractIndex(blackBoard, whiteBoard, [23, 30, 37, 44, 51, 58])];
	result += neuralCoefficients[11] * precomps[11][extractIndex(blackBoard, whiteBoard, [23, 30, 37, 44, 51, 58])];
	result += neuralCoefficients[8] * precomps[8][extractIndex(blackBoard, whiteBoard, [31, 38, 45, 52, 59])];
	result += neuralCoefficients[9] * precomps[9][extractIndex(blackBoard, whiteBoard, [31, 38, 45, 52, 59])];
	result += neuralCoefficients[6] * precomps[6][extractIndex(blackBoard, whiteBoard, [39, 46, 53, 60])];
	result += neuralCoefficients[7] * precomps[7][extractIndex(blackBoard, whiteBoard, [39, 46, 53, 60])];
	result += neuralCoefficients[4] * precomps[4][extractIndex(blackBoard, whiteBoard, [47, 54, 61])];
	result += neuralCoefficients[5] * precomps[5][extractIndex(blackBoard, whiteBoard, [47, 54, 61])];
	result += 2 * neuralCoefficients[0] * precomps[0][extractIndex(blackBoard, whiteBoard, [63])];
	return result;
}

function extractIndex(blackBoard, whiteBoard, positions)
{
	let index = 0;
	for(let k = 0; k < positions.length; ++k)
	{
		index *= 3;
		if(blackBoard[positions[k]])
			++index;
		else if(whiteBoard[positions[k]])
			index += 2;
	}
	return index;
}

module.exports = computeBlackMove