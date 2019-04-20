/*
	Example.js

	This is the model for interacting with the database's Table table
*/

var Database = require('../database/Database.js')

//Return Object containing stream information
module.exports.getRowByID = function(rowID, cb){

	var sql = 'SELECT id, title ' + 
				'FROM Example ' +
				'WHERE id = ?'

	var params = [rowID]

	Database.doGet(sql, params, cb)

}

module.exports.getRowsByUser = function(user, cb){
	var sql = 'SELECT Example.id, Example.title '+
				'FROM UserandRows ' +
				'INNER JOIN Example ' +
				'ON UserandRows.row=Example.id ' +
				'WHERE userandrows.name = ?;'

	var params = [user]

	console.log(user + 'from getRowsByHeader')

	Database.doGet(sql, params, cb)
}

module.exports.getAllRows = function(cb){

	var sql = 'SELECT id, title ' +
				'FROM Example'

	Database.doEach(sql, cb)
}