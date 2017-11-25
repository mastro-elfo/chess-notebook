export default class Storage {
	/**
	 * Class constructor
	 * @param  {string} key     Storage key
	 * @param  {object || null} options Storage and Json Object
	 */
	constructor(key, options) {
		this.key = key;
		options = options || {
			json: JSON,
			storage: localStorage
		};
		this.json = options.json;
		this.storage = options.storage;
	}

	/**
	 * Stringify `value` and save to storage
	 * @param  {mixed} value Value to saveKey
	 * @return {object} `this`
	 */
	save(value){
		this.storage.setItem(this.key, this.json.stringify(value));
		return this;
	}

	/**
	 * Load from storage with optional default value
	 * @param  {mixed} defaults Default value(s)
	 * @return {mixed}          Loaded or default value
	 */
	load(defaults){
		defaults = defaults || {};
		const value = this.json.parse(this.storage.getItem(this.key));
		if(value === null || typeof value === 'undefined') {
			return defaults;
		}
		else if (typeof value === 'string' || typeof value === 'number') {
			return value;
		}
		else {
			return Object.assign(defaults, value);
		}
	}

	/**
	 * Remove the `key` from storage
	 * @return {object}       `this`
	 */
	remove(){
		this.storage.removeItem(this.key);
		return this;
	}

	/**
	 * Clear everything from storage
	 * @return {object}       `this`
	 */
	clear(){
		this.storage.clear();
		return this;
	}

	/**
	 * Evaluate the size of Storage
	 * @return {number}
	 */
	size(){
		let sum = 0;
		for(var i in this.storage) {
			if(typeof this.storage[i] === 'string') {
				sum += this.storage[i].length;
			}
		}
		return sum;
	}

	/**
	 * Generate a unique id from list
	 * @param  {array} list Assumes items in list have `id` property
	 * @return {number}     Unique id
	 */
	uid(list){
		let uid = 1;
		list.map(item => uid = uid <= item.id ? item.id +1 : uid);
		return uid;
	}
}

export class GameStorage extends Storage {
	constructor(options){
		super('games', options);
	}

	/**
	 * Load games from storage
	 * @return {array} Games
	 */
	loadGames() {
		return this.load([]);
	}

	/**
	 * Save games to storage
	 * @param  {array} games Games
	 * @return {object}       `this`
	 */
	saveGames(games) {
		return this.save(games);
	}

	/**
	 * Remove a list of games from Storage
	 * @param  {array} gamesId Id of games to removed
	 * @return {array}         Removed games
	 */
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

	/**
	 * Load a game from Storage
	 * @param  {number} gameId Id of the game to load
	 * @return {object || null} Game
	 */
	loadGame(gameId) {
		return this.loadGames().find(game => game.id === gameId);
	}

	/**
	 * Save a game to storage
	 *
	 * If no `id` given, generate a new one. Also updates `edit` property with `+new Date()`.
	 * @param  {object} gameData Game
	 * @return {object} `gameData`
	 */
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
	/**
	 * Load lines in a games
	 * @param  {number} gameId Game id
	 * @return {array || null}
	 */
	loadLines(gameId) {
		let game = this.loadGame(gameId);
		if(!game) {
			return null;
		}
		else {
			return game.lines;
		}
	}

	/**
	 * Save lines in a games
	 * @param  {number} gameId Game id
	 * @param  {array} lines  LineStorage
	 * @return {object} `this`
	 */
	saveLines(gameId, lines) {
		let game = this.loadGame(gameId);
		if(game) {
			game.lines = lines;
			this.saveGame(game);
		}
		return this;
	}

	/**
	 * Remove lines in a game
	 * @param  {number} gameId  Game id
	 * @param  {array} linesId Array of ids to removed
	 * @return {array} Removed lines
	 */
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

	/**
	 * Load a line in a game
	 * @param  {number} gameId Game id
	 * @param  {number} lineId Line id
	 * @return {object || null} Loaded line
	 */
	loadLine(gameId, lineId) {
		return (this.loadLines(gameId) || []).find(line => line.id === lineId);
	}

	/**
	 * Save a line in a games
	 *
	 * If no `id` given, generate a new one
	 * @param  {number} gameId   Game id
	 * @param  {object} lineData Line gameData
	 * @return {object} `lineData`
	 */
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

	/**
	 * Remove a line from a games
	 * @param  {number} gameId Game id
	 * @param  {number} lineId Line id
	 * @return {object} Removed line
	 * @deprecated Use `removeLines`
	 */
	// removeLine(gameId, lineId){
	// 	let removed = null;
	// 	let lines = this.loadLines(gameId);
	// 	const index = lines.indexOf(lines.find(line => line.id === lineId));
	// 	if(index !== -1) {
	// 		removed = lines.splice(index, 1);
	// 	}
	// 	this.saveLines(gameId, lines);
	// 	return removed;
	// }
}

export class SettingsStorage extends Storage {
	constructor(options){
		super('settings', options);
	}

	loadKey(key, defaultValue) {
		const settings = this.load({});
		if(key in settings) {
			return settings[key];
		}
		else {
			return defaultValue;
		}
	}

	saveKey(key, value){
		const settings = this.load({});
		settings[key] = value;
		this.save(settings);
	}
}
