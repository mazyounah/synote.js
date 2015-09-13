module.exports = {
  list: function(req, res) {
    var ownerId = req.session.user.id;

    Group.find({ owner: ownerId }).populate('members').exec(function(err, groups) {
      if (err) {
        sails.log.error(err);
        return res.serverError();
      }

      res.json({ success: true, groups: groups });
    });
  },

  removeMember: function(req, res) {
    var ownerId = req.session.user.id;

    Group.findOne({ owner: ownerId, id: req.params.group }, function(err, group) {
      if (err) {
        sails.log.error(err);
        return res.serverError();
      }

      if (!group) return res.notFound();

      User.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
          sails.log.error(err);
          return res.serverError();
        }

        if (!user) return res.notFound();

        var ix = group.members.indexOf(user.id);
        if (ix > -1) group.members.splice(user.id, 1);

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

  addMember: function(req, res) {
    var ownerId = req.session.user.id;

    Group.findOne({ owner: ownerId, id: req.params.group }, function(err, group) {
      if (err) {
        sails.log.error(err);
        return res.serverError();
      }

      if (!group) return res.notFound();

      User.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
          sails.log.error(err);
          return res.serverError();
        }

        if (!user) return res.notFound();

        group.members.add(user.id);
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

  create: function(req, res) {
    var group = {};

    group.owner = req.session.user.id;
    group.name = req.body.name;
    group.members = [];

    async.each(req.body.emails, function(email, eachCallback) {

      User.findOne({ email: email }, function(err, user) {
        if (err) return eachCallback(err);
        if (user) { 
          group.members.push(user.id);
          eachCallback();
        } else {
          eachCallback();
        }
      });
      
    }, function(err) {
      if (err) {
        sails.log.error();
        return res.serverError();
      }

      Group.create(group, function(err, group) {
        res.json({ success: true, group: group });
      });
    });
  },

  delete: function(req, res) {
    var ownerId = req.session.user.id;

    Group.destroy({ owner: ownerId, id: req.params.group }, function(err) {
      if (err) {
        sails.log.error(err);
        return res.serverError();
      }

      res.json({ success: true });
    });
  },

  get: function(req, res) {
    var ownerId = req.session.user.id;

    Group.findOne({ owner: ownerId, id: req.params.group }).populate('members').exec(function(err, group) {
      if (err) {
        sails.log.error(err);
        return res.serverError();
      }

      if (!group) return res.notFound();

      res.json({ success: true, group: group });
    });
  }
};
