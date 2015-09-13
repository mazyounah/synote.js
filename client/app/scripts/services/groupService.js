'use strict';

/**
 * @ngdoc service
 * @name synoteClient.multimediaService
 * @description
 * # multimediaService
 * Factory in the synoteClient.
 */
angular.module('synoteClient')
  .factory('groupService', ["$http","$q", 'ENV', 'authenticationService',
      function ($http, $q, ENV, authenticationService, messageCenterService) {

    function listGroup(){
      var deferred = $q.defer();

      var accessToken = authenticationService.isLoggedIn()?authenticationService.getUserInfo().accessToken:undefined;
      var accessTokenStr = accessToken?("access_token="+accessToken):"";

      $http.get(ENV.apiEndpoint + "/group/list"+"?"+accessTokenStr)
        .then(function (result) {
          if(result.status === 200)
            deferred.resolve(result.data);
          else
            deferred.reject({success:false,message:result.statusText});
        }, function (error) {
          deferred.reject(error);
        });

      return deferred.promise;
    }

    function get(id){
      var deferred = $q.defer();

      var accessToken = authenticationService.isLoggedIn()?authenticationService.getUserInfo().accessToken:undefined;
      var accessTokenStr = accessToken?("access_token="+accessToken):"";

      $http.get(ENV.apiEndpoint + "/group/"+id+"?"+accessTokenStr)
        .then(function (result) {
          if(result.status === 200)
            deferred.resolve(result.data);
          else
            deferred.reject({success:false,message:result.statusText});
        }, function (error) {
          deferred.reject(error);
        });

      return deferred.promise;
    }

    function create(data){
      var deferred = $q.defer();

      var accessToken = authenticationService.isLoggedIn()?authenticationService.getUserInfo().accessToken:undefined;
      var accessTokenStr = accessToken?("access_token="+accessToken):"";

      data.emails = data.emails.split(',');

      $http.post(ENV.apiEndpoint + "/group/create"+"?"+accessTokenStr, data)
        .then(function (result) {
          if(result.status === 200)
            deferred.resolve(result.data);
          else
            deferred.reject({success:false,message:result.statusText});
        }, function (error) {
          deferred.reject(error);
        });

      return deferred.promise;
    }

    function addMember(email, id){
      var deferred = $q.defer();

      var accessToken = authenticationService.isLoggedIn()?authenticationService.getUserInfo().accessToken:undefined;
      var accessTokenStr = accessToken?("access_token="+accessToken):"";

      var data = {
        email: email
      };

      $http.post(ENV.apiEndpoint + "/group/"+id+"/members/add?"+accessTokenStr, data)
        .then(function (result) {
          if(result.status === 200)
            deferred.resolve(result.data);
          else
            deferred.reject({success:false,message:result.statusText});
        }, function (error) {
          deferred.reject(error);
        });

      return deferred.promise;
    }

    return {
      listGroup: listGroup,
      get: get,
      create: create,
      addMember: addMember
    };

  }]);
