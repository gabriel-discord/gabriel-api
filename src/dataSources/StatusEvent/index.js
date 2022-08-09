class StatusEvent{
  constructor(config) {
    this.transformStatusEvent = this.transformStatusEvent.bind(this);
  }

  async initialize({ context }) {
    this.context = context;
  }

  transformStatusEvent(statusEvent) {
    return {
      id: this.context.utils.generateId("StatusEvent", statusEvent.uuid),
      ...statusEvent,
    };
  }
}

module.exports = StatusEvent;
