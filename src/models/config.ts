export default {
  namespace: 'config',
  state: {
    document: null
  },
  reducers: {
    updateDocumentPath(state: any, { payload: { document } }: { payload: { document: string } }) {
      return { ...state, document };
    }
  }
}