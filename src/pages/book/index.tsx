import React, { useEffect, useState } from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "../common";
import "./index.scss";
import books from "../../models/books";
import iconv from 'iconv-lite';

const fs = window.require("fs");
const path = window.require("path");
// const iconv = window.require("iconv-lite");

interface Props extends RouteComponentProps {
  document: string;
  currentBook: Book;
  catalog: Catalog[];
  dispatch: Function;
}

const BookPage: React.FC<Props> = props => {
  useEffect(() => {
    // console.log(props.currentBook);
    if (props.currentBook) {
      let filename = path.resolve(
        props.document,
        `bookreader/books/${props.currentBook.id}.txt`
      );
      let data = fs.readFileSync(filename);
      data = iconv.decode(data, "gbk");

      let matchs = data.matchAll(
        /(?<=(^|[\r\n]+))第[0-9壹贰叁肆肆陆柒捌玖拾佰仟一二三四五六七八九十零白千〇]+((章)|(话)|(节)).*(?=[\r\n]+)/g
      );
      let catalog: Catalog[] = [];
      for (const match of matchs) {
        catalog.push({
          name: match[0],
          offset: match.index
        });
      }
      if (catalog[0].offset > 0) {
          catalog = [{
              name: '未知',
                offset: 0,
          }].concat(catalog);
      }

      props.dispatch({
        type: "books/updateReader",
        payload: {
          catalog: catalog,
          content: data
        }
      });
    }
  }, [props.currentBook]);

  function toRead(catalog: Catalog) {
    props.dispatch({
      type: "books/updateCurrent",
      payload: {
        current: catalog.offset
      }
    });
    props.history.push("/reader");
  }

  return (
    <div>
      <Link to="/">
        <Button>返回书架</Button>
      </Link>
      <Link to="/reader">
        <Button>继续阅读</Button>
      </Link>
      <h2>{props.currentBook && props.currentBook.name}</h2>
      <ul className="catalog-list">
        {props.catalog.map((item: Catalog, index: number) => (
          <li key={index} onClick={toRead.bind(null, item)}>
            {item.name}
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
        document: state.config.document,
        currentBook: state.books.currentBook,
        catalog: state.books.catalog
      };
    },
    (dispatch: Function) => {
      return {
        dispatch
      };
    }
  )(BookPage)
);
