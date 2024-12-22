const Product = require('../models/product');

exports.getProductList = (req, res) => {
    Product.findAll()
        .then((products) => {
            res.render('shop/product-list', {pageTitle: 'Products', path: '/products', products});
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
                res.render('shop/product-detail', {pageTitle: product.title, path: '/products', product});
            }
        })
        .catch(err => console.log);
}

exports.getIndex = (req, res) => {
    Product.findAll()
        .then((products) => {
            res.render('shop/index', {pageTitle: 'Shop', path: '/', products});
        })
        .catch(err => console.log);
}

exports.getCart = (req, res) => {
    req.user.getCart()
        .then((products) => {
            console.log('products');
            console.log(products);
            const totalPrice = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
            res.render('shop/cart', {pageTitle: 'Your Cart', path: '/cart', cart: {products, totalPrice}});
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
    req.user.deleteProductFromCart(id)
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getOrders = (req, res) => {
    req.user.getOrders()
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postOrder = (req, res) => {
    req.user.addOrder()
        .then(() => res.redirect('/orders'))
        .catch(err => {
            console.log(err);
        });
};
