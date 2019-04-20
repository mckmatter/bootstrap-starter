/*
	Database.js

	This file uses the sqlite3 module
*/

var sqlite = require('sqlite3').verbose()

module.exports.doEach = function(string, cb) {
	var result = [];

	let db = new sqlite.Database('./database/database.db', sqlite.OPEN_READONLY, (err) => {
		if(err) {
			cb(err.message, null)
		}
	})

	db.serialize(() => {
		db.each(string, (err, row) => {
			if(err) {
				cb(err.message, null)
			}
			result.push(row)
		})
	})

	db.close((err) => {
		if(err) {
			cb(err.message, null)
		}
		cb(null, result)
	})
}//END doEach

module.exports.doGet = function(string, params, cb) {

	var result;

	let db = new sqlite.Database('./database/database.db', sqlite.OPEN_READONLY, function(err) {
		if(err) {
			cb(err.message, null)
		}
	})

	db.get(string, params, function(err, row) {
		if(err) {
			cb(console.error(err.message), null)
		}
		result = row
	})

	db.close(function(err) {
		if(err) {
			console.log(err.message)
			cb(err, null)
		}
		cb(null, result)
	})
}//END doGet

module.exports.run = function(string, params, cb) {

	let db = new sqlite.Database('./database/database.db', sqlite.OPEN_READWRITE, function(err) {
		if(err) {
			cb(err.message, null)
		}
	})

	db.run(string, params, function(err) {
  		if (err) {
    		cb(err.message, null);
  		}
  		cb(null, 'Success')
	})
}

