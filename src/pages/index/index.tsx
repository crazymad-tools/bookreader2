import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { Button } from "../common";
import "./index.scss";
import ConfigService from "../../service/ConfigService";
import store from "../../models";

const { dialog } = window.require("electron").remote;

interface Props extends RouteComponentProps {
  dispatch: Function;
  document: string;
  books: Book[];
}

const IndexPage: React.FC<Props> = props => {
  function toReader(book: Book) {
    props.dispatch({
      type: "books/setCurrentBook",
      payload: {
        currentBook: book
      }
    });
    props.history.push("/book");
  }

  function importBook() {
    let res = dialog.showOpenDialogSync({
      filters: [
        {
          name: "Book",
          extensions: ["txt"]
        }
      ],
      properties: ["openFile"]
    });
    if (res) {
      ConfigService.importBook(res[0], props.document, store);
    }
  }

  return (
    <div className="index-page">
      <Button onClick={importBook}>导入</Button>
      <Link to="/settings">
        <Button>设置</Button>
      </Link>
      <ul className="book-list">
        {props.books.map((book: Book, index: number) => (
          <li
            // className="book-item"
            key={index}
            onClick={toReader.bind(null, book)}
          >
            <span className="book-item">{book.name}</span>
            {/* <a>编辑</a> <a>删除</a> */}
            <Button size="small">编辑</Button>
            <Button size="small">删除</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default withRouter(
  connect(
    (state: any) => {
      return {
        books: state.books.books,
        document: state.config.document
      };
    },
    (dispatch, props: Props) => {
      props.dispatch = dispatch;
      return {};
    }
  )(IndexPage)
);
