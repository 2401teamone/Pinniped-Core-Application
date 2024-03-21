/**
 * A class that mounts the handler function passed to 'add' which is a function
 * That gets invoked when the specified event is emitted. An instance of
 * PinnipedEvent also controls when to emit the specified event.
 * @param {object NodeEmitter instance} emitter
 * @param {string} eventName
 * @param {string[] Table Names} tables
 */
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
