const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const ProductSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  amount: Number,
  isSelected: Boolean,//精品推荐
  isBillboard: Boolean,//热卖榜单
  classify: {type: ObjectId, ref: 'Classify'},
  desc: String,
  meta: {
    createAt: {
        type: Date,
        default: Date.now()
    },
    updateAt: {
        type: Date,
        default: Date.now()
    }
  }
})
// 为模式添加新的方法
ProductSchema.pre('save', function (next) {
  if (this.isNew) {
    console.log('isNew')
      this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
      this.meta.updateAt = Date.now();
  }
  next()
});
const ProductModel = mongoose.model('product',ProductSchema)

module.exports = ProductModel