const path = require('path');

const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');

const errorCtrl = require('./controllers/error');
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const User = require('./models/user');

const CONNECTION_URI = "mongodb+srv://rnlena:wvTLaOxGYtrRRt0x@cluster0.oz97f.mongodb.net/?w=majority&appName=Cluster0";

const app = express();
const store = new MongoDBStore({
    uri: CONNECTION_URI,
    collection: 'sessions',
});
const csrfProtection = csurf({});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(path.dirname(require.main.filename), 'public')));
app.use(session({store: store, secret: 'my_secret', resave: false, saveUninitialized: false}));
// app.use(csrfProtection);

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log);
})

app.use(authRoutes);
app.use(shopRoutes);
app.use('/admin', adminRoutes);

app.use(errorCtrl.get404);

mongoose.connect(CONNECTION_URI)
    .then(() => {
        app.listen(3000);
    })
    .catch((err) => { console.log(err)});


