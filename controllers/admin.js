const Product = require('../models/product')

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
}

exports.postAddProduct = (req, res) => {
    const product = new Product(req.body);
    product.save();
    res.redirect('/admin/products');
}

exports.getEditProduct = (req, res) => {
    const id = req.params.productId;
    Product.getById(id, (product) => {
        if (!product) {
            res.redirect('/admin/products');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            product
        });
    });
}

exports.postEditProduct = (req, res) => {
    const product = new Product(req.body);
    product.save();
    res.redirect('/admin/products');
}

exports.getProducts = (req, res) => {
    Product.getAllProducts(products => {
        res.render('admin/products', {
            products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
};

exports.postDeleteProduct = (req, res) => {
    const id = req.body.productId;
    Product.delete(id);
    res.redirect('/admin/products');
};
