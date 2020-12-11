//item de produto

const productSchema = Schema({
    _id: { type: ObjectId, required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    barcode: { type: Number, required: true },
    price: { type: Number, required: true }
});

module.exports = model('Product', productSchema);