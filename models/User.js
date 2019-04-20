/*
	User.js

	This is the model for interacting with the User table
*/

var Database = require('../database/Database.js')

//get hash of password by username
module.exports.getHash = function(username, cb){

	var sql = 'SELECT hash ' +
				'FROM User ' + 
				'WHERE username = ?'

	var params = [username]

	Database.doGet(sql, params, cb)
}			