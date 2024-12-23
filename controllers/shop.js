const Product = require('../models/product');
const Order = require('../models/order');

exports.getProductList = (req, res) => {
    Product.find()
        .then((products) => {
            res.render('shop/product-list', {
                pageTitle: 'Products',
                path: '/products',
                products,
                isAuthenticated: req.session.isAuthenticated,
            });
        })
        .catch(err => console.log);
}

exports.getProductDetails = (req, res) => {
    const id = req.params.productId;
    Product.findById(id)
        .then((product) => {
            if (!product) {
                res.redirect('/404');
            } else {
                res.render('shop/product-detail', {
                    pageTitle: product.title,
                    path: '/products',
                    product,
                    isAuthenticated: req.session.isAuthenticated,
                });
            }
        })
        .catch(err => console.log);
}

exports.getIndex = (req, res) => {
    Product.find()
        .then((products) => {
            res.render('shop/index', {
                pageTitle: 'Shop',
                path: '/',
                products,
                isAuthenticated: req.session.isAuthenticated,
            });
        })
        .catch(err => console.log);
}

exports.getCart = (req, res) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items;
            const totalPrice = products.reduce((sum, product) => sum + product.productId.price * product.quantity, 0);
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                cart: {products, totalPrice},
                isAuthenticated: req.session.isAuthenticated,
            });
        })
        .catch(err => console.log);
}

exports.postAddToCart = (req, res) => {
    const id = req.body.productId;
    req.user.addProductToCart(id)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postDeleteFromCart = (req, res) => {
    const id = req.body.productId;
    req.user.deleteFromCart(id)
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getOrders = (req, res) => {
    Order.find({'user.userId': req.user._id})
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders,
                isAuthenticated: req.session.isAuthenticated,
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postOrder = (req, res) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map((item) => ({
                product: {...item.productId._doc},
                quantity: item.quantity,
            }));
            const order = new Order({
                products,
                user: {
                    userId: req.user._id,
                    email: req.user.email,
                },
            });
            return order.save();
        })
        .then(() => {
            return req.user.clearCart();
        })
        .then(() => res.redirect('/orders'))
        .catch(err => {
            console.log(err);
        });
};
