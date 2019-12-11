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
    currentBook: '0'
  },
  reducers: {
    update(state: any, { payload: books }: { payload: { books: any } }) {
      return { ...state, books };
    }
  }
}