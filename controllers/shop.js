const Product = require('../models/product');

exports.getProductList = (req, res) => {
    Product.findAll()
        .then((products) => {
            console.log(products);
            res.render('shop/product-list', {pageTitle: 'Products', path: '/products', products});
        })
        .catch(err => console.log);
}

exports.getProductDetails = (req, res) => {
    const id = req.params.productId;
    Product.findByPk(id)
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
    let userCart;
    req.user.getCart()
        .then((cart) => {
            userCart = cart;
            return cart.getProducts()
        })
        .then((products) => {
            const totalPrice = products.reduce((sum, product) => sum + product.price * product.cartItem.quantity, 0);
            res.render('shop/cart', {pageTitle: 'Your Cart', path: '/cart', cart: {products, totalPrice}});
        })
        .catch(err => console.log);
}

exports.postAddToCart = (req, res) => {
    const id = req.body.productId;
    let newQuantity = 1;
    let userCart;
    req.user.getCart()
        .then(cart => {
            userCart = cart;
            return cart.getProducts({where: {id}});
        })
        .then((products) => {
            let product;
            if (products && products.length > 0) {
                product = products[0];
            }
            if (product) {
                newQuantity += product.cartItem.quantity;
                return product;
            }

            return Product.findByPk(id);
        })
        .then(product => {
            return userCart.addProduct(product, {through: {quantity: newQuantity}});
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postDeleteFromCart = (req, res) => {
    const id = req.body.productId;
    req.user.getCart()
        .then(cart => cart.getProducts({where: {id}}))
        .then(([product]) => product.cartItem.destroy())
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getOrders = (req, res) => {
    req.user.getOrders({include: ['products']})
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
    let userCart;
    req.user.getCart()
        .then(cart => {
            userCart = cart;
            return cart.getProducts()
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                   return order.addProducts(products.map(product => {
                        product.orderItem = {quantity: product.cartItem.quantity}
                        return product;
                    }))
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .then(() => userCart.setProducts(null))
        .then(() => res.redirect('/orders'))
        .catch(err => {
            console.log(err);
        });
};
