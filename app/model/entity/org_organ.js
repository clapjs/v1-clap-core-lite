'use strict';

module.exports = app => {
    return {
        organCode: {
            name: '组织编码',
            type: String,
        },
        organName: {
            name: '组织名称',
            type: String,
        },
        order: {
            name: '排序号',
            type: Number,
        },
    };
};
