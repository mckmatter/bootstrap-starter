//userAuth.js


var User = require('../models/User.js')
var jwt = require('jsonwebtoken')
var secret = process.env.SECRET
var bcrypt = require('bcrypt')


module.exports.getToken = function(req, res, next){

	if(req.body.username && req.body.password){

		User.getHash(req.body.username, function(err, result){
			if(err){
				res.sendStatus(500)
			}
			else{
				bcrypt.compare(req.body.password, result.hash, function(err, bcryptResult){
					if(err){
						console.log('bcrypt err: ' + result)
					}
					else if(bcryptResult) {
						jwt.sign({
							exp: Math.floor(Date.now() / 1000) + (60 * 60),
							username: req.body.username
						}, secret, function(err, token) {
							console.log(err)
							res.token = token
							next()
						})
					}
					else{
						res.sendStatus(403)
					}
				})//END bcrypt.compare
			}//END good result from User.getHash
		})//END User.getHash
	}//END if user and pass

	//No user and pass
	else {
		res.sendStatus(403)
	}

}//END getToken


module.exports.verifyToken = function(req, res, next){

	if(req.headers.authorization){
		//the decoded object contains what was signed with the token
		//in this case, the username
		jwt.verify(req.headers.authorization, secret, function(err, decoded) {
			if(err) {
				res.sendStatus(403)
			}
			else {
				req.username = decoded.username
				//console.log(decoded)
				next()
			}
		})	
	}
	else {
		res.sendStatus(403)
	}
}//END Verify Token

module.exports.isTokenValid = function(token) {
	return new Promise(function(resolve, reject) {
		jwt.verify(token, secret, function(err, decoded) {
			if(err) {
				reject();
			}
			resolve(decoded.username);
		});	
	});
};