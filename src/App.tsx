import React from "react";
import { HashRouter, Route } from "react-router-dom";
import IndexPage from "./pages/index";
import ReaderPage from "./pages/reader";

const App: React.FC = () => {
  return (
    <HashRouter>
      <Route exact path="/" component={IndexPage} />
      <Route component={ReaderPage} path="/reader" />
    </HashRouter>
  );
};

export default App;
