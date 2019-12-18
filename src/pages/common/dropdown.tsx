import React, { useState, useEffect, useRef } from "react";
import { Button } from "./";
import { createPortal } from "react-dom";
import { CommonProps } from "./common";
import { getOffsetDistance } from "../../utils/Dom";
import "./dropdown.scss";

interface DropdownProps extends CommonProps {
  direction: string;
  title: string;
}

interface DropdownContentProps {
  visible: boolean;
  offset: { x: number; y: number };
  direction: string;
}

const DropdownContent: React.FC<DropdownContentProps> = props => {
  return createPortal(
    <div
      className={`dropdown-content ${props.visible ? "show" : "hide"} ${
        props.direction
      }`}
      style={{ left: `${props.offset.x}px`, top: `${props.offset.y}px` }}
    >
      {props.children}
    </div>,
    document.body
  );
};

const Dropdown: React.FC<DropdownProps> = props => {
  const [visible, setVisible] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const currentRef = useRef<any>(null);

  function toggle() {
    if (visible) {
      setVisible(false);
    } else {
      updateOffset();
      setVisible(true);
    }
  }

  function updateOffset() {
    let { offsetLeft, offsetTop } = getOffsetDistance(currentRef.current);
    let width = currentRef.current.clientWidth;
    let height = currentRef.current.clientHeight;
    setOffset({
      x: offsetLeft + width / 2,
      y: offsetTop
    });
  }

  useEffect(() => {
    updateOffset();
  }, []);

  useEffect(() => {
    function blur(e: any) {
      for (let dom of e.path) {
        if (
          dom === currentRef.current ||
          (dom.classList && dom.classList.contains("dropdown-content"))
        )
          return;
      }
      setVisible(false);
    }
    document.addEventListener("click", blur);
    return () => {
      document.removeEventListener("click", blur);
    };
  });

  return (
    <div className="dropdown" ref={currentRef}>
      <Button onClick={toggle}>{props.title}</Button>
      <DropdownContent
        visible={visible}
        offset={offset}
        direction={props.direction}
      >
        {props.children}
      </DropdownContent>
    </div>
  );
};

export default Dropdown;
