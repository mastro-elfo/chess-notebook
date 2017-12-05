import React from 'react';
import {Link} from 'react-router-dom';
import ReactTooltip from 'react-tooltip'
import {LineStorage} from './storage';
import {ICONS} from './icons';
import './notebook.css';
import {Button} from './Button';
import Modal, {ModalButtons, ModalButton} from './modal';

export default class Notebook extends React.Component {
	constructor(props){
		super(props);
		const line = this.props.lines.find(line => line.id === this.props.selectedId);
		this.state = {
			...line,
			stateUpdate: null
		};
		this.lineStorage = new LineStorage();
	}

	onChangeComment(event){
		this.setState({
			comment: event.target.value
		});
		// TODO: static timeout?
		const line = this.props.lines.find(line => line.id === this.props.selectedId);
		line.comment = event.target.value;
		this.lineStorage.saveLine(this.props.gameId, line);
	}

	onClickBackToFirstMove(){
		const first = this.props.lines.find(line => line.play);
		if(first) {
			this.props.history.push(`/detail/${this.props.gameId}/${first.id}`);
		}
	}

	onClickUpOneLevel(){
		const line = this.props.lines.find(line => line.id === this.props.selectedId);
		if(line.parent !== null) {
			this.props.history.push(`/detail/${this.props.gameId}/${line.parent}`);
		}
	}

	onClickPlayThisMove(){
		let playingBefore = this.props.lines.find(line => line.play);
		let playingAfter = this.props.lines.find(line => line.id === this.props.selectedId);
		if(playingBefore){
			playingBefore.play = false;
			this.lineStorage.saveLine(this.props.gameId, playingBefore);
		}
		if(playingAfter){
			playingAfter.play = true;
			this.lineStorage.saveLine(this.props.gameId, playingAfter);
		}
		this.setState({
			play: true
		});
	}

	render(){
		const line = this.props.lines.find(line => line.id === this.props.selectedId);
		const parent = this.props.lines.find(aLine => aLine.id === line.parent);
		return (
			<div className="NotebookContainer">
				<div className="Notebook">
					<div className="buttons">
						<Button className="left" title="Back to first move" disabled={line.play} onClick={this.onClickBackToFirstMove.bind(this)}>
							<img alt="Back to first move" src={ICONS['rew']}/>
						</Button>
						<Button className="left" title="Up one level" disabled={!parent} onClick={this.onClickUpOneLevel.bind(this)}>
							<img alt="Up one level" src={ICONS['top']}/>
						</Button>
						<Button className="left" title="Play this move" disabled={line.play} onClick={this.onClickPlayThisMove.bind(this)}>
							<img alt="Play this move" src={ICONS['play']}/>
						</Button>
					</div>

					<Superline
						gameId={this.props.gameId}
						lines={this.props.lines}
						line={line}/>

					<div className="lastMove">
						<Move
							gameId={this.props.gameId}
							complete={true}
							line={line}
							noLink={true}/>
						<textarea
							value={line.comment}
							placeholder="Comment this move"
							onChange={this.onChangeComment.bind(this)}></textarea>
					</div>

					<Sublines
						gameId={this.props.gameId}
						lines={this.props.lines}
						line={line}
						onClickDelete={this.props.onClickDelete}/>
				</div>
			</div>
		);
	}
}

class Superline extends React.Component {
	render() {
		const parent = this.props.lines.find(line => line.id === this.props.line.parent);
		return (
			<div className="Superline">
				<div className="line">
					<div className="slider">
						{
							parent &&
							this.getSimpleLine(parent).map((ancestor, i) =>
								<Move
									key={i}
									complete={i===0}
									line={ancestor}
									gameId={this.props.gameId}/>
							)
						}
					</div>
				</div>
			</div>
		);
	}

	getSimpleLine(child) {
		let parent = this.props.lines.find(line => line.id === child.parent);
		if(parent) {
			let ancestors = this.getSimpleLine(parent);
			ancestors.push(child);
			return ancestors;
		}
		else if (child.san){
			return [child];
		}
		else {
			return [];
		}
	}
}

