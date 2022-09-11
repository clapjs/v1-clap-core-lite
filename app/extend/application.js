'use strict';

module.exports = {
  loadClapRouter(app) {
    require('../router')(app);
  },
  clapMongooseSchema(entity) {
    const Schema = new this.Mongoose.Schema(entity, { timestamps: true });

    Schema.plugin(require('mongoose-deep-populate')(this.Mongoose));

    Schema.add({
      __s: {
        name: '状态标记',
        type: Number,
        default: 1,
      },
      __r: {
        name: '删除标记',
        type: Number,
        default: 0,
      },
      createdUser: {
        name: '创建人',
        type: this.Mongoose.Schema.ObjectId,
        ref: 'sys_user',
      },
      updatedUser: {
        name: '修改人',
        type: this.Mongoose.Schema.ObjectId,
        ref: 'sys_user',
      },
    });

    Schema.set('toJSON', { getters: true, virtuals: true });

    Schema.set('toObject', { getters: true, virtuals: true });

    return Schema;
  },
};
