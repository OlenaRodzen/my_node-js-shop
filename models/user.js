const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
                quantity: {
                    type: Number,
                    required: true,
                }
            }
        ]
    }
});

userSchema.methods.addProductToCart = function (productId) {
    const productIndex = this.cart.items.findIndex(item => item.productId.toString() === productId.toString());
    const updatedCartItems = [...this.cart.items];
    if (productIndex >= 0) {
        updatedCartItems[productIndex].quantity += 1;
    } else {
        updatedCartItems.push({productId, quantity: 1});
    }
    this.cart = {items: updatedCartItems};
    return this.save();
}

userSchema.methods.deleteFromCart = function (productId) {
    this.cart.items = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart.items = [];
    return this.save();
}

module.exports = mongoose.model('User', userSchema);