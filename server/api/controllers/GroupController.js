module.exports = {

  // Action for listing groups
  list: function(req, res) {
    var ownerId = req.session.user.id;

    // Get the groups owned by the current user, and populate the members field
    Group.find({ owner: ownerId }).populate('members').exec(function(err, groups) {
      if (err) {
        sails.log.error(err);
        return res.serverError();
      }

      // Return the groups array via the 'groups' key in JSON
      res.json({ success: true, groups: groups });
    });
  },


  // Action for removing a member from 
  removeMember: function(req, res) {
    var ownerId = req.session.user.id;

    // Get the group that was specified in the URL params, and must be owned by the current user
    Group.findOne({ owner: ownerId, id: req.params.group }, function(err, group) {
      if (err) {
        sails.log.error(err);
        return res.serverError();
      }

      // Return a 404 if the group was not found, or was not owned by the current user
      if (!group) return res.notFound();

      // Check if the user being removed is actually a user
      User.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
          sails.log.error(err);
          return res.serverError();
        }

        // Same as before, return 404 if it doesn't exist
        if (!user) return res.notFound();

        // We get the index of the userId from the member list and use splice
        // to remove that element. Splice modifies the array without the need of
        // re-assigning it
        var ix = group.members.indexOf(user.id);
        if (ix > -1) group.members.splice(user.id, 1);

        // Use the .save() instance method to save changes on the members array
        group.save(function(err) {
          if (err) {
            sails.log.error(err);
            return res.serverError();
          }

          res.json({ success: true });
        });
      });
    });
  },

  // Action to add a member to the group
  addMember: function(req, res) {
    var ownerId = req.session.user.id;

    // Same as removeMember, the group must be owned by the user and it should exist
    Group.findOne({ owner: ownerId, id: req.params.group }, function(err, group) {
      if (err) {
        sails.log.error(err);
        return res.serverError();
      }

      if (!group) return res.notFound();

      // And the user being added is also existing.
      // Please note that this is necessary because we store the user ids on the
      // members array, instead of emails 
      User.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
          sails.log.error(err);
          return res.serverError();
        }

        if (!user) return res.notFound();

        // Use the .add() association function to add a member
        group.members.add(user.id);

        // And then save it
        group.save(function(err) {
          if (err) {
            sails.log.error(err);
            return res.serverError();
          }

          res.json({ success: true });
        });
      });
    });
  },

  // Action to create a group
  create: function(req, res) {
    var group = {};

    // Initialize the group variables
    // Owner must be the current user logged in
    group.owner = req.session.user.id;
    group.name = req.body.name;
    group.members = [];

    // This one uses the async module to go over each email concurrently
    async.each(req.body.emails, function(email, eachCallback) {

      // Find the user object associated with each email
      User.findOne({ email: email }, function(err, user) {
        if (err) return eachCallback(err);
        if (user) { 

          // Add the user id to the array if the user exists
          // Unlike other actions, we simply ignore invalid (non-existing) emails
          // We also use .push() since we're modifying the array, not the association
          group.members.push(user.id);

          // This callback tells async that the execution on this block is
          // finished
          eachCallback();
        } else {
          eachCallback();
        }
      });
      
    // Once all elements are passed through, this callback will fire up, indication
    // the async.each is done
    }, function(err) {
      if (err) {
        sails.log.error();
        return res.serverError();
      }

      // Create using the usual model function
      Group.create(group, function(err, group) {
        res.json({ success: true, group: group });
      });
    });
  },

  // Action for deleting groups
  delete: function(req, res) {
    var ownerId = req.session.user.id;

    // Remove the group that is existing and owned by the current logged in user
    Group.destroy({ owner: ownerId, id: req.params.group }, function(err) {
      if (err) {
        sails.log.error(err);
        return res.serverError();
      }

      // This one's pretty simple and straightforward
      res.json({ success: true });
    });
  },

  // Action for getting a specific group
  get: function(req, res) {
    var ownerId = req.session.user.id;

    // Again, the group must exist and owned by the user
    // This is simlilar to listing the group, except this uses findOne which returns only 1 result
    Group.findOne({ owner: ownerId, id: req.params.group }).populate('members').exec(function(err, group) {
      if (err) {
        sails.log.error(err);
        return res.serverError();
      }

      if (!group) return res.notFound();

      // Return in via the 'group' object in the 'group' key
      res.json({ success: true, group: group });
    });
  }
};
