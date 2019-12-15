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

const ipc = window.require("electron").ipcRenderer;

const BACKGROUND: { [key: string]: string } = {
  BLACK: "rgb(39, 40, 34)",
  WHITE: "rgb(255, 255, 255)"
};

const COLOR: { [key: string]: string } = {
  GRAY: "#aaa",
  BLACK: "#rgb(10, 10, 10)"
};

const SETTINGS: ReaderSettings = {
  color: "BLACK",
  size: 14,
  background: "WHITE"
};

const Reader: React.FC<Props> = props => {
  const [toolDown, setToolDown] = useState(false);
  const [content, setContent] = useState("");
  const [currentCatalog, setCurrentCatalog] = useState(0);
  const [settings, setSettings] = useState<ReaderSettings>(SETTINGS);
  const [style, setStyle] = useState<any>({});
  const contentRef = useRef<any>(null);

  useEffect(() => {
    function getKeyboard(e: any, key: string) {
      if (key === "down") {
        contentRef.current.scrollTop += contentRef.current.clientHeight - 16;
      } else if (key === "up") {
        contentRef.current.scrollTop -= contentRef.current.clientHeight + 16;
      } else if (key === "left") {
        prevCapter();
      } else if (key === "right") {
        nextCapter();
      }
    }
    ipc.on("keyboard", getKeyboard);
    return () => {
      ipc.removeListener("keyboard", getKeyboard);
    };
  });

  useEffect(() => {
    if (!props.currentBook || props.catalog.length === 0) return;

    let offset =
      props.currentBook.current < props.catalog[0].offset
        ? props.catalog[0].offset
        : props.currentBook.current;
    for (let i = 0; i < props.catalog.length; i++) {
      if (offset >= props.catalog[i].offset) {
        let end =
          i < props.catalog.length - 1
            ? props.catalog[i + 1].offset
            : props.content.length;
        if (offset < end) {
          setCurrentCatalog(i);
          setContent(props.content.substring(offset, end));
          break;
        }
      }
    }
  }, [props.content, props.catalog, props.currentBook]);

  useEffect(() => {
    setStyle({
      color: COLOR[settings.color] || settings.color,
      background: BACKGROUND[settings.background] || settings.background,
      fontSize: settings.size
    });
  }, [settings]);

  useEffect(() => {
    window.onresize = () => {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
    };
    contentRef.current.onmousewheel = (e: any) => {
      if (e.deltaY > 0) {
        setToolDown(false);
      } else if (e.deltaY < 0) {
        setToolDown(true);
      }
    };
  }, []);

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
    contentRef.current.scrollTop = 0;
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
    contentRef.current.scrollTop = 0;
  }

  return (
    <div className="reader-page" style={style}>
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
      <div className="reader-setting-btn">A</div>
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
