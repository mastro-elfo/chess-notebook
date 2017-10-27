import React from 'react';
import './chessboard.css';

export default class Chessboard extends React.Component{
	static defaultProps = {
		fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
		side: 'w',
		showLabels: true,
		selectedCell: null,
		selectableCells: []
	};

	constructor(props) {
		super(props);
		this.state = {
			fontSize: 1
		};
	}

	componentDidMount(){
		window.addEventListener('resize', this.onWindowResize.bind(this));
		this.onWindowResize();
	}

	// componentWillUnmount(){
	// 	window.removeEventListener('resize', this.onWindowResize);
	// }

	onWindowResize(){
		if(this && this.refs && this.refs.ChessboardContainer){
			const size = Math.min(this.refs.ChessboardContainer.clientWidth, this.refs.ChessboardContainer.clientHeight) /16.5;
			this.setState({
				fontSize: size
			});
			this.props.onResize &&
			this.props.onResize(size);
		}
	}

	onClick(coords) {
		this.props.onClick &&
		this.props.onClick(coords);
	}

	onDrop(from, to) {
		this.props.onDrop &&
		this.props.onDrop(from, to);
	}

	render(){
		// Use only the position field of fen
		const position = this.props.fen.split(' ')[0];

		// Rows
		let rows = position.split('/');
		if(this.props.side === 'b') {
			rows.reverse();
		}

		return (
			<div className="ChessboardContainer" ref="ChessboardContainer">
				<div className="Chessboard" style={{fontSize: this.state.fontSize}}>
					{
						rows.map((row, i) =>
							<Row
								key={i}
								rowIndex={i}
								row={row}
								side={this.props.side}
								showLabels={this.props.showLabels}
								onClick={this.onClick.bind(this)}
								onDrop={this.onDrop.bind(this)}
								selectedCell={this.props.selectedCell}
								selectableCells={this.props.selectableCells}/>
						)
					}
				</div>
			</div>
		);
	}
}

class Row extends React.Component {
	render(){
		let cells = this.props.row.replace(/(\d)/g, (match) => ' '.repeat(parseInt(+match, 10))).split('');
		if(this.props.side === 'b') {
			cells.reverse();
		}

		return (
			<div className="Row">
				{
					cells.map((cell, i) =>
						<Cell
							key={i}
							rowIndex={this.props.rowIndex}
							colIndex={i}
							cell={cell}
							side={this.props.side}
							showLabels={this.props.showLabels}
							onClick={this.props.onClick}
							onDrop={this.props.onDrop}
							selectedCell={this.props.selectedCell}
							selectableCells={this.props.selectableCells}/>
					)
				}
			</div>
		);
	}
}

class Cell extends React.Component {
	onClick(coords){
		this.props.onClick(coords)
	}

	onDragStart(coords, event) {
		event.dataTransfer.setData('start', coords);
	}

	onDragOver(event) {
		event.preventDefault();
	}

	onDrop(coords, event) {
		event.preventDefault();
		const start = event.dataTransfer.getData('start');
		this.props.onDrop(start, coords);
	}

	render() {
		const coords = this.algebraic(this.props.colIndex, this.props.rowIndex, this.props.side);
		const isSelectable = this.props.selectableCells.indexOf(coords) !== -1;
		const className = [
			'Cell',
			(coords === this.props.selectedCell ? 'selected' : ''),
			(isSelectable ? 'selectable' : '')
		];

		return (
			<div className={className.join(' ')}
				 onClick={this.props.onClick.bind(this, coords)}
				 onDrop={this.onDrop.bind(this, coords)}
				 onDragOver={this.onDragOver.bind(this)}>
				{this.props.showLabels && this.props.colIndex === 0 && <span className="rowLabel">{coords[1]}</span>}

				{this.props.showLabels && this.props.rowIndex === 7 && <span className="colLabel">{coords[0]}</span>}

				{this.props.cell !== ' ' &&
					<span className="piece"
						  draggable={isSelectable}
						  onDragStart={this.onDragStart.bind(this, coords)}><img alt={this.props.cell} src={process.env.PUBLIC_URL+"/pieces/"+this.props.cell+".svg"}/></span>}
			</div>
		);
	}

	algebraic(col, row, side) {
		if(side === 'w') {
			return 'abcdefgh'.charAt(col)+(8-row);
		}
		else {
			return 'hgfedcba'.charAt(col)+(1+row);
		}
	}
}

export class Pool extends React.Component {
	static defaultProps = {
		pieces: '',
		size: 1
	};

	onDragStart(piece, event){
		event.dataTransfer.setData('start', piece);
	}

	render(){
		return (
			<div className="Pool" style={{fontSize: this.props.size}}>
				{
					this.props.pieces.split('').map((piece, i) => {
						const classNames = ['Piece', piece===this.props.selected?'selected':''];
						return (
							<div key={i} className={classNames.join(' ')} onClick={this.props.onClick.bind(this, piece)}>
								<span draggable={true} onDragStart={this.onDragStart.bind(this, piece)}>
									<img alt={piece} src={process.env.PUBLIC_URL+"/pieces/"+piece+".svg"}/>
								</span>
							</div>
						);
					})
				}
			</div>
		)
	}
}
