const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isAuthenticated,
    });
}

exports.postAddProduct = (req, res) => {
    const product = new Product({...req.body, userId: req.user._id});
    product.save()
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log);

}

exports.getEditProduct = (req, res) => {
    const id = req.params.productId;
    Product.findById(id)
        .then((product) => {
            if (!product) {
                return res.redirect('/admin/products');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: true,
                product,
                isAuthenticated: req.session.isAuthenticated,
            });
        })
        .catch(err => console.log);
}

exports.postEditProduct = (req, res) => {
    const id = req.body.productId;
    Product.findById(id)
        .then((product) => {
            product.title = req.body.title;
            product.description = req.body.description;
            product.price = req.body.price;
            product.imageUrl = req.body.imageUrl;
            return product.save()
        })
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log);
}

exports.getProducts = (req, res) => {
    Product.find()
        .then(products => {
            res.render('admin/products', {
                products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                isAuthenticated: req.session.isAuthenticated,
            });
        })
        .catch(err => console.log);
};

exports.postDeleteProduct = (req, res) => {
    const id = req.body.productId;
    Product.findByIdAndDelete(id)
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.log)
};
