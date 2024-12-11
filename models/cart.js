const fs = require('fs');

const pathFromRoot = require('../util/path');

const dataPath = pathFromRoot('data', 'cart.json');

const write = (products) => {
    fs.writeFile(dataPath, JSON.stringify(products), (err) => {
        if (err) {
            console.log(err);
        }
    })
}

class Cart {
    static getCart(cb) {
        fs.readFile(dataPath, (err, data) => {
            if (err) {
                cb({products: [], totalPrice: 0});
            } else {
                cb(JSON.parse(data));
            }
        });
    }

    static addToCart(productId, productPrice) {
        this.getCart(cart => {
                const productIndex = cart.products.findIndex(product => product.id === productId);
                if (productIndex === -1) {
                    cart.products.push({id: productId, price: productPrice, qty: 1});
                } else {
                    cart.products[productIndex].price += productPrice;
                    cart.products[productIndex].qty += 1;
                }
                cart.totalPrice += productPrice;
                write(cart);
            }
        );
    }

    static deleteFromCart(productId) {
        this.getCart(cart => {
            const productIndex = cart.products.findIndex(product => product.id === productId);
            if (productIndex === -1) return;
            cart.products[productIndex].qty -= 1;
            if (cart.products[productIndex].qty === 0)
            cart.totalPrice -= cart.products[productIndex].price;
            cart.products.splice(productIndex, 1);
            write(cart);
        });
    }
}

module.exports = Cart;
