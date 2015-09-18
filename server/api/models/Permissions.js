var uuid = require('uuid');

module.exports = {
  attributes: {

    // Type of permission
    type: {
      type: 'string',
      in: ['private', 'public', 'link'],
      defaultsTo: 'public'
    },

    // Multimedia object the permission is referring to
    multimedia: {
      model: 'multimedia'
    },

    // Users that has this permission
    users: {
      collection: 'user',
      via: 'multimediaPermissions'
    },

    // Groups that has this permission
    groups: {
      collection: 'group',
      via: 'multimediaPermissions'
    },

    // Hash that will be supplied if the type is 'link'
    otp: {
      type: 'string',
      defaultsTo: '0'
    }
  },

  // The code below will be used to generate an otp (one time password)
  // if ever the type is 'link'
  beforeCreate: function(values, callback) {
    if (values.type === 'link' && values.otp === '0') {
      values.otp = uuid.v4();
    }

    callback();
  },

  beforeUpdate: function(values, callback) {
    if (values.type === 'link' && values.otp === '0') {
      values.otp = uuid.v4();
    }

    callback();
  }
  
};
