const express = require('express');
const router = express.Router();
const data = require('../data')
const postData = data.post
const xss = require('xss')

// render create post page only if logged in (check cookie), if not logged in redirect to login
router.get('/', async (req, res) => {
	if (req.session.user) { // add checking cookie expiration
        res.render('createPost')
    }
    else {
        res.status(403);
        res.render('login');
    }
});


// create post page only if logged in (check cookie), if not logged in redirect to login
router.post('/', async (req, res) => {
    if (req.session.user) {
        const body = req.body
        if (! body.title || !body.content || !body.category) throw "Incomplete info to create post"
        const username = req.session.user
        try {
            const newPost = await postData.createPost(xss(body.title), xss(username), xss(body.category), xss(body.content))
            const id = String(newPost._id)
            res.redirect('/post/'+id)
        } catch(e) {
            throw e
        }
    } else {
        res.render('login')
    }
});


module.exports = router;