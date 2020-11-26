const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const data = require('../data');
const userData = data.user;
const tokenData = data.token;
const xss = require('xss')

let tokenArr = {};

router.post('/', async (req, res) => {

	const body = req.body

	if (!body.username || !body.password) throw 'Incomplete info to log in'

	try {
		const user = await userData.getUser(body.username)

		if (!user) {
			res.status(401).json({ error: "USERNAME DOESNT EXIST" });
			return
		}

		const match = await bcrypt.compare(body.password, user.password)

		if (!match) {
			res.status(401).json({ error: "WRONG PASSWORD" });
			return
		}

		let authToken = Math.random().toString(36).substr(2);
		tokenArr[authToken] = body.username;
		res.status(200).json({ token: authToken });

	} catch (e) {
		console.log(e);
		res.status(408).json({ error: e });
		throw e
	}
})


router.get('/', async (req, res) => {
	res.status(403);
	res.render('login');
}),


//token authentication, if valid token issue session, add session token to server db and redirect
router.get('/:token', async (req, res) => {
	let loginToken = req.params.token;
	if (loginToken in tokenArr) {

	let sessionToken = Math.random().toString(36).substr(2);

		req.session.user = tokenArr[loginToken];
		req.session.sessionToken = sessionToken;

		await tokenData.deleteTokens(req.session.user);
		let tokenCond = await tokenData.addToken(tokenArr[loginToken], sessionToken);
		delete tokenArr[loginToken];

		if (tokenCond == true) {
			res.redirect('/');
		}
		else {
			res.status(403);
			res.render('login');
		}
	} else {
		res.status(403);
		res.render('login');
	};
}
);

module.exports = router;
