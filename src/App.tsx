import React from "react";
import { HashRouter, Route } from "react-router-dom";
import IndexPage from "./pages/index";
import BookPage from "./pages/book";
import ReaderPage from "./pages/reader";
import SettingsPage from "./pages/settings";

const App: React.FC = () => {
  return (
    <HashRouter>
      <Route exact path="/" component={IndexPage} />
      <Route component={BookPage} path="/book" />
      <Route component={ReaderPage} path="/reader" />
      <Route component={SettingsPage} path="/settings" />
    </HashRouter>
  );
};

export default App;
