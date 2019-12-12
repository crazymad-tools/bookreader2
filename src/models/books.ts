import ConfigService from '../service/ConfigService';

export default {
  namespace: 'books',
  state: {
    books: [
      // {
      //   name: '大医凌然',
      //   id: '0',
      //   remote: false,
      //   path: '',
      //   current: 0,
      // },
      // {
      //   name: '临高启明',
      //   id: '1',
      //   remote: false,
      //   path: '',
      //   current: 0,
      // }
    ],
    currentBook: null,
    catalog: [],
  },
  reducers: {
    update(state: any, { payload: { books } }: { payload: { books: any } }) {
      return { ...state, books }
    },
    setCurrentBook(state: any, { payload: { currentBook } }: { payload: { currentBook: Book } }) {
      return { ...state, currentBook }
    },
    updateReader(state: any, { payload: { content, catalog } }: { payload: { content: string, catalog: Catalog[] } }) {
      return { ...state, catalog, content }
    },
    updateCurrent(state: any, { payload: { current } }: { payload: { current: number } }, total: any) {
      state.currentBook.current = current;
      ConfigService.saveBooks(total.config.document, total);
      return { ...state, currentBook: state.currentBook };
    }
  }
}