'use strict';

module.exports = app => {
    return {
        fileCode: {
            name: '文件编码',
            type: String,
        },
        fileName: {
            name: '文件名称',
            type: String,
        },
        fileType: {
            name: '文件类型',
            type: String,
        },
        fileSize: {
            name: '文件大小',
            type: String,
        },
        filePath: {
            name: '文件路径',
            type: String,
        },
    };
};
