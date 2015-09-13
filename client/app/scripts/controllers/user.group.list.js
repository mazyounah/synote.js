'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:UserGroupListCtrl
 * @description
 * # UserGroupListCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('UserGroupListCtrl',["$scope", '$location', '$document', "groupService", "utilService",'messageCenterService','authenticationService', function ($scope, $location, $document, groupService,utilService,messageCenterService,authenticationService) {
    $scope.groups= [];

    $scope.listGroup = function(){
      $scope.listPromise = groupService.listGroup().then(function(result){
          $scope.groups = result.groups;
          var headerH3= angular.element(document.getElementById('mygroup_list_header'));
          $document.scrollToElementAnimated(headerH3);
        },
        function(error){
          messageCenterService.add('danger', error);
        }
      );
    };

    $scope.listGroup();

    $scope.move = function(){
      $location.path('/group.create');
      return;
    }

  }]);
