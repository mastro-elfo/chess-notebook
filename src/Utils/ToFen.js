export default function (position, turn, whiteCastling, blackCastling, enPassant, drawMoves, totalMoves){
	// See NewGame.jsx
	const castling = (whiteCastling + blackCastling).replace('-', '');
	return [
		position, turn, castling, enPassant, drawMoves, totalMoves
	].join(' ');
}
