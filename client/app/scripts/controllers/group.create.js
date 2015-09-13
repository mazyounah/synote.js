'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:GroupCreateCtrl
 * @description
 * # GroupCreateCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('GroupCreateCtrl', ['$scope','$filter','$location', 'groupService','messageCenterService',
      function ($scope,$filter, $location, groupService,messageCenterService) {

    var $translate = $filter('translate');
    $scope.formdata = {};

    $scope.processForm = function(){
      //deal with duration, don't need to, it's already there
      //deal with tags, don't need to, just put the string in, the server side will deal with it.
      messageCenterService.reset();
      if(!$scope.formdata.name) {
        messageCenterService.add('danger', $translate('GROUP_NAME_ERR_TEXT'));
      }
      else if(!$scope.formdata.emails) {
        messageCenterService.add('danger', $translate('GROUP_MEMBERS_ERR_TEXT'));
      }
      $scope.createPromise = groupService.create($scope.formdata)
        .then(function (data) {
          messageCenterService.add('success', $translate('CREATE_GROUP_SUCCESS_TEXT'),{timeout:3000, status: messageCenterService.status.next});
          $location.path('/group.details/'+data.plid);
        }, function (error) {
          messageCenterService.add('danger', error);

        });
    }

  }]);
