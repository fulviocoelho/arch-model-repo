import TUI from '../TUI/TUI';
import ApiFile from '../usefull/ApiFile';
import Files from '../usefull/Files';

export default class App {
  private app_dir: string;
  private tui: TUI;
  private apis: ApiFile;
  private files: Files;
  private project: string | undefined;
  private api_set: any;
  private app_name: string;
  private alert_record_error: boolean = false;
  private project_folder: string = "API-Projects";

  constructor(
    dir: string,
    app_dir: string,
    app_name: string = 'API Builder CLI',
    tui: TUI = new TUI(),
    files: Files = new Files(dir),
    apis: ApiFile = new ApiFile(),
  ) {
    this.app_dir = app_dir;
    this.tui = tui;
    this.apis = apis;
    this.files = files;
    this.app_name = app_name;
  }

  public async start() {
    await this.mainMenu();
  }

  private cleanScreen() {
    this.tui.clearScreen();
    this.tui.title(this.app_name);
    if(this.alert_record_error){
      this.tui.print('ALERT: You are not able to update the file correspondint to this operation!!!');
    }
  }

  private async mainMenu() {
    this.cleanScreen();
    const { action } = await this.tui.question([
      {
        type: 'list',
        name: 'action',
        message: 'Chose a option:',
        choices: ['projects', 'exit'],
        // choices: ['projects', 'configs', 'exit'],
        default: 'projects',
      },
    ]);
    switch (action) {
      case 'projects':
        return this.projectsMenu();
      case 'configs':
        return await this.appConfigs();
      default:
        return;
    }
  }

  private async appConfigs(files: Files = new Files(this.app_dir)) {
    const old_path = await files.readFile('config', '');

    this.cleanScreen();
    const { path } = await this.tui.question([
      {
        type: 'input',
        name: 'path',
        default: old_path.projects_path,
        message: 'Set your projects folder path:',
      },
    ]);
    await files.updateFile('config', { projects_path: path }, '');
    await this.files.updateRootDir(path);
    try{
      await this.files.mkdir(`/${this.project_folder}`);
    }catch{}

    this.mainMenu();
  }

  private async projectsMenu() {
    this.cleanScreen();
    const files = this.files.readDir(this.project_folder);
    const { projects } = await this.tui.question([
      {
        type: 'list',
        name: 'projects',
        message: 'Chose a project:',
        choices: ['new project', ...files, 'go back'],
        default: 'new project',
      },
    ]);
    switch (projects) {
      case 'new project':
        return this.createNewProject();
      case 'go back':
        return this.mainMenu();
      default:
        this.project = projects;
        return this.projectMenu();
    }
  }

  private async createNewProject() {
    this.cleanScreen();
    const { project } = await this.tui.question([
      {
        type: 'input',
        name: 'project',
        message: 'Name your new project:',
      },
    ]);
    this.files.mkdir(`/${this.project_folder}/${project}`);
    this.project = project;
    return this.projectMenu();
  }

