'use strict';

/**
 * @ngdoc service
 * @name synoteClient.utilService
 * @description
 * # utilService
 * Factory in the synoteClient.
 * Some handy programmes to handle different problems
 */
angular.module('synoteClient')
  .factory('utilService', function () {
    var extractErrorMsgs = function(message){
      var messages = [];
      if(typeof message === 'string'){ //we customised the error message
        messages.push(message);
      }
      else if(typeof message === 'object'){
        for(var key in message.invalidAttributes){
          for(var i = 0; i<message.invalidAttributes[key].length;i++)
            messages.push(message.invalidAttributes[key][i].message);
        }
      }

      return messages;
    }

    var secondsToHHMMSS = function(totalSec){
      var hours = parseInt( totalSec / 3600,10 ) % 24;
      var minutes = parseInt( totalSec / 60,10 ) % 60;
      var seconds = parseInt(totalSec % 60,10);

      var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
      return result;
    }

    var HHMMSSToSeconds = function(hms){
      // your input string
      var a = hms.split(':'); // split it at the colons

      if(a.length !== 3)
        return NaN;
      // minutes are worth 60 seconds. Hours are worth 60 minutes.
      var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
      return seconds;
    }

    var isYouTubeURL = function(url,bool) {

      var pattern = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?(?=.*v=((\w|-){11}))(?:\S+)?$/;
      if (url.match(pattern)) {
        return (bool !== true) ? RegExp.$1 : true;
      } else { return false; }
    }

    var getVideoMIMEType = function(url){
      var patt1=/\.([0-9a-z]+)(?:[\?#]|$)/i;
      var ext = url.match(patt1);
      if(ext === null){
        return null;
      }
      else
      {
        var videoExt = ext[1]; //see http://stackoverflow.com/questions/6582171/javascript-regex-for-matching-extracting-file-extension
        switch(videoExt.toLowerCase()){
          case "mp4":
                return "video/mp4";
          case "ogg":
                return "video/ogg";
          case "webm":
                return "video/webm";
          default:
                return null;
        }
      }
    }

    var isEmptyObject = function(obj){
      if(typeof obj !== "object") return true;
      else return Object.keys(obj).length ===0
    }

    var getCloudinaryCompitableVideoSource = function(url){
      var mp4URL = url.substr(0, url.lastIndexOf(".")) + ".mp4";
      var oggURL = url.substr(0, url.lastIndexOf(".")) + ".ogg";
      var webmURL = url.substr(0, url.lastIndexOf(".")) + ".webm";

      return [
        {url: mp4URL, type:"video/mp4"},
        {url: oggURL, type:"video/ogg"},
        {url: webmURL, type:"video/webm"}
      ];
    }

    return {
      extractErrorMsgs:extractErrorMsgs,
      secondsToHHMMSS:secondsToHHMMSS,
      HHMMSSToSeconds:HHMMSSToSeconds,
      isYouTubeURL: isYouTubeURL,
      getVideoMIMEType:getVideoMIMEType,
      isEmptyObject:isEmptyObject,
      getCloudinaryCompitableVideoSource:getCloudinaryCompitableVideoSource
    }
  });
