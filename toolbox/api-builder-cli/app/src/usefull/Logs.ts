export default class Logs {
  private terminal: Function;

  constructor(terminal: Function = console.log) {
    this.terminal = terminal;
  }

  public title(...args: Array<unknown>) {
    this.terminal(...args);
  }

  public info(...args: Array<unknown>) {
    this.terminal(...args);
  }
}
