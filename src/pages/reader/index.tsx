import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { Button, Dropdown } from "../common";
import { Link } from "react-router-dom";
import "./index.scss";

interface Props {
  dispatch: Function;
  currentBook: Book;
  content: string;
  catalog: Catalog[];
  settings: ReaderSettings;
}

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

const ipc = window.require("electron").ipcRenderer;

const FONTS: { [key: string]: string } = {
  默认: "Arial",
  微软雅黑: "微软雅黑",
  楷体: "楷体"
};

const BACKGROUND: { [key: string]: string } = {
  BLACK: "rgb(39, 40, 34)",
  WHITE: "rgb(255, 255, 255)",
  GREEN: "rgb(220, 255, 220)",
  YELLOW: "rgb(255, 255, 220)"
};

const BACKGROUND_IMAGE: { [key: string]: string } = {
  YELLOW_PAPER: 'url("/reader/yellow-paper.jpg")',
  WOOD_PAPER: 'url("/reader/wood-paper.jpg")'
};

const COLOR: { [key: string]: string } = {
  GRAY: "#aaa",
  BLACK: "rgb(39, 40, 34)",
  GREEN: "rgb(0, 100, 50)",
  YELLOW: "rgb(100, 110, 50)"
};

const THEMES = [
  ["BLACK", "GRAY", "夜晚"],
  ["WHITE", "BLACK", "普通"],
  ["GREEN", "GREEN", "翠绿"],
  ["YELLOW", "YELLOW", "护眼"],
  ["WOOD_PAPER", "BLACK", "木质"],
  ["YELLOW_PAPER", "BLACK", "羊皮卷"]
];

const Reader: React.FC<Props> = props => {
  const [toolDown, setToolDown] = useState(false);
  const [settingsUp, setSettingsUp] = useState(false);
  const [content, setContent] = useState("");
  const [currentCatalog, setCurrentCatalog] = useState(0);
  const [style, setStyle] = useState<any>({ backgroundSize: "100% 100%" });
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
    let settings = props.settings;
    setStyle({
      color: COLOR[settings.color] || settings.color,
      backgroundColor: BACKGROUND[settings.background] || "",
      backgroundImage: BACKGROUND_IMAGE[settings.background] || "",
      fontSize: settings.size,
      fontFamily: FONTS[settings.font] || FONTS["默认"]
    });
  }, [props.settings]);

  useEffect(() => {
    window.onresize = () => {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
    };
    contentRef.current.onmousewheel = (e: any) => {
      let scrollTop = contentRef.current.scrollTop + e.deltaY;
      if (scrollTop <= 0) {
        setToolDown(true);
      } else if (
        scrollTop + contentRef.current.clientHeight >=
        contentRef.current.scrollHeight
      ) {
        setToolDown(true);
      } else if (e.deltaY > 0) {
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

  function changeFontSize(plus: boolean) {
    let settings = props.settings;
    if (plus) {
      settings.size++;
    } else {
      settings.size--;
    }
    settings.size = Math.max(12, settings.size);
    settings.size = Math.min(32, settings.size);

    updateSettings(Object.assign({}, settings));
  }

  function changeFontFamily(font: string) {
    let settings = props.settings;
    settings.font = font;
    updateSettings(Object.assign({}, settings));
  }

  function changeTheme(theme: string[]) {
    let settings = props.settings;
    settings.background = theme[0];
    settings.color = theme[1];
    updateSettings(Object.assign({}, settings));
  }

  function updateSettings(settings: ReaderSettings) {
    props.dispatch({
      type: "reader/setSettings",
      payload: {
        settings: settings
      }
    });
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
      <div
        className="pre-content"
        ref={contentRef}
        onClick={e => setSettingsUp(false)}
      >
        <pre>{content}</pre>
      </div>
      <div
        className="reader-setting-btn"
        onClick={e => setSettingsUp(true)}
        hidden={settingsUp}
      >
        A
      </div>
      <div
        className="reader-setting-container"
        style={{
          transform: settingsUp ? "" : "translateY(100%)",
          opacity: settingsUp ? 1 : 0
        }}
      >
        <div className="reader-font-setting">
          <Button onClick={changeFontSize.bind(null, false)}>
            <span className="iconfont bookreader-icon-minus-circle" />
          </Button>
          <span style={{ fontSize: "14px", color: "black" }}>
            {props.settings.size}
          </span>
          <Button onClick={changeFontSize.bind(null, true)}>
            <span className="iconfont bookreader-icon-plus-circle" />
          </Button>
          <Dropdown direction="top" title="字体">
            <div className="font-selection">
              <ul>
                {Object.keys(FONTS).map((key: string, index: number) => (
                  <li
                    key={index}
                    style={{
                      color: props.settings.font === key ? "#55aa66" : ""
                    }}
                    onClick={e => changeFontFamily(key)}
                  >
                    {key}
                  </li>
                ))}
              </ul>
            </div>
          </Dropdown>
        </div>
        <div className="reader-themes">
          {THEMES.map((theme: string[], index: number) => (
            <span
              key={index}
              style={{
                backgroundColor: BACKGROUND[theme[0]],
                backgroundImage: BACKGROUND_IMAGE[theme[0]] || "",
                color: COLOR[theme[1]]
              }}
              onClick={changeTheme.bind(null, theme)}
            >
              {theme[2]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default connect(
  (state: any) => {
    return {
      catalog: state.books.catalog,
      content: state.books.content,
      currentBook: state.books.currentBook,
      settings: state.reader.settings
    };
  },
  (dispatch: Function) => {
    return {
      dispatch
    };
  }
)(Reader);
