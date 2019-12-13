import React from "react";
import { CommonProps } from "./common";
import "./button.scss";

interface Props extends CommonProps {
  size?: string;
}

const Button: React.FC<Props> = props => {
  return (
    <button className={`b-button ${props.size}`} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

Button.defaultProps = {
  size: "middle"
};

export default Button;
