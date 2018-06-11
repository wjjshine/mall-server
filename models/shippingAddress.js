const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const ShippingAddressSchema = new mongoose.Schema({
  name: String,
  phone: Number,
  area: String,
  detailAddress: String,
  isDefault: {type: Boolean, default: false},
  ofUser:{ type: ObjectId, ref: 'User' },
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
ShippingAddressSchema.pre('save', function (next) {
  if (this.isNew) {
      this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
      this.meta.updateAt = Date.now();
  }
  next()
});

let ShippingAddressModal = mongoose.model('shippingAddress',ShippingAddressSchema)

module.exports =  ShippingAddressModal
