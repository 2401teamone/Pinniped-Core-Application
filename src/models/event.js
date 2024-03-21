export default class PinnipedEvent {
  constructor(emitter, eventName, tables = []) {
    this.emitter = emitter;
    this.eventName = eventName;
    this.tables = tables;
  }

  add = (handler) => {
    this.emitter.on(this.eventName, (responseData) => {
      if (
        (!this.tables.length ||
          this.tables.includes(responseData.data.table.name)) &&
        !responseData.res.finished
      ) {
        handler(responseData);
      }
    });
  };

  trigger(responseData) {
    this.emitter.emit(this.eventName, responseData);
  }
}
