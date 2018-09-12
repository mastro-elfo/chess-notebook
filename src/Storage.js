// TODO: Test

export var Storage = {
	storage: sessionStorage,

	get: function(key) {
		try {return JSON.parse(this.storage[key]);}
		catch(e){return null;}
	},

	set: function(key, value){
		this.storage[key] = JSON.stringify(value);
	},

	up: function(key, value) {
		this.storage[key] = JSON.parse({
			...this.storage[key],
			...value
		});
	},

	clear: function(){
		this.storage.clear();
	}
}

export var Local = {
	...Storage,
	storage: localStorage
}

export var Session = {
	...Storage,
	storage: sessionStorage
}
