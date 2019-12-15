import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../common";
import "./index.scss";

interface Props {}

const SettingsPage: React.FC<Props> = props => {
  return (
    <div className="settings-page">
      <Link to="/">
        <Button>返回书架</Button>
      </Link>
      <h4>全局快捷键</h4>
      <p>
        <label>上一章:</label>
        <input value="Crtl + Left" disabled />
      </p>
      <p>
        <label>下一章:</label>
        <input value="Crtl + Right" disabled />
      </p>
      <p>
        <label>上一页:</label>
        <input value="Crtl + Up" disabled />
      </p>
      <p>
        <label>下一页:</label>
        <input value="Crtl + Down" disabled />
      </p>
      <p>
        <label>快速退出:</label>
        <input value="Alt + W" disabled />
      </p>
      <p>
        <label>最小化:</label>
        <input value="Alt + D" disabled />
      </p>
      <p>
        <label>返回窗口:</label>
        <input value="Alt + B" disabled />
      </p>
    </div>
  );
};

export default SettingsPage;
