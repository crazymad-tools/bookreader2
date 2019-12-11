import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import path from "path";
import { remote } from "electron";
const fs = window.require("fs");

interface Props {
  document: string;
}

const ReaderPage: React.FC<Props> = props => {
  useEffect(() => {
    console.log('document:', props.document);
  }, [props.document]);

  useEffect(() => {
    // console.log(
    //   path.resolve(__dirname, "github/bookreader2"),
    //   fs.readdirSync(path.resolve(__dirname, "github/bookreader2"))
    // );
  }, []);
  return (
    <div>
      <Link to="/">index</Link>
    </div>
  );
};

export default connect(
  (state: any) => {
    return {
      document: state.config.document
    };
  },
  (dispatch: Function) => {
    return {
      dispatch
    };
  }
)(ReaderPage);
