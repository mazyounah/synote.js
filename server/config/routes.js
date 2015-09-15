/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
  'get /multimedia/get/:mmid':'MultimediaController.get',
  'get /multimedia/metadata': 'MultimediaController.metadata',
  'post /multimedia/create':'MultimediaController.create',
  'post /multimedia/save/:mmid':'MultimediaController.save',
  'get /multimedia/list':'MultimediaController.list',
  'get /multimedia/list/owner':'MultimediaController.listByOwner',
  'post /playlist/create':'PlaylistController.create',
  'post /playlist/:plid/add/:mmid':'PlaylistController.additem',
  'post /playlist/:plid/save':'PlaylistController.saveitems',
  'post /playlist/save/:plid':'PlaylistController.save',
  'get /playlist/get/:plid':'PlaylistController.get',
  'post /playlistitemsynmark/:pliid/add/synmark/:synmarkid':'PlaylistItemSynmarkController.addsynmark',
  'delete /playlistitemsynmark/:pliid/remove/synmark/:synmarkid':'PlaylistItemSynmarkController.removesynmark',
  'get /synmark/get/:synmarkid':'SynmarkController.get',
  'get /synmark/list/owner':'SynmarkController.listByOwner',
  'post /synmark/create':'SynmarkController.create',
  'post /synmark/save/:synmarkid':'SynmarkController.save',
  'delete /synmark/delete/:synmarkid':'SynmarkController.delete',
  'get /transcript/get/:lang/multimedia/:mmid/':'TranscriptController.getByMultimedia',
  'get /transcript/get/all/multimedia/:mmid':'TranscriptController.getAllByMultimedia',
  'get /tag/list':'TagController.list', //list all tags
  'get /tag/list/jqcloud': 'TagController.listJQCloud', //list all tags in jqcloud format
  'get /tag/list/synmark/jqcloud': 'TagController.listSynmarkTagJQCloud',//list only synmark tags in jqcloud format
  'get /search':'SearchController.do',

  // All the routes related to group API
  'get /group/list':'GroupController.list',
  'post /group/create':'GroupController.create',
  'post /group/:group/members/add':'GroupController.addMember',
  'post /group/:group/members/remove':'GroupController.removeMember',
  'get /group/:group':'GroupController.get',
  'delete /group/:group':'GroupController.delete'
};
