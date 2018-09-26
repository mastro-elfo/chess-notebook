export default function (position, turn) {
	let output = [];
	if(turn === 'w') {
		// find coordinates of black pawns on the fifth row
		output = position
			// extract the fifth row (third in fen)
			.split('/')[3]
			// explode numbers in position
			.replace(/\d/g, (match)=>'-'.repeat(+match)).split('')
			// maps the pieces on the third row:
			// substitute coordinates if piece is a pawn, null otherwise
			.map((piece, index) => piece === 'p' ? ('abcdefgh'.charAt(index)+'6') : null)
			// filter non null
			.filter(index => index);
	}
	else if(turn === 'b') {
		// See comments above
		output = position.split('/')[4].replace(/\d/g, (match)=>'-'.repeat(+match)).split('').map((piece, index) => piece === 'P' ? ('abcdefgh'.charAt(index)+'3') : null).filter(index => index);
	}
	return output;
}
