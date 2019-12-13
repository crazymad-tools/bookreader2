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

  static importBook(filepath: string, document: string, store: any) {
    let id = new Date().getTime();
    let originName: any = filepath.match(/[^\\\/]+(?=\.txt)/);
    originName = originName ? originName[0] : id;
    let destPath: string = path.resolve(document, `bookreader/books/${id}.txt`).replace(/\\/g, '/');
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

}