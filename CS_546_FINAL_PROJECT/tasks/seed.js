var fs = require('fs');
const data = require('../data');
const userData = data.user;
const postData = data.post;
const bcrypt = require('bcryptjs')
var json = JSON.parse(fs.readFileSync('./tasks/seedData.json').toString());
seedUser = json.seedUser;
seedPost = json.seedPost;

async function seed0() {

    seedUser.forEach(async user => {

        try {

            let name = String(user.username);
            let email = String(user.email);

            let hashedPass = String(await bcrypt.hash(user.password, 5));

            await userData.addUser(name, hashedPass, email);
        }
        catch (e) {
            throw e
        }

    });
}

async function seed1() {

    seedPost.forEach(async post => {

        try {
            await postData.createPost(String(post.title), String(post.author), String(post.category), String(post.content));
        }
        catch (e) {
            throw e
        }

        process.exit();

    });
}

seed0();
seed1();
