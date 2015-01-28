'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var debug = require('debug')('meshblu-rallyfighter')
var five = require('johnny-five'), button, led,  board = new five.Board();

var MESSAGE_SCHEMA = {
  type: 'object',
  properties: {
    command: {
      type: 'string',
       enum : ['wipe', 'stopwipe', 'lock', 'unlock', 'hazardon', 'hazardoff', 'headlighton', 'headlightoff'],
       require: true
    }
  }
};

var OPTIONS_SCHEMA = {
  type: 'object',
  properties: {
    firstExampleOption: {
      type: 'string',
      required: true
    }
  }
};

function Plugin(){
  this.options = {};
  this.messageSchema = MESSAGE_SCHEMA;
  this.optionsSchema = OPTIONS_SCHEMA;
  return this;
}
util.inherits(Plugin, EventEmitter);

board.on("ready", function() {

    var wipe = new five.Led(9);
    var wipe1 = new five.Led(4);
    var hazards= new five.Led(2);
    var unlock = new five.Led(5);
    var lock = new five.Led(6);
    var lheadlight = new five.Led(8);


Plugin.prototype.onMessage = function(message){
  var payload = message.payload;
  this.emit('message', {devices: ['*'], topic: 'echo', payload: payload});


     if(payload.command == "wipe"){
      console.log('wipe');
         // console.log("red on request received from skynet");
         wipe.on();
         wipe1.on();


        } else if(payload.command == "stopwipe"){
         // console.log("red off request received from skynet");
        wipe.off();
        wipe1.off();

        } else if(payload.command == 'hazardon'){
        hazard.on();
        } else if(payload.command == 'hazardoff'){
          hazard.off();
        
        } else if(payload.command == 'unlock'){
        unlock.on();
        
      
         setTimeout(function(){
          unlock.off();
       
                }, 500);
        } else if(payload.command == 'lock'){
          lock.on();
       
        setTimeout(function(){
            lock.off();
               
                }, 1000);

        } else if(payload.command == 'headlighton'){
 lheadlight.on();
        } else if(payload.command == 'headlightoff'){
         lheadlight.off();
        }

};

 }); //end board ready

Plugin.prototype.onConfig = function(device){
  this.setOptions(device.options||{});
};

Plugin.prototype.setOptions = function(options){
  this.options = options;
};

module.exports = {
  messageSchema: MESSAGE_SCHEMA,
  optionsSchema: OPTIONS_SCHEMA,
  Plugin: Plugin
};
