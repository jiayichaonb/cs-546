const mongoCollections = require('../MongoDB/mongoCollections')
const token = mongoCollections.token

module.exports = {
    async addToken(username, tokenIn) {
        console.log(username, tokenIn)
        if (!username || !tokenIn) throw 'Incomplete info'
        let newToken = {
            username: username,
            token: tokenIn
        }

        const tokenCollection = await token()
        const insertInfo = await tokenCollection.insertOne(newToken)
        if (insertInfo.insertedCount == 0) throw 'Failed to add'
        else return true
    },

    async getToken(username) {

        const tokenCollection = await token()
        const foundToken = await tokenCollection.findOne({ username: username });
        return foundToken
    },

    async deleteTokens(username) {

        const tokenCollection = await token()

        const deleteInfo = await tokenCollection.deleteMany({ username: username })
    }
}