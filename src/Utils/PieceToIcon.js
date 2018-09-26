import BlackBishop from '../Pieces/BlackBishop.svg';
import BlackKing from '../Pieces/BlackKing.svg';
import BlackKnight from '../Pieces/BlackKnight.svg';
import BlackPawn from '../Pieces/BlackPawn.svg';
import BlackQueen from '../Pieces/BlackQueen.svg';
import BlackRook from '../Pieces/BlackRook.svg';
import WhiteBishop from '../Pieces/WhiteBishop.svg';
import WhiteKing from '../Pieces/WhiteKing.svg';
import WhiteKnight from '../Pieces/WhiteKnight.svg';
import WhitePawn from '../Pieces/WhitePawn.svg';
import WhiteQueen from '../Pieces/WhiteQueen.svg';
import WhiteRook from '../Pieces/WhiteRook.svg';

export default function PieceToIcon (piece) {
	switch (piece) {
		case "b": return BlackBishop;
		case "k": return BlackKing;
		case "n": return BlackKnight;
		case "p": return BlackPawn;
		case "q": return BlackQueen;
		case "r": return BlackRook;
		case "B": return WhiteBishop;
		case "K": return WhiteKing;
		case "N": return WhiteKnight;
		case "P": return WhitePawn;
		case "Q": return WhiteQueen;
		case "R": return WhiteRook;
		default: return null;
	}
}