class Sublines extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			selected: [],
			edit: false
		};
	}

	onClickToggleAll(){
		const children = this.props.lines.filter(line => line.parent === this.props.line.id);
		if(this.state.selected.length === children.length) {
			this.setState({
				selected: []
			});
		}
		else {
			this.setState({
				selected: children.map(child => child.id)
			});
		}
	}

	onClickToggle(id){
		const children = this.props.lines.filter(line => line.parent === this.props.line.id);
		let selected = this.state.selected.slice();
		const index = selected.indexOf(id);
		if(index !== -1) {
			selected.splice(index, 1);
		}
		else {
			selected.push(id);
		}
		// Filter selected
		selected = selected.filter(lineId => lineId === id || children.find(child => child.id === lineId));
		this.setState({
			edit: this.props.line.id,
			selected: selected
		});
	}

	onClickDelete(){
		const selected = this.state.selected.slice();
		if(selected.length) {
			this.props.onClickDelete(this.state.selected.slice());
		}
		this.setState({
			confirmDeleteLines: false,
			edit: false
		});
	}

	onClickCancelEdit(){
		this.setState({
			edit: false,
			selected: []
		});
	}

	render(){
		const children = this.props.lines.filter(line => line.parent === this.props.line.id);
		return (
			<div className="Sublines">
				<div className="header">
					{this.state.edit === this.props.line.id &&
						[
							<Button key="cancelEdit" className="left" onClick={this.onClickCancelEdit.bind(this)} title="Cancel edit">
								<img alt="cancel" src={ICONS['back']}/>
							</Button>,
							<Button key="toggleAll" className="left" onClick={this.onClickToggleAll.bind(this)} title="Check all lines">
								{children.length && this.state.selected.length === children.length ? <img alt="" src={ICONS['boxChecked']}/> : <img alt="" src={ICONS['box']}/>}
							</Button>,
							<Button key="delete" className="right" onClick={()=>this.setState({confirmDeleteLines: true})} title="Delete selected lines" disabled={this.state.selected.length===0}>
								<img alt="delete" src={ICONS['trash']}/>
							</Button>,
							<span key="title">{this.state.selected.length} selected</span>
						]
					}
				</div>
				<div>
					{
						children.map((child, i) => this.renderSubline(child, i))
					}
				</div>
				{this.state.confirmDeleteLines &&
					<Modal onClose={()=>this.setState({confirmDeleteLines: false})}>
						<h1>Confirm delete lines</h1>
						<p>Do you really want to delete the selected lines?<br/>The operation can't be undone.</p>
						<ModalButtons>
							<ModalButton onClick={this.onClickDelete.bind(this)}>
								<img src={ICONS['boxChecked']} alt="ok"/> Confirm
							</ModalButton>
							<ModalButton onClick={()=>this.setState({confirmDeleteLines: false})}>
								<img src={ICONS['delete']} alt="x"/> Cancel
							</ModalButton>
						</ModalButtons>
					</Modal>}
			</div>
		);
	}

	getSimpleLine(parent) {
		let children = this.props.lines.filter(line => parent.id === line.parent);
		if(children.length === 1) {
			return children.concat(this.getSimpleLine(children[0]));
		}
		else if(children.length > 1) {
			return [children.length];
		}
		else {
			return [];
		}
	}

	renderSubline(child, i) {
		const isSelected = this.state.selected.indexOf(child.id) !== -1;
		return (
			<div key={i} className="line">
				<Button className="right" onClick={this.onClickToggle.bind(this, child.id)} title="Check line">
					{isSelected ? <img alt="x" src={ICONS['boxChecked']}/> : <img alt="x" src={ICONS['box']}/>}
				</Button>
				<div className="slider">
					<Move
						complete={true}
						line={child}
						gameId={this.props.gameId}/>
					{
						this.getSimpleLine(child).map((line, i) => {
							if(typeof line === "number") {
								return (
									<span key={i} className="more">+{line}</span>
								);
							}
							else {
								return <Move
											key={i}
											complete={false}
											line={line}
											gameId={this.props.gameId}/>
							}
						})
					}
				</div>
			</div>
		)
	}
}

class Move extends React.Component {
	static defaultProps = {
		complete: true,
		noLink: false
	};

	render(){
		const fen = this.props.line.fen.split(' ');
		const turn = fen[1];
		const totalMoves = fen[5];
		return (
			<span className="Move">
				{
					(turn === 'b' || this.props.complete) &&
					<strong>{
						turn === 'b' ? totalMoves : (totalMoves -1)
					}.</strong>
				}

				{
					turn === 'w' && this.props.complete &&
					<span>…</span>
				}

				{
					<span data-tip={this.props.line.comment}>
						{this.props.noLink &&
							[this.props.line.move,
							this.props.line.value]
						}
						{!this.props.noLink &&
							<Link to={`/detail/${this.props.gameId}/${this.props.line.id}`}>
								{this.props.line.move}
								{this.props.line.value}
							</Link>
						}
						<ReactTooltip place="top" type="dark" effect="solid"/>
					</span>
				}
			</span>
		);
	}
}
