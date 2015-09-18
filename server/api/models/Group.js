
// The Group model
module.exports = {
  attributes: {

    // Owner of the group, linked to the User model
    owner: {
      model: 'user'
    },

    // Name of the group, implicitly max 255 characters
    name: {
      type: 'string',
      required: true
    },

    // Members of the group, linked to the User model as well 
    members: {
      collection: 'user',
      via: 'memberGroups'
    },

    // Permissions that the group has
    multimediaPermissions: {
      collection: 'permissions',
      via: 'groups'
    }
  }
};
