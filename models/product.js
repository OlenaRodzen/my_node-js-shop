const ObjectId = require('mongodb').ObjectId;

const {getDB} = require('../util/database');

class Product {
    constructor(title, price, description, imageUrl, userId, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.userId = userId;
        this._id = id ? new ObjectId(id) : null;
    }

    save() {
        const db = getDB();
        let dbOp;
        if (this._id) {
            dbOp = db.collection('products').updateOne({_id: this._id}, {$set: this});
        }
        dbOp = db.collection('products').insertOne(this);
        return dbOp
            .then(result => {
                console.log(result);
            })
            .catch((err) => {console.log(err);});
    }

    static findAll() {
        const db = getDB();
        console.log('find products');
        return db.collection('products').find()
            .toArray();
    }

    static findById(id) {
        const db = getDB();
        return db.collection('products').findOne({_id: new ObjectId(id)});
    }

    static deleteById(id) {
        const db = getDB();
        return db.collection('products').deleteOne({_id: new ObjectId(id)})
            .then(result => {
                console.log(result);
            })
            .catch((err) => {console.log(err);});
    }
}


module.exports = Product;
