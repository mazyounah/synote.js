module.exports = {

  // Action to get the current permissions object
  get: function(req, res) {
    var ownerId = req.session.user.id;

    // Get the multimedia that is owned by the user
    // Also, populate its permissions, if existing
    Multimedia.findOne({ owner: ownerId, id: req.params.multimedia }).populate('permissions').exec(function(err, multimedia) {
      if (err) {
        sails.log.error(err);
        return res.serverError();
      }

      // Return a 404 if the multimedia is not found
      if (!multimedia) return res.notFound();

      // The permissions object might not exist, return if it does
      if (multimedia.permissions) {

        // We need to get the object so we can populate the other attributes
        Permissions.findOne({ id: multimedia.permissions.id }).populate('groups').populate('users').exec(function(err, permissions) {
          if (err) {
            sails.log.error(err);
            return res.serverError();
          }

          // Return the permissions object
          res.json(200, { success: true, permissions: permissions });
        });

      // If it doesn't exist, create one
      } else {

        // Create based on the multimedia and the type specified in the request
        Permissions.create({ multimedia: req.params.multimedia }, function(err, permissions) {
          if (err) {
            sails.log.error(err);
            return res.serverError();
          }

          // Add the permission id to the multimedia object for later checking
          multimedia.permissions = permissions.id;
          multimedia.save(function(err) {
            if (err) {
              sails.log.error(err);
              return res.serverError();
            }

            res.json(200, { success: true, permissions: permissions });
          });
        });
      }
    });
  },

  // Action to set the initial permission of the multimedia
  set: function(req, res) {
    var ownerId = req.session.user.id;

    // Get the multimedia that is owned by the user
    // Also, populate its permissions, if existing
    Multimedia.findOne({ owner: ownerId, id: req.params.multimedia }).populate('permissions').exec(function(err, multimedia) {
      if (err) {
        sails.log.error(err);
        return res.serverError();
      }

      // Return a 404 if the multimedia is not found
      if (!multimedia) return res.notFound();

      // The permissions object might not exist, return and modify it if it does
      if (multimedia.permissions) {

        // Set the type from the request
        multimedia.permissions.type = req.body.type;

        // Save it
        multimedia.save(function(err) {
          if (err) {
            sails.log.error(err);
            return res.serverError();
          }

          // We need to get the object so we can populate the other attributes
          Permissions.findOne({ id: multimedia.permissions.id }).populate('groups').populate('users').exec(function(err, permissions) {
            if (err) {
              sails.log.error(err);
              return res.serverError();
            }

            // Return the permissions object
            res.json(200, { success: true, permissions: multimedia.permissions });
          });
        });

      // If it doesn't exist, create one
      } else {

        // Create based on the multimedia and the type specified in the request
        Permissions.create({ multimedia: req.params.multimedia, type: req.body.type }, function(err, permissions) {
          if (err) {
            sails.log.error(err);
            return res.serverError();
          }

          res.json(200, { success: true, permissions: permissions });
        });
      }
    });
  },

  // Action to add a group to the permissions
  addGroup: function(req, res) {

    // Get the permissions object based on the multimedia ID
    Permissions.findOne({ multimedia: req.params.multimedia }, function(err, permissions) {
      if (err) {
        sails.log.error(err);
        return res.serverError();
      }

      // Again return 404 if the permission is not found
      if (!permissions) return res.notFound();

      // Find the group object the id belongs to
      Group.findOne({ id: req.body.group }, function(err, group) {
        if (err) {
          sails.log.error(err);
          return res.serverError();
        }

        // return 404 if the group is not found
        if (!group) return res.notFound();

        // Add to the groups attribute then save
        permissions.groups.add(group.id);
        permissions.save(function(err) {
          if (err) {
            sails.log.error(err);
            return res.serverError();
          }

          return res.json({ success: true, permissions: permissions });
        });
      });
    });
  },

  // Pretty similar to the addGroup, this one adds to the users
  addUser: function(req, res) {

    // Get the permissions object based on the multimedia ID
    Permissions.findOne({ multimedia: req.params.multimedia }).populate('users').exec(function(err, permissions) {
      if (err) {
        sails.log.error(err);
        return res.serverError();
      }

      // Again return 404 if the permission is not found
      if (!permissions) return res.notFound();

      // Find the user  object the email belongs to
      User.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
          sails.log.error(err);
          return res.serverError();
        }

        // return 404 if the user is not found
        if (!user) return res.notFound();

        // Add to the users attribute then save
        permissions.users.add(user.id);
        permissions.save(function(err) {
          if (err) {
            sails.log.error(err);
            return res.serverError();
          }

          return res.json({ success: true, permissions: permissions });
        });
      });
    });
  }
};
