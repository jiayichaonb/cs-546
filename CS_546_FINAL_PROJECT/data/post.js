const mongoCollections = require('../MongoDB/mongoCollections')
const post = mongoCollections.post
const objectID = require('mongodb').ObjectID

module.exports = {
    async createPost(title, author, category, content) {
        if (!title || !author || !category || !content) throw "can't create post since incomplete info"

        const postCollection = await post()

        let newPost = {
            'title': title,
            'author': author,
            'category': category,
            'content': content,
            'comments': [],
            'like': [],
            'dislike': [] 
        }

        const insertInfo = await postCollection.insertOne(newPost)
        if (insertInfo.insertedCount == 0) throw "Failed to create post into db"
        return await this.getPost(insertInfo.insertedId)
    },

    async getPost(id) {
        if (!id) throw 'no id'
        if (typeof id == 'string') id = objectID.createFromHexString(id)
        const postCollection = await post()
        const aPost = await postCollection.findOne({ _id: id })
        if (aPost === null) throw 'No post found'
        return aPost
    },

    async getPostByCategory(category) {
        console.log(category)
        if (!category) throw 'no category'
        const postCollection = await post()
        const allPosts = await postCollection.find({"category" : category}).toArray()
        return allPosts
    },

    async getAllPost() {
        const postCollection = await post()
        const allPosts = await postCollection.find({}).toArray()
        return allPosts
    },

    async deletePost(id) {
        if (!id) throw 'no id input'
        if (typeof id == 'string') id = objectID.createFromHexString(id)

        const postCollection = await post()

        const deleteInfo = await postCollection.removeOne({ _id: id })
        if (deleteInfo.deletedCount == 0) throw "Failed to delete post"
    },

    async updatePost(id, title, category, content) {
        let updatePost = {}
        if (title) updatePost.title = title
        if (category) updatePost.category = category
        if (content) updatePost.content = content
        const postCollection = await post()
        if (typeof id == 'string') id = objectID.createFromHexString(id)
        const updateInfo = await postCollection.updateOne({_id: id}, {$set: updatePost})
        if (updateInfo.modifiedCount == 0) throw "Failed to update post"
    },

    async search(searchText) {

        if (!searchText) throw "provide text to search for"

        const postCollection = await post();

        let searchTxt = String(searchText).split(" ").map(str => "\"" + str + "\"").join(' ');

        await postCollection.createIndex({ title: "text", content: "text" })

        let matches = await postCollection.find({ $text: { $search: searchTxt, $caseSensitive: false } }).toArray();
        
        if (matches.length == 0) throw "nomatch"

        return matches;
    },
    async addComment(id, author, comment) {
        try {
            if (!id || !author || !comment) throw 'Incomplete info to add comment'
            const aComment = {
                author: author,
                content: comment
            }
            if (typeof id == 'string') id = objectID.createFromHexString(id)
            const postCollection = await post()
            const updateInfo = await postCollection.updateOne({_id: id}, {$push: {comments: aComment}})
            if (updateInfo.modifiedCount == 0) throw 'Failed to add comment'
        } catch(e) {
            throw e
        }
    },

    async addLike(id, author) {
        try {
            if (!author || !id) throw 'Incomplete info '
            
            if (typeof id == 'string') id = objectID.createFromHexString(id)
            const postCollection = await post()
            
            // const PostsInId = await postCollection.find({_id: id})
            // const likeArr = PostsInId.like
            // const dislikeArr = PostsInId.dislike
            // if(likeArr.includes(author) || dislikeArr.includes(author)) throw "you already like or dislike this post!"

            const updateInfo = await postCollection.update({_id: id}, {$push: {like: author}})
            if (updateInfo.modifiedCount == 0) throw 'Failed to add like'
        } catch(e) {
            throw e
        }
    },

    async addDislike(id,author) {
        try {
            if (!author || !id) throw 'Incomplete info '
            
            if (typeof id == 'string') id = objectID.createFromHexString(id)
            const postCollection = await post()

            // const PostsInId = await postCollection.find({_id: id})
            // const likeArr = PostsInId.like
            // const dislikeArr = PostsInId.dislike
            // if(likeArr.includes(author) || dislikeArr.includes(author)) throw "you already like or dislike this post!"

            const updateInfo = await postCollection.update({_id: id}, {$push: {dislike: author}})

            if (updateInfo.modifiedCount == 0) throw 'Failed to add dislike'
        } catch(e) {
            throw e
        }
    },

    async deleteLike(id, author) {
        try {
            if (!author || !id) throw 'Incomplete info '
            
            if (typeof id == 'string') id = objectID.createFromHexString(id)
            const postCollection = await post()
            
            const updateInfo = await postCollection.update({_id: id}, {$pull: {like: author}})
            if (updateInfo.modifiedCount == 0) throw 'Failed to add like'
        } catch(e) {
            throw e
        }
    },

    async deleteDislike(id, author) {
        try {
            if (!author || !id) throw 'Incomplete info '
            
            if (typeof id == 'string') id = objectID.createFromHexString(id)
            const postCollection = await post()
            
            const updateInfo = await postCollection.update({_id: id}, {$pull: {dislike: author}})
            if (updateInfo.modifiedCount == 0) throw 'Failed to add like'
        } catch(e) {
            throw e
        }
    }

}