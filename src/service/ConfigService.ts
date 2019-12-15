const path = window.require('path');
const fs = window.require("fs");

export default class ConfigService {

  static init (document: string, store: any) {
    let folderPath: string = path.resolve(document, 'bookreader').replace(/\\/g, '/');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    this.loadBooks(folderPath, store);
    this.loadReaderSettings(folderPath, store);
  }

  /**
   * 加载配置
   * @param document 
   * @param store 
   */
  static loadBooks(folderPath: string, store: any) {
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
   * 保存书籍配置
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

  /**
   * 导入书籍
   * @param filepath 
   * @param document 
   * @param store 
   */
  static importBook(filepath: string, document: string, store: any) {
    let id = new Date().getTime();
    let originName: any = filepath.match(/[^\\\/]+(?=\.txt)/);
    let folderPath: string = path.resolve(document, `bookreader/books`).replace(/\\/g, '/');
    originName = originName ? originName[0] : id;
    if (!fs.existsSync(folderPath)) {
      fs.writeFileSync(folderPath, '\ufeff[]', 'utf-8');
    }
    let destPath: string = path.resolve(document, `${folderPath}/${id}.txt`).replace(/\\/g, '/');
    fs.createReadStream(filepath).pipe(fs.createWriteStream(destPath));
    let newBook: Book = {
      name: originName,
      origin: originName + '.txt',
      id: `${id}`,
      remote: false,
      current: 0,
    }

    let books = store.getState().books.books.concat([newBook]);

    store.dispatch({
      type: 'books/update',
      payload: {
        books: books
      }
    });

    let configPath: string = path.resolve(document, 'bookreader/books.json').replace(/\\/g, '/')
    fs.writeFileSync(configPath, `\ufeff${JSON.stringify(books)}`, 'utf-8');
  }

  /**
   * 读取阅读页配置
   * @param document 
   * @param store 
   */
  static loadReaderSettings(folderPath: string, store: any) {
    let filePath: string = path.resolve(folderPath, 'reader-settings.json');
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, `\ufeff${JSON.stringify(store.getState().reader.settings)}`, 'utf-8');
    } else {
      let data = fs.readFileSync(filePath, 'utf-8').replace('\ufeff', '');
      data = JSON.parse(data);
      store.dispatch({
        type: 'reader/setSettings',
        payload: {
          settings: data,
          save: false
        }
      });
    }
  }

  /**
   * 保存阅读页配置
   * @param document 
   * @param store 
   */
  static saveReaderSettings(document: string, store: any) {
    let folderPath: string = path.resolve(document, 'bookreader').replace(/\\/g, '/');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    let filePath: string = path.resolve(folderPath, 'reader-settings.json');
    fs.writeFileSync(filePath, `\ufeff${JSON.stringify(store.reader.settings)}`, 'utf-8');
  }

}