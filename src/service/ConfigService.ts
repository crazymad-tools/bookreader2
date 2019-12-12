const path = window.require('path');
const fs = window.require("fs");

export default class ConfigService {

  /**
   * 加载配置
   * @param document 
   * @param store 
   */
  static loadBooks(document: string, store: any) {
    let folderPath: string = path.resolve(document, 'bookreader').replace(/\\/g, '/');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    let filePath: string = path.resolve(folderPath, 'books.json');
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '\ufeff[]', 'utf-8');
    } else {
      let data = fs.readFileSync(filePath, 'utf-8').replace('\ufeff', '');
      data = JSON.parse(data);
      store.dispatch({
        type: 'books/update',
        payload: {
          books: data
        }
      });
    }
  }

  /**
   * 保存配置
   * @param document 
   * @param store 
   */
  static saveBooks(document: string, store: any) {
    let folderPath: string = path.resolve(document, 'bookreader').replace(/\\/g, '/');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    let filePath: string = path.resolve(folderPath, 'books.json');
    fs.writeFileSync(filePath, `\ufeff${JSON.stringify(store.books.books)}`, 'utf-8');
  }

}