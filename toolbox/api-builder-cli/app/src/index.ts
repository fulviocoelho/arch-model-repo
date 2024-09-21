import App from './handlers/App';
import Files from './usefull/Files';

// const dir_path = __dirname.substring(0, __dirname.length-32) // para teste
const dir_path = __dirname.substring(0, __dirname.length-28) // para build

const files = new Files(dir_path);
let config: any;

try {
  config = files.readFile('config', '');
} catch {
  config = { projects_path: dir_path };
  files.createFile('config', config, '');
}

const app = new App(config.projects_path, dir_path);
app.start();
