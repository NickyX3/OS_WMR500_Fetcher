#!/usr/bin/node

var mqtt  = require('mqtt');
var md5   = require('md5');

String.prototype.insert = function (index, string) {
  if (index > 0)
   return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};

var host       = 'mqtt.idtlive.com';
var your_mail  = 'your_account_mail@somehost.com'; // see in app, registered account
var clientId   = 'Android_' + your_mail;
var deviceId   = 'your-device-id'; // see in app connected device section, something like F9987D92-E180-64DE-A202-D43AAD0D5784
var channelId  = 1; // channel beetwen station & external sensors block

var timeInMs   = Date.now();
var uniqTopic  = md5(timeInMs).toUpperCase().insert(8,'-').insert(13,'-').insert(18,'-').insert(23,'-');

var client = mqtt.connect( {
  host : host,
  port : 1883,
  cliendId : clientId
});

client.on('connect', function() {
  client.subscribe('enno/out/json/'+uniqTopic,
    function(err) {
      if (!err) {
        client.publish('enno/out/json/'+deviceId, '{"command":"getChannel'+channelId+'Status","id":"'+uniqTopic+'"}');
      } else {
        console.log('connect error');
      }
    })
});

client.on('message', function(topic, message) {
  console.log(message.toString())
  client.end()
});
