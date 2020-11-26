const express = require('express');
const router = express.Router();
const data = require('../data')
const postData = data.post
const xss = require('xss')

router.get('/:id', async (req, res) => {
    try {
        const post = await postData.getPost(xss(req.params.id))
        const lengthOfLike = post.like
        const lengthOfDislike = post.dislike
        const render = {
            id: post._id, 
            title: post.title, 
            content: post.content, 
            author: post.author, 
            comments: post.comments,
            isAuthor: req.session.user==post.author,
            like: post.like, 
            dislike: post.dislike,
            lengthOfLike: lengthOfLike.length,
            lengthOfDislike :lengthOfDislike.length,
            user: req.session.user
        }
        console.log(render)
        res.render('singlePost', render)
    } catch(e){
        res.status(404).json({error: e})
    }
})

router.post('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const username = req.session.user
        const comment = req.body.comment
        await postData.addComment(xss(id), xss(username), xss(comment))
        res.redirect('/post/'+id)
    } catch(e) {
        res.status(400).json({error: e})
    }
})

router.post('/:id/like', async (req, res) => {
    try {
        const id = req.params.id
        const username = req.session.user
        const post = await postData.getPost(req.params.id)

        const likeArr = post.like
        const dislikeArr = post.dislike

        if(!likeArr.includes(username) && !dislikeArr.includes(username)) {
            await postData.addLike(xss(id), xss(username))
            res.redirect('/post/'+id)
        }else if(likeArr.includes(username) && !dislikeArr.includes(username)){
            await postData.deleteLike(xss(id), xss(username))
            res.redirect('/post/'+id)
        }else if(!likeArr.includes(username) && dislikeArr.includes(username)){
            await postData.deleteDislike(xss(id), xss(username))
            await postData.addLike(xss(id), xss(username))
            res.redirect('/post/'+id)
        }
        else{
            res.redirect('/post/'+id)
        }



    } catch(e) {
        res.status(400).json({error: "error in like"})
    }
})

router.post('/:id/dislike', async (req, res) => {
    try {
        const id = req.params.id
        const username = req.session.user
        const post = await postData.getPost(req.params.id)

        const likeArr = post.like
        const dislikeArr = post.dislike


        if(!likeArr.includes(username) && !dislikeArr.includes(username)) {
            await postData.addDislike(xss(id),xss(username))
            res.redirect('/post/'+xss(id))
        }else if(!likeArr.includes(username) && dislikeArr.includes(username)){
            await postData.deleteDislike(xss(id),xss(username))
            res.redirect('/post/'+xss(id))
        }else if(likeArr.includes(username) && !dislikeArr.includes(username)){
            await postData.deleteLike(xss(id), xss(username))
            await postData.addDislike(xss(id), xss(username))
            res.redirect('/post/'+xss(id))
        }
        else{
            res.redirect('/post/'+xss(id))
        }

    } catch(e) {
        res.status(400).json({error: "error in dislike"})
    }
})


router.get('/', async (req, res) => {
    res.redirect('/')
})

module.exports = router