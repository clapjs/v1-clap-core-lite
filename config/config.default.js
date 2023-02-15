'use strict';

const path = require("path");

module.exports = appInfo => {
  const config = {};

  config.multipart = {
    mode: 'file',
    fileSize: '500mb',
    fileExtensions: [
      '.mp3',
      '.mp4',
      '.pdf',
      '.txt',
      '.doc',
      '.xlsx',
      '.xls',
      '.docx',
    ],
  };

  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: ['*']
  };

  config.cors = {
    allowHeaders: ['context-type', 'content-type', 'X-Requested-With', 'x-csrf-token'],
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true,
  };

  config.static = {
    prefix: '/',
    dir: [ path.join(appInfo.baseDir, 'app/public'), { prefix: '/assets', dir: path.join(appInfo.baseDir, 'app/assets') }],
    dynamic: true,
    preload: true,
    buffer: false,
    maxFiles: 1000,
  };

  config.notfound = {
    pageUrl: '/404',
  };

  config.view = {
    defaultViewEngine: 'nunjucks',
    root: [
      require('path').join(appInfo.baseDir, 'app/views'),
    ].join(',')
  };

  return config;
};
