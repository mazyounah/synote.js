
// This policy validates the permission
module.exports = function(req, res, next) {
  var ownerId = req.session.user.id;

  // Get the multimedia object
  Multimedia.findOne({ id: req.params.mmid }).populate('permissions').exec(function(err, multimedia) {
    if (err) {
      sails.log.error(err);
      return res.serverError();
    }

    // Not found if it doesn't exist
    if (!multimedia) return res.notFound();

    // If its the owner, grant all access
    if (multimedia.owner == ownerId) return next();

    // If there's no permissions set, it must be public
    if (!multimedia.permissions) return next();

    // If the set type is public as well then grant access
    if (multimedia.permissions.type === 'public') return next();

    // If the type of permission is link, check the query params
    if (multimedia.permissions.type === 'link') {

      // Check if the one time password is similar to that on the query
      if (multimedia.permissions.otp === req.query.otp) return next();
      
      // Else return forbidden status
      else return res.forbidden();
    }

    // Lastly, check if its private
    if (multimedia.permissions.type === 'private') {

      // Get the permissions object to fill up users and groups
      return Permissions.findOne({ id: multimedia.permissions.id })
                        .populate('users')
                        .populate('groups')
                        .exec(function(err, permissions) {

        // Extract just the IDs
        var users = _.map(permissions.users, function(user) {
          return user.id;
        });

        // Even in the groups
        var groups = _.map(permissions.groups, function(group) {
          return group.id;
        });

        // Check first if the current user is in the user list of the permissions
        if (_.contains(users, ownerId)) return next();

        // Get the user object and populate the groups
        return User.findOne({ id: ownerId })
                   .populate('ownedGroups')
                   .populate('memberGroups')
                   .exec(function(err, user) {
          if (err) {
            sails.log.error(err);
            return res.serverError();
          }

          var ownedGroups = _.map(user.ownedGroups, function(group) {
            return group.id;
          });

          var memberGroups = _.map(user.memberGroups, function(group) {
            return group.id;
          });

          // Combine the groups in the same object
          var userGroups = _.uniq(_.union(ownedGroups, memberGroups));

          // Check if the one of the userGroups are on the permissions
          // This one bashes the userGroups and the valid groups in permissions
          // If the resulting array is more than 0, then there's a match
          var intersection = _.intersection(userGroups, groups);

          // Allow if intersection list is more than 0
          if (intersection.length > 0) return next();

          // Implicit block
          res.forbidden();
        });
      });

    } else {

      // This should not happen, but we're catching it anyways
      res.serverError();
    }
  });
};
