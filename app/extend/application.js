'use strict';

module.exports = {
  loadClapRouter(app) {
    require('../router')(app);
  },
  clapMongooseSchema(attributes, hasOwnerAttr, hasFlowAttr) {
    const Schema = new this.Mongoose.Schema(attributes, { timestamps: true });

    Schema.plugin(require('mongoose-deep-populate')(this.Mongoose));

    // 默认添加组织记录归属字段,如属性为false则不添加
    if (hasOwnerAttr || hasOwnerAttr === void (0)) {
      Schema.add({
        idOrgan: {
          type: this.Mongoose.Schema.ObjectId,
          ref: 'org_organ',
        },
      });
    }
    // 添加数据审批字段
    if (hasFlowAttr) {
      Schema.add({
        submitUser: {
          name: '提交人',
          type: this.Mongoose.Schema.ObjectId,
          ref: 'sys_user',
        },
        submitAt: {
          name: '提交日期',
          type: Date,
        },
        verifyUser: {
          name: '审核人',
          type: this.Mongoose.Schema.ObjectId,
          ref: 'sys_user',
        },
        verifyAt: {
          name: '审核日期',
          type: Date,
        },
        closeUser: {
          name: '关闭人',
          type: this.Mongoose.Schema.ObjectId,
          ref: 'sys_user',
        },
        closeAt: {
          name: '关闭日期',
          type: Date,
        },
        closeMemo: {
          name: '关闭备注',
          type: String,
        },
        openUser: {
          name: '打开人',
          type: this.Mongoose.Schema.ObjectId,
          ref: 'sys_user',
        },
        openAt: {
          name: '打开日期',
          type: Date,
        },
        openMemo: {
          name: '打开备注',
          type: String,
        },
      });
    }

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
