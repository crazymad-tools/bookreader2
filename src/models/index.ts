import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
const files = require.context('./', false, /\.ts$/);

const reducers: { [key: string]: any } = {};

const state: { [key: string]: any } = {};

files.keys().forEach(key => {
  if (key === 'index' || !files(key).default) return;

  let module = files(key).default;
  reducers[module.namespace] = module.reducers;
  state[module.namespace] = module.state;
});

interface Action {
  type: string;
  payload: any;
}

const store = createStore((state: any, action: Action) => {
  let keys = action.type.split('/');
  let namespace: string = keys.length === 2 ? keys[0] : '';
  let reducer: string = keys.length === 2 ? keys[1] : '';
  if (keys.length === 2 && reducers[namespace] && reducers[namespace][reducer]) {
    let namespaceState: any = reducers[namespace][reducer](state[namespace], action, state);
    state[namespace] = namespaceState;
    return { ...state };
  } else {
    return state;
  }
}, state, applyMiddleware(thunk));

export default store;
