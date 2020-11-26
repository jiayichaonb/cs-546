const express = require('express');
const router = express.Router();
const data = require('../data');
const tokenData = data.token;

router.get('/', async (req, res) => {
    await tokenData.deleteTokens(req.session.user);
    req.session.destroy();
    res.redirect('/')
});

module.exports = router;