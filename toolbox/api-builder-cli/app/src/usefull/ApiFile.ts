export default class ApiFile {
  constructor() {
    this.makeUrl = this.makeUrl.bind(this);
    this.readUrls = this.readUrls.bind(this);
    this.getUrlData = this.getUrlData.bind(this);
  }
  public async readUrls(e: any, callback: Function, current_path: string = '', fn: Function = this.readUrls) {
    if (Array.isArray(e)) {
      for (const end of e) {
        callback(this.makeUrl(current_path, end.path));
        if (end.endpoints) {
          fn(end.endpoints, callback, this.makeUrl(current_path, end.path));
        }
      }
    } else {
    }
  }

  private makeUrl(start: string, end: string) {
    return start ? `${start}/${end}` : `${end}`;
  }

  public async getUrlData(z: string, e: any, callback: Function, now_url: string = '', fn: Function = this.getUrlData) {
    if (Array.isArray(e)) {
      for (const end of e) {
        if (z.indexOf(end.path) === -1) {
          continue;
        } else if (z !== this.makeUrl(now_url, end.path)) {
          if (end.endpoints) {
            await fn(z, end.endpoints, callback, this.makeUrl(now_url, end.path));
          }
        } else {
          callback(end);
        }
      }
    } else {
    }
  }
}
