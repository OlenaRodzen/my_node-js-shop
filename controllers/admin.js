const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
}

exports.postAddProduct = (req, res) => {
    req.user.createProduct(req.body)
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log);

}

exports.getEditProduct = (req, res) => {
    const id = req.params.productId;
    req.user.getProducts({where: {id}})
        .then(([product]) => {
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
    Product.findByPk(id)
        .then(product => {
            return product.update(req.body);
        })
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log);
}

exports.getProducts = (req, res) => {
    req.user.getProducts()
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
    Product.findByPk(id)
        .then(product => {
            return product.destroy(id);
        })
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.log)
};
