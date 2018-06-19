const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const ClassifySchema = new mongoose.Schema({
  name: String,
  image: String,
  desc: String,
  productList: [{type: ObjectId, ref: 'product'}],
  status: Number, // 0==不显示 1==显示
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
ClassifySchema.pre('save', function (next) {
  if (this.isNew) {
    console.log('isNew')
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next()
});

const ClassifyModel = mongoose.model('classify',ClassifySchema)

module.exports = ClassifyModel