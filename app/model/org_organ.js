'use strict';

module.exports = app => {
  const attributes = {
    organCode: {
      name: '组织编码',
      type: String,
    },
    organName: {
      name: '组织名称',
      type: String,
    },
    license: {
      name: 'license',
      type: Date,
    },
    order: {
      name: '排序号',
      type: Number,
    },
  };

  return app.clapMongooseSchema(attributes, true);
};
