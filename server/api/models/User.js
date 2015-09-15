/**
 * User
 *
 * @module      :: Model
 * @description :: This is the base user model
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = {

  attributes: require('waterlock').models.user.attributes({
    username:{
      type:"string",
      required:true,
      unique:true
    },
    //Password is not needed here
    //password: {
    //  type: "string",
    //  required: true
    //},
    firstname:{
      type: "string",
      required: true
    },
    lastname:{
      type: "string",
      required: true
    },
    defaultimg:{
      type:"string",
      required: true,
      defaultsTo:"https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=144"
    },
    email:{
      type: "email",
      required: true,
      unique: true
    },
    jsonWebTokens: {
      collection: 'jwt',
      via: 'owner'
    },
    enabled:{
      type:'boolean',
      defaultsTo:true
    },
    role:{
      type:"string",
      enum:['normal','admin','teacher'],
      required:true,
      defaultsTo:"normal" //could be admin, normal
    },
    multimedias:{
      collection:'multimedia',
      via:'owner'
    },
    synmarks:{
      collection:'synmark',
      via:'owner'
    },
    transcripts:{
      collection:'transcript',
      via:'owner'
    },
    slides:{
      collection:'slide',
      via:'owner'
    },
    cues:{
      collection:'cue',
      via:'owner'
    },
    tags:{
      collection:'tag',
      via:'owner'
    },
    comments:{
      collection:'comment',
      via:'owner'
    },

    // This attribute returns all the groups owned by the user
    ownedGroups: {
      collection: 'group',
      via: 'owner'
    },

    // This one returns all the groups that the user was a member of
    memberGroups: {
      collection: 'group',
      via: 'members'
    }
  }),
  
  beforeCreate: require('waterlock').models.user.beforeCreate,
  beforeUpdate: require('waterlock').models.user.beforeUpdate
};
