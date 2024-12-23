const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getSignup = (req, res) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        isAuthenticated: false,
    });
}

exports.postSignup = (req, res) => {
    const {email, password} = req.body;
    User.findOne({email})
        .then((user) => {
            if (user) {
                return res.redirect('/signup');
            }
            bcrypt.hash(password, 12)
                .then(hash => {
                    const newUser = new User({email, password: hash, cart: {items: []}});
                    return newUser.save();
                })
                .then(() => {
                    res.redirect('/login');
                })
                .catch((err) => {console.log(err)});
        })
        .catch((err) => {console.log(err)});
}

exports.getLogin = (req, res) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: false,
    });
}

exports.postLogin = (req, res) => {
    const {email, password} = req.body;
    User.findOne({email})
        .then((user) => {
            if (!user) {
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(match => {
                    if (!match) {
                        return res.redirect('/login');
                    }
                    req.session.user = user;
                    req.session.isAuthenticated = true;
                    return req.session.save((err) =>{
                        console.log(err);
                        res.redirect('/');
                    });
                })
        })
        .catch((err) => {console.log(err)});
}

exports.postLogout = (req, res) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}