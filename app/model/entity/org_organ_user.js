'use strict';

module.exports = app => {
    return {
        idOrgan: {
            type: app.Mongoose.Schema.ObjectId,
            ref: 'org_organ',
        },
        idUser: {
            type: app.Mongoose.Schema.ObjectId,
            ref: 'sys_user',
        },
        userType: {
            type: String,
        },
    };
};
