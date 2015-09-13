module.exports = {
  attributes: {
    owner: {
      model: 'user'
    },

    name: {
      type: 'string',
      required: true
    },

    members: {
      collection: 'user',
      via: 'memberGroups'
    }
  }
};
