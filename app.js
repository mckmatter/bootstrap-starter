//app.js - Entry point

//require dotenv for environment variables
require('dotenv').config()

const express = require('express')
const app = require('express')();
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT


//Requires
var mustache = require('mustache-express')
var userAuth = require('./middlewares/userAuth.js')
var bodyParser = require('body-parser')
var winston = require('winston')
var fs = require('fs')
var morgan = require('morgan')



//Logging
var accessLogStream = fs.createWriteStream('./logs/access.log', { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
 
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});
 
const logger = createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [new transports.File({name: 'connection-log', filename: './logs/connection.log', level: 'info'}),
  				new transports.File({name: 'error-log', filename: './logs/error.log', level: 'error'}),
  				new transports.Console()]
});



//Set Render Engine
app.engine('mustache', mustache())
app.set('view engine', 'mustache')
app.set('views', __dirname+'/views')

//Models
var Example = require('./models/Example.js')

//Route req through body parser
app.use(bodyParser.json())

//Define Response Header
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	next();
});

//Socket Server
io.on('connection', function(socket){

	let token = socket.handshake.query.token
	let room = socket.handshake.query.room

	if(room && token && room != 'pi') {
		userAuth.isTokenValid(token).then(function(username) {
			socket.join(username)
			socket.join(room);
			logger.info('Web Browser joined room '+ room + ' and ' + username)
		}, function () {
			logger.error('Error validating web socket token')
		})
		return
	}


})

//GET login content
app.get('/login', function(req, res){
	logger.info('GET to /login')
	res.render('login')
})

//POST login to check credentials
app.post('/login', [userAuth.getToken], function(req, res){
	logger.info('POST to /login')
	res.json({token: res.token})
	res.end()
})

//GET rows from example based on username in token
app.get('/displays', [userAuth.verifyToken], function(req, res){
	Example.getRowsByUser(req.username, function(err, result){
		res.render('table', {table: result})
		logger.info('GET to /displays by ' + req.username)
	})
})

//Serve static files 
app.use(express.static('public'))

//HTTP Listener
http.listen(port, () => console.log(`App listening at ${port}`))