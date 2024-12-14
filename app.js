const path = require('path');

const express = require('express');
const bodyParser = require("body-parser");

const pathFromRoot = require('./util/path');
const errorCtrl = require('./controllers/error');
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(pathFromRoot('public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log);
})

app.use(shopRoutes);
app.use('/admin', adminRoutes);

app.use(errorCtrl.get404);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});

sequelize.sync()
    .then(() => User.findByPk(1))
    .then(user => user ? user : User.create({name: 'Test', email: 'test@test.com'}))
    // .then(user => user.createCart())
    .then(() => app.listen(3000))
    .catch(err => console.log(err));

