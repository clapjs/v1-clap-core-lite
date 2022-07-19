'use strict';

// add you build-in plugin here, example:
module.exports = {
    static: {
        enable: true,
    },
    security: {
        enable: true,
    },
    cors: {
        enable: true,
        package: 'egg-cors',
    },
    nunjucks: {
        enable: true,
        package: 'egg-view-nunjucks',
    },
    io: {
        enable: true,
        package: 'egg-socket.io',
    },
    clapMongoose: {
        enable: true,
        package: 'egg-clap-mongoose',
    },
};


