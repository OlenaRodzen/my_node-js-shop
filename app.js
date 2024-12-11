const path = require('path');

const express = require('express');
const bodyParser = require("body-parser");

const pathFromRoot = require('./util/path');
const errorCtrl = require('./controllers/error');
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(pathFromRoot('public')));

app.use(shopRoutes);
app.use('/admin', adminRoutes);

app.use(errorCtrl.get404);

app.listen(3000);
