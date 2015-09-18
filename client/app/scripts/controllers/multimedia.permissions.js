'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:MultimediaPermissionsCtrl
 * @description
 * # MultimediaPermissionsCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('MultimediaPermissionsCtrl', ["$scope","$route","$filter","$location","$routeParams", "multimediaService", "utilService","groupService",'messageCenterService','authenticationService',
    function ($scope,$route,$filter, $location, $routeParams, multimediaService,utilService,groupService,messageCenterService,authenticationService) {
      var $translate = $filter('translate');

      var mmid = $routeParams.mmid;
      if(!mmid){
        $location.path('/');
      }

      $scope.permissions = {};
      $scope.permissions.users = [];
      $scope.permissions.groups = [];
      $scope.permissionsPromise = multimediaService.getPermissions(mmid).then(function(permissions){
        $scope.permissions.id = permissions.id;
        $scope.permissions.type = permissions.type;
        $scope.permissions.otp = permissions.otp;
        $scope.permissions.users = permissions.users;
        $scope.permissions.groups = permissions.groups;

        $scope.otl = 'http://' + location.host + '/#/watch/' + mmid + '?otp=' + permissions.otp

        $scope.user = {};
        $scope.userGroupsPromise = groupService.listGroup().then(function(result) {
          $scope.groups = result.groups;
          $scope.groups.forEach(function(group) {
            group.hasp = false;
            $scope.permissions.groups.forEach(function(pgroup) {
              if (pgroup.id === group.id) group.hasp = true;
            });
          });
        }, function(err) {
          $location.path('/');
        });
      },function(err){
        $location.path('/');
        messageCenterService.add('danger',$translate('MMID_INVALID_TEXT'),{timeout:5000});
      });


      $scope.groupChecked = function(id) {
        multimediaService.allowGroup(mmid, id).then(function() {
          $route.reload();
        }, function() {
          $route.reload();
        });
      };

      $scope.permissionsChange = function() {
        multimediaService.setPermissions(mmid, $scope.permissions.type).then(function() {
          $route.reload();
        }, function(err) {
          $route.reload();
        });
      };

      $scope.addUser = function() {
        var email = document.getElementsByName('email')[0].value;
        multimediaService.allowUser(mmid, email).then(function() {
          $route.reload();
        }, function(err) {
          $route.reload();
        });
      };

  }]);
