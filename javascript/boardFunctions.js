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

module.exports = {getBlackLegalMoves, getWhiteLegalMoves, makeBlackMove, makeWhiteMove};