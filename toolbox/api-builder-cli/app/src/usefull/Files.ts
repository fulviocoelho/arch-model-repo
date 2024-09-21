import fs from 'fs';
import path from 'path';

export default class Files {
  private filesystem: typeof fs;
  private util_path: typeof path;
  private app_dir: string;

  constructor(app_dir: string, filesystem: typeof fs = fs, util_path: typeof path = path) {
    this.filesystem = filesystem;
    this.util_path = util_path;
    this.app_dir = app_dir;
  }

  public mkdir(name: string, path: string = this.app_dir) {
    this.filesystem.mkdirSync(`${path}${name}`);
  }

  public validateOutFolder(caminhoProjetoAtual, outputPasta) {
    const caminhoPasta = path.join(caminhoProjetoAtual, outputPasta);
    function pastaExiste(caminhoPasta: string): boolean {
      try {
        fs.accessSync(caminhoPasta, fs.constants.F_OK);
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    }    
  }

  public readDir(path: string) {
    let files;
    try {
      files = this.filesystem.readdirSync(this.getPath(path));
    } catch (err) {
      this.mkdir(`/${path}`);
      files = this.filesystem.readdirSync(this.getPath(path));
    }
    let result = [];
    for (const file of files) {
      try {
        if(file.split('.')[1] !== 'ini'){
          result.push(file.split('.')[0]);
        }
      } catch {
        result.push(file);
      }
    }
    return result;
  }

  public getPath(path: string) {
    return this.util_path.join(this.app_dir, path);
  }

  public createFile(name: string, content: object, path: string, ext: string = '.json') {
    return this.filesystem.writeFileSync(`${this.app_dir}/${path}${name}${ext}`, JSON.stringify(content));
  }

  public updateFile(name: string, content: object, path: string, ext: string = '.json') {
    return this.filesystem.writeFileSync(`${this.app_dir}/${path}${name}${ext}`, JSON.stringify(content));
  }

  public readFile(name: string, path: string, ext: string = '.json') {
    return JSON.parse(this.filesystem.readFileSync(`${this.app_dir}/${path}${name}${ext}`, { encoding: 'utf8' }));
  }

  public updateRootDir(dir: string) {
    this.app_dir = dir;
  }
}
