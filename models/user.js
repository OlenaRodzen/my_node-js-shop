const ObjectId = require('mongodb').ObjectId;

const {getDB} = require('../util/database');
const product = require("./user");

class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart;
        this._id = new ObjectId(id);
    }

    save() {
        const db = getDB();
        return db.collection('users').insertOne(this);
    }

    addProductToCart(productId) {
        const productIndex = this.cart.items.findIndex(item => item.productId.toString() === productId.toString());
        const updatedCartItems = [...this.cart.items];
        if (productIndex >= 0) {
            updatedCartItems[productIndex].quantity += 1;
        } else {
            updatedCartItems.push({productId, quantity: 1});
        }
        const updatedCart = {items: updatedCartItems};
        const db = getDB();
        return db.collection('users').updateOne({_id: this._id}, {$set: {cart: updatedCart}});
    }

    getCart() {
        const productIds = this.cart.items.map(item => new ObjectId(item.productId));
        const db = getDB();
        return db.collection('products').find({_id: {$in: productIds}})
            .toArray()
            .then(products => {
                return products.map(product => ({
                    ...product,
                    quantity: this.cart.items.find(p => p.productId.toString() === product._id.toString()).quantity,
                }));
            });
    }

    deleteProductFromCart(productId) {
        const db = getDB();
        return db.collection('users').updateOne({_id: this._id}, {
            $set: {
                cart: {items: this.cart.items.filter(item => item.productId.toString() !== productId.toString())}
            }
        })
            .catch(err => {
                console.log(err);
            });
    }

    addOrder() {
        const db = getDB();
        return this.getCart()
            .then(products => {
                return db.collection('orders').insertOne({
                    items: products,
                    user: {_id: this._id, email: this.email},
                });
            })
            .then(() => {
                return db.collection('users').updateOne({_id: this._id}, {$set: {cart: {items: []}}})
            });
    }

    getOrders() {
        const db = getDB();
        return db.collection('orders').find({'user._id': this._id})
            .toArray();
    }

    static findById(id) {
        const db = getDB();
        return db.collection('users').findOne({_id: new ObjectId(id)});
    }
}

module.exports = User;
