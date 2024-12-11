const express = require('express');
const router = express.Router();

const shopCtrl = require('../controllers/shop');

router.get('/products', shopCtrl.getProductList);
router.get('/products/:productId', shopCtrl.getProductDetails);
router.get('/', shopCtrl.getIndex);
router.get('/cart', shopCtrl.getCart);
router.post('/cart', shopCtrl.postAddToCart);
router.post('/cart-delete-item', shopCtrl.postDeleteFromCart);
router.get('/orders', shopCtrl.getOrders);
router.get('/checkout', shopCtrl.getCheckout);

module.exports = router;
