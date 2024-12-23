const express = require('express');
const router = express.Router();

const shopCtrl = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

router.get('/products', shopCtrl.getProductList);
router.get('/products/:productId', shopCtrl.getProductDetails);
router.get('/', shopCtrl.getIndex);
router.get('/cart', isAuth, shopCtrl.getCart);
router.post('/cart', isAuth, shopCtrl.postAddToCart);
router.post('/cart-delete-item', isAuth, shopCtrl.postDeleteFromCart);
router.get('/orders', isAuth, shopCtrl.getOrders);
router.post('/order', isAuth, shopCtrl.postOrder);

module.exports = router;
