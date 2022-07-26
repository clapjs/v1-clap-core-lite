'use strict';

module.exports = app => {
  const attributes = {
    idUser: {
      type: app.Mongoose.Schema.ObjectId,
      ref: 'sys_user',
    },
    userType: {
      type: String,
    },
  };
  return app.clapMongooseSchema(attributes);
};
