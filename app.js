const path = require('path');

const express = require('express');
const bodyParser = require("body-parser");

const errorCtrl = require('./controllers/error');
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const {connect} = require('./util/database');
const User = require('./models/user');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(path.dirname(require.main.filename), 'public')));

app.use((req, res, next) => {
    User.findById('67602b50b843b4549c7c465a')
        .then(user => {
            console.log('user');
            console.log(user);
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(err => console.log);
    // const user = new User('test', 'test@test.com', {items:[]});
    // user.save()
    //     .then(user => {console.log('User saved successfully!', user)})
    //     .catch(err => {console.log('Error saving user', err)});
    // next();
})

app.use(shopRoutes);
app.use('/admin', adminRoutes);

app.use(errorCtrl.get404);

connect()
    .then(() => {
        console.log('Connected!');
        app.listen(3000);
    })
    .catch((err) => console.log(err));


