import Event   from './Event.js';
class Reactor {
  constructor() {
    this.events = {};
  }

  registerEvent(eventName){
    var event = new Event(eventName);
    this.events[eventName] = event;
  };

  dispatchEvent(eventName, eventArgs){
    this.events[eventName].callbacks.forEach(function(callback){
      callback(eventArgs);
    });
  };

  addEventListener(eventName, callback){
    this.events[eventName].registerCallback(callback);
  }
};

export default Reactor
