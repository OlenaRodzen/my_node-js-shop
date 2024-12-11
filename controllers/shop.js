const Product = require('../models/product');
const Cart = require("../models/cart");

exports.getProductList = (req, res) => {
    Product.getAllProducts((products) => {
        res.render('shop/product-list', {pageTitle: 'Products', path: '/products', products});
    });
}

exports.getProductDetails = (req, res) => {
    const id = req.params.productId;
    Product.getById(id, (product) => {
        if (!product) {
            res.redirect('/404');
        } else {
            res.render('shop/product-detail', {pageTitle: product.title, path: '/products', product});
        }
    })
}

exports.getIndex = (req, res) => {
    Product.getAllProducts((products) => {
        res.render('shop/index', {pageTitle: 'Shop', path: '/', products});
    });
}

exports.getCart = (req, res) => {
    Cart.getCart((cart) => {
        Product.getAllProducts((products) => {
            cart.products.forEach(product => {
                product.productData = products.find(p => p.id === product.id);
            })
            res.render('shop/cart', {pageTitle: 'Your Cart', path: '/cart', cart});
        })

    });
}

exports.postAddToCart = (req, res) => {
    const id = req.body.productId;
    Product.getById(id, (product) => {
        Cart.addToCart(id, product.price);
        res.redirect('/cart');
    });
}

exports.postDeleteFromCart = (req, res) => {
    const id = req.body.productId;
    Product.delete(id);
    res.redirect('/cart');
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};
