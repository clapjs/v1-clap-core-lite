'use strict';

module.exports = app => {
    const attributes = {
        userCode: {
            name: 'userCode',
            type: String
        },
        userName: {
            name: 'userName',
            type: String
        },
        userPwd: {
            name: 'userPwd',
            type: String
        },
        avatarColor: {
            name: 'avatarColor',
            type: String
        },
        avatar: {
            name: 'avatar',
            type: String
        },
    };

    return app.clapMongooseSchema(attributes,false);
};
