'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:GroupCtrl
 * @description
 * # GroupCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('GroupCtrl', ['$scope', '$route', '$document', '$routeParams','$filter', '$location','messageCenterService','authenticationService','groupService',  function ($scope, $route, $document, $routeParams, $filter, $location, messageCenterService, authenticationService, groupService){

    var $translate = $filter('translate');
    $scope.groupid = $routeParams.groupId;
    $scope.group = null;
    $scope.members = [];
    $scope.isOwner = false;

    $scope.getPromise = groupService.get($scope.groupid)
      .then(function(data){
        $scope.group = data.group;
        $scope.members = data.group.members;
        if(authenticationService.isLoggedIn())
          $scope.isOwner = ($scope.group.owner===authenticationService.getUserInfo().id)?true:false;
      },function(error){
        messageCenterService.add('danger',error);
      })

    $scope.addMember = function(){
      var email = document.getElementsByName('email')[0].value;
      $scope.getPromise = groupService.addMember(email, $scope.groupid)
        .then(function(data){
          $route.reload();
        }, function(error){
          messageCenterService.add('error', error,{timeout:3000});
        });
    };

  }]);
