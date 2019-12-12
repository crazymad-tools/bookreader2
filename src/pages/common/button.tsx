import React from "react";
import { CommonProps } from "./common";
import "./button.scss";

interface Props extends CommonProps {}

const Button: React.FC<Props> = props => {
  return <button className="b-button" onClick={props.onClick}>{props.children}</button>;
};

export default Button;
