import ConfigService from "../service/ConfigService";

const SETTINGS: ReaderSettings = {
  color: "GRAY",
  size: 14,
  background: "BLACK",
  font: '默认'
};

export default {
  namespace: "reader",
  state: {
    settings: SETTINGS
  },
  reducers: {
    setSettings(
      state: any,
      {
        payload: { settings, save = true }
      }: { payload: { settings: ReaderSettings; save?: boolean } },
      total: any
    ) {
      if (save) {
        state.settings = settings;
        ConfigService.saveReaderSettings(total.config.document, total);
      }
      return { ...state, settings };
    }
  }
};
