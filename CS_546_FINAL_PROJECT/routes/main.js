const express = require('express')
const router = express.Router()
const data = require('../data')
const postData = data.post
const xss = require('xss')

// check cookie if logged in and not expired, if so render main page if not redirect to login.
router.get('/', async (req, res) => {
    const allPosts = await postData.getAllPost()
    res.render('web', { posts: allPosts, user:xss(req.session.user) })
})

router.get('/Automobile', async (req, res) => {
    const allPosts = await postData.getPostByCategory("Automobile")
    res.render('web', { posts: allPosts, category: "Automobile", user:xss(req.session.user) })
})

router.get('/Food', async (req, res) => {
    const allPosts = await postData.getPostByCategory("Food")
    res.render('web', { posts: allPosts, category: "Food", user:xss(req.session.user) })
})

router.get('/Course', async (req, res) => {
    const allPosts = await postData.getPostByCategory("Course")
    res.render('web', { posts: allPosts, category: "Course", user:xss(req.session.user) })
})

router.post('/search', async (req, res) => {
    try {
        if (req.body.searchText.length === 0) {
            res.render('web', { error: [{ err: "BLANK SEARCH INPUT" }] })
        }
        else {
            let matches = await postData.search(xss(req.body.searchText));
            res.render('web', { posts: matches })
        }
    }
    catch (e) {
        if (e === "nomatch") {
            res.render('web', { error: [{ err: "NO MATCHES TRY AGAIN" }] })
        }
        else {
            res.status(404);
            res.send('404 error');
        }
    }
})


module.exports = router