/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

   '*': true,

  /***************************************************************************
  *                                                                          *
  * Here's an example of mapping some policies to run before a controller    *
  * and its actions                                                          *
  *                                                                          *
  ***************************************************************************/
	// RabbitController: {

		// Apply the `false` policy as the default for all of RabbitController's actions
		// (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
		// '*': false,

		// For the action `nurture`, apply the 'isRabbitMother' policy
		// (this overrides `false` above)
		// nurture	: 'isRabbitMother',

		// Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
		// before letting any users feed our rabbits
		// feed : ['isNiceToAnimals', 'hasRabbitFood']
	// }
	RtestController:{
	  admin:['isAdmin'],
	  restricted:['hasJsonWebToken'],
	  open:true
  	},
	MultimediaController:{
		metadata:['hasJsonWebToken','requireurlQuery', 'validatePermissions'],
		create:['hasJsonWebToken','requiretitleBody'],
		get:['optJsonWebToken','requiremmidParams', 'validatePermissions'],
		save:['hasJsonWebToken','requiremmidParams','isMultimediaOwner'],
		listByOwner:['hasJsonWebToken']
	},
	SynmarkController:{
		create:['hasJsonWebToken','requiremfstBody','requiremmidBody'],
		save:['hasJsonWebToken','requiresynmarkidParams','isSynmarkOwner'],
		delete:['hasJsonWebToken','requiresynmarkidParams','isSynmarkOwner'],
		listByOwner:['hasJsonWebToken']
	},
	PlaylistController:{
		create:['hasJsonWebToken','requiretitleBody'],
		list:['hasJsonWebToken'],
		save:['hasJsonWebToken','requireplidParams','isPlaylistOwner'],
		additem:['hasJsonWebToken','requiremmidParams', 'requireplidParams'],
		saveitems:['hasJsonWebToken','requireplidParams'],
		get:['optJsonWebToken', 'requireplidParams']

	},
	PlaylistItemSynmarkController:{
		addsynmark:['hasJsonWebToken','requirepliidParams','requiresynmarkidParams'], //permission
		removesynmark:['hasJsonWebToken', 'requirepliidParams', 'requiresynmarkidParams'] //permission
	},
	TranscriptController:{
		getByMultimedia:['requiremmidParams'],
		getAllByMultimedia:[]
	},
	TagController:{
		list:['hasJsonWebToken'],
		listJQCloud:['hasJsonWebToken'],
		listSynmarkTagJQCloud:['hasJsonWebToken']
	},

  // Group actions must adhere to the hasJsonWebToken policy
	GroupController:{
		list:['hasJsonWebToken'],
		create:['hasJsonWebToken'],
		addMember:['hasJsonWebToken'],
		removeMember:['hasJsonWebToken'],
		delete:['hasJsonWebToken']
	},

  // Permission related actions should adhere to the
  // hasJsonWebToken policy as well
	PermissionsController:{
		get:['hasJsonWebToken'],
		set:['hasJsonWebToken'],
		addUser:['hasJsonWebToken'],
		addGroup:['hasJsonWebToken']
	},

	SearchController:{
		do:['requirequeryQuery']
	}

};
