
export default class Storage {
	constructor(){
		this.json = JSON;
		this.storage = localStorage;
	}

	save(key, value) {
		this.storage.setItem(key, this.json.stringify(value));
		return key;
	}

	load(key, defaultValue) {
		const value = this.json.parse(this.storage.getItem(key));
		if(value === null) {
			return defaultValue;
		}
		else {
			return value;
		}
	}

	remove(key){
		this.storage.removeItem(key);
	}

	clear() {
		this.storage.clear();
	}

	uid(list) {
		let uid = 1;
		list.map(item => uid = uid <= item.id ? item.id +1 : uid);
		return uid;
	}
}

export class GameStorage extends Storage {
	loadGames() {
		return this.load('games', []);
	}

	saveGames(games) {
		this.save('games', games);
		return games;
	}

	removeGames(gamesId) {
		let removed = [];
		let games = this.loadGames();
		gamesId.map(gameId => {
			const index = games.indexOf(games.find(game => game.id === gameId));
			if(index !== -1) {
				removed.push(games.splice(index, 1));
			}
			return gameId;
		})
		this.saveGames(games);
		return removed;
	}

	loadGame(gameId) {
		return this.loadGames().find(game => game.id === gameId);
	}

	saveGame(gameData) {
		let games = this.loadGames();
		gameData.edit = +new Date();
		if(gameData.id) {
			games = games.map(game => game.id === gameData.id ? gameData : game);
		}
		else {
			gameData.id = this.uid(games);
			games.push(gameData);
		}
		this.saveGames(games);
		return gameData;
	}
}

export class LineStorage extends GameStorage {
	loadLines(gameId) {
		let game = this.loadGame(gameId);
		if(!game) {
			return null;
		}
		else {
			return game.lines;
		}
	}

	saveLines(gameId, lines) {
		let game = this.loadGame(gameId);
		if(!game) {
			return null;
		}
		else {
			game.lines = lines;
			this.saveGame(game);
		}
	}

	removeLines(gameId, linesId) {
		let removed = [];
		let lines = this.loadLines(gameId);
		linesId.map(lineId => {
			const index = lines.indexOf(lines.find(line => line.id === lineId));
			if(index !== -1) {
				removed.push(lines.splice(index, 1));
			}
			return lineId;
		});
		this.saveLines(gameId, lines);
		return removed;
	}

	loadLine(gameId, lineId) {
		return (this.loadLines(gameId) || []).find(line => line.id === lineId);
	}

	saveLine(gameId, lineData) {
		let lines = this.loadLines(gameId);
		if(lineData.id || lineData.id === 0) {
			lines = lines.map(line => line.id === lineData.id ? lineData : line);
		}
		else {
			lineData.id = this.uid(lines);
			lines.push(lineData);
		}
		this.saveLines(gameId, lines);
		return lineData;
	}

	removeLine(gameId, lineId){
		let removed = null;
		let lines = this.loadLines(gameId);
		const index = lines.indexOf(lines.find(line => line.id === lineId));
		if(index !== -1) {
			removed = lines.splice(index, 1);
		}
		this.saveLines(gameId, lines);
		return removed;
	}
}

export class SettingsStorage extends Storage {
	loadKey(key, defaultValue) {
		const settings = this.load('Settings', {});
		if(key in settings) {
			return settings[key];
		}
		else {
			return defaultValue;
		}
	}

	saveKey(key, value){
		const settings = this.load('Settings', {});
		settings[key] = value;
		this.save('Settings', settings);
	}
}