  private async projectMenu(): Promise<void> {
    this.cleanScreen();
    const files = this.files.readDir(`${this.project_folder}/${this.project}`);
    const { api_set } = await this.tui.question([
      {
        type: 'list',
        name: 'api_set',
        message: 'Chose a API set:',
        choices: ['new api set', ...files, 'go back'],
        default: 'new api set',
      },
    ]);
    switch (api_set) {
      case 'new api set':
        return this.createApiSet();
      case 'go back':
        return this.projectsMenu();
      default:
        this.api_set = this.files.readFile(api_set, `/${this.project_folder}/${this.project}/`);
        return this.apiMenu();
    }
  }
  public async createApiSet() {
    this.cleanScreen();
    const api_set = await this.tui.question([
      {
        type: 'input',
        name: 'name',
        message: 'API Set Name:',
      },
      {
        type: 'input',
        name: 'desc',
        message: 'API Set Description:',
      },
      {
        type: 'input',
        name: 'url',
        message: 'Chose the Base Url:',
      },
    ]);
    const { name, desc, url } = api_set;
    const new_api_set = { name, desc, endpoints: [{ path: url }] };
    await this.createRecord(name, new_api_set, `/${this.project_folder}/${this.project}/`)
    this.api_set = new_api_set;
    return this.apiMenu();
  }
  private async createRecord(name: string, content: any, path: string) {
    try{
      await this.files.createFile(name, content, path);
      this.alert_record_error = false;
    }catch{
      this.alert_record_error = true;
    }
  }
  public async apiMenu() {
    this.cleanScreen();
    this.tui.print('API Set:', this.api_set.name);
    this.tui.print('Description:', this.api_set.desc);
    let endpoints = [];
    try {
      await this.apis.readUrls(this.api_set.endpoints, (val: string) => {
        endpoints.push(val);
      });
    } catch {}
    const { endpoint } = await this.tui.question([
      {
        type: 'list',
        name: 'endpoint',
        message: 'Chose a endpoint:',
        choices: [...endpoints, 'delete endpoint', 'go back'],
        default: 'go back',
      },
    ]);
    switch (endpoint) {
      case 'go back':
        return this.projectMenu();
      case 'delete endpoint':
        return this.deleteEndpoint();
      default:
        return this.endpointMenu(endpoint);
    }
  }
  public async deleteEndpoint() {
    this.cleanScreen();
    this.tui.print('API Set:', this.api_set.name);
    this.tui.print('Description:', this.api_set.desc);
    let endpoints = [];
    try {
      await this.apis.readUrls(this.api_set.endpoints, (val: string) => {
        endpoints.push(val);
      });
    } catch {}
    const { endpoint } = await this.tui.question([
      {
        type: 'list',
        name: 'endpoint',
        message: 'Chose a endpoint to delete:',
        choices: [...endpoints, 'go back'],
        default: 'go back',
      },
    ]);
    switch (endpoint) {
      case 'go back':
        return this.apiMenu();
      default:
        {
          const a: string = endpoint;

          let b: string = a;
          let index: number = 0;

          do {
            index = b.indexOf('/');
            b = b.substring(index + 1, b.length);
          } while (index > -1);

          const api = a.substring(0, a.indexOf(b) - 1);

          await this.apis.getUrlData(api, this.api_set.endpoints, (end: any) => {
            end.endpoints = end.endpoints.filter((e) => e.path !== b);
          });
        }
        await this.updateRecord();
        this.apiMenu();
    }
  }
  public async createEndpoint(endpoint: string) {
    this.cleanScreen();
    const { path } = await this.tui.question([
      {
        type: 'input',
        name: 'path',
        message: 'Add to endpoint:',
      },
    ]);
    await this.apis.getUrlData(endpoint, this.api_set.endpoints, (end: any) => {
      if (end.endpoints) {
        end.endpoints.push({ path });
      } else {
        end['endpoints'] = [{ path }];
      }
    });
    await this.updateRecord();
    return this.apiMenu();
  }
  public async endpointMenu(endpoint: string) {
    this.cleanScreen();
    this.tui.print('API Set:', this.api_set.name);
    this.tui.print('Description:', this.api_set.desc);
    this.tui.print('Endpoint:', endpoint);
    let methods = [];
    try {
      await this.apis.getUrlData(endpoint, this.api_set.endpoints, (end: any) => {
        end.methods.filter((e) => methods.push(e.method));
      });
    } catch {}
    const { action } = await this.tui.question([
      {
        type: 'list',
        name: 'action',
        message: 'Chose a action:',
        choices: ['create child endpoint', 'edit endpoint', 'new method', ...methods, 'delete method', 'go back'],
        default: 'new endpoint',
      },
    ]);
    switch (action) {
      case 'create child endpoint':
        return this.createEndpoint(endpoint);
      case 'edit endpoint':
        return this.editEndpoint(endpoint);
      case 'new method':
        return this.createMethod(endpoint);
      case 'delete method':
        return this.selectMethodToDelete(endpoint);
      case 'go back':
        return this.apiMenu();
      default:
        return this.methodsDetailes(endpoint, action);
    }
  }
  public async editEndpoint(endpoint: string) {
    let endpoint_data;
    await this.apis.getUrlData(endpoint, this.api_set.endpoints, (end: any) => {
      endpoint_data = end;
    });

    this.cleanScreen();
    this.tui.print('API Set:', this.api_set.name);
    this.tui.print('Description:', this.api_set.desc);
    this.tui.print('Endpoint:', endpoint);
    const { new_endpoint } = await this.tui.question([
      {
        type: 'input',
        name: 'new_endpoint',
        default: endpoint_data.path,
        message: 'Change endpoint:',
      },
    ]);
    await this.apis.getUrlData(endpoint, this.api_set.endpoints, (end: any) => {
      end.path = new_endpoint;
    });
    await this.updateRecord();
    return this.apiMenu();
  }
  public async methodsDetailes(endpoint: string, action: string) {
    let detailes;
    await this.apis.getUrlData(endpoint, this.api_set.endpoints, (end: any) => {
      detailes = end.methods.filter((e) => e.method === action);
    });

    this.cleanScreen();
    this.tui.print('API Set:', this.api_set.name);
    this.tui.print('Description:', this.api_set.desc);
    this.tui.print('Endpoint:', endpoint);
    this.tui.print('Method:', detailes[0].method);
    this.tui.print('Description:', detailes[0].desc);
    const { method_action } = await this.tui.question([
      {
        type: 'list',
        name: 'method_action',
        message: 'Chose a Method:',
        choices: ['edit', 'go back'],
        default: 'go back',
      },
    ]);
    switch (method_action) {
      case 'edit':
        return this.editMethod(endpoint, action);
      default:
        return this.endpointMenu(endpoint);
    }
  }
  public async editMethod(endpoint: string, action: string) {
    let detailes;
    await this.apis.getUrlData(endpoint, this.api_set.endpoints, (end: any) => {
      detailes = end.methods.filter((e) => e.method === action);
    });

    this.cleanScreen();
    this.tui.print('API Set:', this.api_set.name);
    this.tui.print('Description:', this.api_set.desc);
    this.tui.print('Endpoint:', endpoint);
    this.tui.print('Method:', detailes[0].method);
    let methods = [];
    await this.apis.getUrlData(endpoint, this.api_set.endpoints, (end: any) => {
      end.methods.filter((e) => methods.push(e.method));
    });
    const { desc } = await this.tui.question([
      {
        type: 'input',
        name: 'desc',
        default: detailes[0].desc,
        message: 'Method Description:',
      },
    ]);
    await this.apis.getUrlData(endpoint, this.api_set.endpoints, (end: any) => {
      let method = end.methods.filter((e) => e.method === action);
      method[0].desc = desc;
    });
    await this.updateRecord();
    return this.methodsDetailes(endpoint, action);
  }
  public async selectMethodToDelete(endpoint: string) {
    this.cleanScreen();
    this.tui.print('API Set:', this.api_set.name);
    this.tui.print('Description:', this.api_set.desc);
    this.tui.print('Endpoint:', endpoint);
    let methods = [];
    await this.apis.getUrlData(endpoint, this.api_set.endpoints, (end: any) => {
      end.methods.filter((e) => methods.push(e.method));
    });
    const { action } = await this.tui.question([
      {
        type: 'list',
        name: 'action',
        message: 'Chose a method to delete:',
        choices: [...methods, 'go back'],
        default: 'new endpoint',
      },
    ]);
    switch (action) {
      case 'go back':
        return this.apiMenu();
      default: {
        await this.apis.getUrlData(endpoint, this.api_set.endpoints, (end: any) => {
          end.methods = end.methods.filter((e) => e.method !== action);
        });
        await this.updateRecord();
        return this.endpointMenu(endpoint);
      }
    }
  }
  public async createMethod(endpoint: string) {
    this.cleanScreen();
    this.tui.print('API Set:', this.api_set.name);
    this.tui.print('Description:', this.api_set.desc);
    this.tui.print('Endpoint:', endpoint);
    const { method, desc } = await this.tui.question([
      {
        type: 'input',
        name: 'method',
        message: 'Method:',
      },
      {
        type: 'input',
        name: 'desc',
        message: 'Description:',
      },
    ]);
    await this.apis.getUrlData(endpoint, this.api_set.endpoints, (end: any) => {
      if (end.methods) {
        end.methods.push({ method: method.toUpperCase(), desc });
      } else {
        end['methods'] = [{ method: method.toUpperCase(), desc }];
      }
    });
    await this.updateRecord();
    this.endpointMenu(endpoint);
  }

  private async updateRecord() {
    try{
      await this.files.updateFile(this.api_set.name, this.api_set, `/${this.project_folder}/${this.project}/`);
      this.alert_record_error = false;
    }catch{
      this.alert_record_error = true;
    }
  }
}
