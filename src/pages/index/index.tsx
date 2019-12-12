import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";

import "./index.scss";

interface Props extends RouteComponentProps {
  dispatch: Function;
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

  return (
    <div className="index-page">
      <ul className="book-list">
        {props.books.map((book: Book, index: number) => (
          <li
            className="book-item"
            key={index}
            onClick={toReader.bind(null, book)}
          >
            {book.name}
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
        books: state.books.books
      };
    },
    (dispatch, props: Props) => {
      props.dispatch = dispatch;
      return {};
    }
  )(IndexPage)
);
