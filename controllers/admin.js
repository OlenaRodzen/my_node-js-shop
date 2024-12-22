const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
}

exports.postAddProduct = (req, res) => {
    const product = new Product(req.body.title, req.body.price, req.body.description, req.body.imageUrl, req.user._id);
    product.save()
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log);

}

exports.getEditProduct = (req, res) => {
    const id = req.params.productId;
    console.log('getEditProduct', id);
    Product.findById(id)
        .then((product) => {
            if (!product) {
                return res.redirect('/admin/products');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: true,
                product
            });
        })
        .catch(err => console.log);
}

exports.postEditProduct = (req, res) => {
    const id = req.body.productId
    const product = new Product(req.body.title, req.body.price,
        req.body.description, req.body.imageUrl, req.user._id, id);
    product.save()
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log);
}

exports.getProducts = (req, res) => {
    Product.findAll()
        .then(products => {
            res.render('admin/products', {
                products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => console.log);
};

exports.postDeleteProduct = (req, res) => {
    const id = req.body.productId;
    Product.deleteById(id)
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.log)
};
