import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./models";
import App from "./App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

const ipc = window.require("electron").ipcRenderer;
ipc.send("init");
ipc.on("init", (e: any, args: any) => {
  console.log(args);
  args = JSON.parse(args);
  store.dispatch({
    type: "config/updateDocumentPath",
    payload: {
      document: args.document
    }
  });
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root")
  );
});

// if you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
