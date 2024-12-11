const fs = require('fs');

const pathFromRoot = require('../util/path');
const Cart = require("./cart");

const dataPath = pathFromRoot('data', 'products.json');

const write = (products) => {
    fs.writeFile(dataPath, JSON.stringify(products), (err) => {
        if (err) {
            console.log(err);
        }
    })
}

const getAllProducts = (cb) => {
    fs.readFile(dataPath, (err, data) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(data));
        }
    });
}

class Product {
    constructor({id, title, price, imageUrl, description}) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    save() {
        getAllProducts((products) => {
            if (this.id) {
                const productIndex = products.find(product => product.id === this.id);
                products[productIndex] = this;
            } else {
                this.id = products.length + 1;
                products.push(this);
            }
            write(products);
        })
    }

    static getAllProducts(cb) {
        fs.readFile(dataPath, (err, data) => {
            if (err) {
                cb([]);
            } else {
                cb(JSON.parse(data));
            }
        });
    }

    static delete(productId) {
        this.getAllProducts((products) => {
            const productIndex = products.findIndex(product => product.id === productId);
            Cart.deleteFromCart(productId);
            products.splice(productIndex, 1);
            write(products);
        });
    }

    static getById(productId, cb) {
        this.getAllProducts((products) => {
            const product = products.find(product => product.id === productId);
            cb(product);
        });
    }
}

module.exports = Product;
