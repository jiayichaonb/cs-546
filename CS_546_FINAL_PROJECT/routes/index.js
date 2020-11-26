const path = require('path');
const mainRoutes = require('./main');
const loginRoutes = require('./login');
const newRoutes = require('./new');
const logoutRoutes = require('./logout');
const signupRoutes = require('./signup');
const postRoutes = require('./post')
const updateRoutes = require('./update')




const constructor = (app) => {
    app.use('/', mainRoutes);
    app.use('/login', loginRoutes);
    app.use('/new', newRoutes);
    app.use('/logout', logoutRoutes);
    app.use('/signup', signupRoutes);
    app.use('/post', postRoutes)
    app.use('/update', updateRoutes)
    app.use('*', (req, res) => {
        res.sendStatus(404)
    })
    
}

module.exports = constructor