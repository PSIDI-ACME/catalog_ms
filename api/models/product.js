// Item de Produto

const productSchema = Schema({
    id: { type: ObjectId, required: true },
    productName: { type: String, required: true },
    productBrand: { type: String, required: true },
    productBarcode: { type: Number, required: true },
    price: { type: Number, required: true }
});

module.exports = model('Product', productSchema);