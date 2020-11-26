const express = require('express');
const app = express();
const session = require('express-session')
const static = express.static(__dirname + '/public');

const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

const data = require('./data');
const tokenData = data.token;

//cookies
app.use(
	session({
		name: 'AuthCookie',
		secret: "this is secret",
		saveUninitialized: true,
		resave: false
	})
);

// block all methods except for get and post
app.use('/', async (req, res, next) => {

	if (req.method == 'GET' || req.method == 'POST') {
		next()
	} else {
		res.status(403);
		res.SEND('NICE TRY :) METHOD NOT ALLOWED');
	}
});

// checking requests to /login if already logged in
app.use('/login', async (req, res, next) => {

	if (req.session.user) {

		let serverToken = await tokenData.getToken(req.session.user);

		if (req.session.sessionToken === serverToken.token) {
			res.redirect('/')
		}
		else {
			next()
		}
	} else {
		next()
	}
});



// blocking unauthorized POST access on /post
app.use('/post', async (req, res, next) => {

	if (req.method == 'POST') {

		if (!req.session.user) {
			res.status(403);
			res.render('login');
		}
		else {
			let serverToken = await tokenData.getToken(req.session.user);

			if (req.session.sessionToken === serverToken.token) {
				next()
			}
			else {
				res.status(403);
				res.render('login');
			}
		}
	} else {
		next()
	}
});

// blocking unauthorized access on /update
app.use('/update', async (req, res, next) => {

	if (!req.session.user) {
		res.status(403);
		res.render('login');
	}
	else {

		let serverToken = await tokenData.getToken(req.session.user);

		if (req.session.sessionToken === serverToken.token) {
			next()
		}
		else {
			res.status(403);
			res.render('login');
		}
	}
});

// blocking unauthorized access on /new
app.use('/new', async (req, res, next) => {

	if (!req.session.user) {
		res.status(403);
		res.render('login');
	}
	else {

		let serverToken = await tokenData.getToken(req.session.user);

		if (req.session.sessionToken === serverToken.token) {
			next()
		}
		else {
			res.status(403);
			res.render('login');
		}
	}
});


// activity logging middleware
app.use(async (req, res, next) => {

	let outputMessage = "";
	let authMessage = "not-authenticated";

	if (req.session.user) { authMessage = "authenticated" }

	outputMessage = new Date().toUTCString() + " | " + req.method + " | " + req.originalUrl + " | " + authMessage;

	console.log(outputMessage);
	next();
});


configRoutes(app)

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log('Your routes will be running on http://localhost:3000');
});