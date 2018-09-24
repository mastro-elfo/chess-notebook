

	handleClickPlay(){
		// Load games
		let games = Local.get("Games");

		// Find active game
		let game = games.find(item => item.id === this.props.game.id)

		// Find active game index
		const gameIndex = games.findIndex(item => item.id === this.props.game.id);

		// Find active line
		let activeLine = game.lines.find(item => item.play);

		// Find active line index
		const activeIndex = game.lines.findIndex(item => item.play);

		// Find this line
		let thisLine = game.lines.find(item => item.id === this.props.line.id);

		// Find this line index
		const thisIndex = game.lines.findIndex(item => item.id === this.props.line.id);

		// Set active line `play = false`
		activeLine.play = false;

		// Set this line `play = true`
		thisLine.play = true;

		// Save "active" line
		game.lines[activeIndex] = activeLine;

		// Save this line
		game.lines[thisIndex] = thisLine;

		// Save games
		games[gameIndex] = game;

		// Store
		Local.set("Games", games);
	}
