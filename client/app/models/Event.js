class Event {
  constructor(name) {
    this.name = name;
    this.callbacks = [];
  }
  registerCallback(callback){
    this.callbacks.push(callback);
  }
};
export default Event
