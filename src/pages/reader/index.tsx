import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { Button } from "../common";
import { Link } from "react-router-dom";
import "./index.scss";

interface Props {
  dispatch: Function;
  currentBook: Book;
  content: string;
  catalog: Catalog[];
}

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

const Reader: React.FC<Props> = props => {
  const [toolDown, setToolDown] = useState(false);
  const [content, setContent] = useState("");
  const [currentCatalog, setCurrentCatalog] = useState(0);
  const contentRef = useRef<any>(null);

  useEffect(() => {
    if (!props.currentBook || props.catalog.length === 0) return;

    let offset =
      props.currentBook.current < props.catalog[0].offset
        ? props.catalog[0].offset
        : props.currentBook.current;
    console.log(offset);
    for (let i = 0; i < props.catalog.length; i++) {
      console.log(offset, props.catalog[i].offset);
      if (offset >= props.catalog[i].offset) {
        let end =
          i < props.catalog.length - 1
            ? props.catalog[i + 1].offset
            : props.content.length;
        console.log(end);
        if (offset < end) {
          setCurrentCatalog(i);
          setContent(props.content.substring(offset, end));
          break;
        }
      }
    }
  }, [props.content, props.catalog, props.currentBook]);

  useEffect(() => {
    window.onresize = () => {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
    };
    contentRef.current.onmousewheel = (e: any) => {
      // console.log(e);
      if (e.deltaY > 0) {
        setToolDown(false);
      } else if (e.deltaY < 0) {
        setToolDown(true);
      }
    }
  }, []);

  function createPage() {}

  function prevCapter() {
    if (currentCatalog === 0) return;

    props.dispatch({
      type: "books/updateCurrent",
      payload: {
        current: props.catalog[currentCatalog - 1].offset
      }
    });
    setContent(
      props.content.substring(
        props.catalog[currentCatalog - 1].offset,
        props.catalog[currentCatalog].offset
      )
    );
    setCurrentCatalog(currentCatalog - 1);
  }

  function nextCapter() {
    if (currentCatalog === props.catalog.length - 1) return;

    let end =
      currentCatalog + 2 === props.catalog.length - 1
        ? props.content.length
        : props.catalog[currentCatalog + 2].offset;
    props.dispatch({
      type: "books/updateCurrent",
      payload: {
        current: props.catalog[currentCatalog + 1].offset
      }
    });
    setCurrentCatalog(currentCatalog + 1);
    setContent(
      props.content.substring(props.catalog[currentCatalog + 1].offset, end)
    );
  }

  return (
    <div className="reader-page">
      <div className={`reader-tool-bar${toolDown ? " down" : ""}`}>
        <Button onClick={prevCapter}>上一章</Button>
        <Link to="/book">
          <Button>返回目录</Button>
        </Link>
        <Button onClick={nextCapter}>下一章</Button>
      </div>
      <div className="pre-content" ref={contentRef}>
        <pre>{content}</pre>
      </div>
    </div>
  );
};

export default connect(
  (state: any) => {
    return {
      catalog: state.books.catalog,
      content: state.books.content,
      currentBook: state.books.currentBook
    };
  },
  (dispatch: Function) => {
    return {
      dispatch
    };
  }
)(Reader);
