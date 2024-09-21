import clear from 'clear';
import figlet from 'figlet';
import inquirer from 'inquirer';
import Logs from '../usefull/Logs';

export default class TUI {
  private cls: typeof clear;
  private logs: Logs;
  private ascii_art: typeof figlet;
  private question_cli: typeof inquirer;

  constructor(
    ascii_art: typeof figlet = figlet,
    cls: typeof clear = clear,
    question_cli: typeof inquirer = inquirer,
    logs: Logs = new Logs(),
  ) {
    this.cls = cls;
    this.logs = logs;
    this.ascii_art = ascii_art;
    this.question_cli = question_cli;
  }

  public async title(title: string) {
    this.logs.title(this.ascii_art.textSync(title));
  }

  public async print(...args: Array<unknown>) {
    this.logs.info(...args);
  }

  public clearScreen() {
    this.cls();
  }

  public async question(questions: inquirer.QuestionCollection) {
    return await this.question_cli.prompt(questions);
  }
}
