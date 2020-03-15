import React from "react";
import classnames from "classnames";
import { Link } from "gatsby";
import styles from "./index.module.scss";

const Button = ({ children, type, href, to, onClick, fullWidth, arrow }) => {
  const buttonStyles = classnames(styles.main, styles.fullWidth && fullWidth);
  const childStyles = classnames(styles.children && arrow);
  const El = href ? "a" : to ? Link : "button";
  return (
    <El
      className={buttonStyles}
      type={type}
      href={href}
      to={to}
      onClick={onClick}
      fullWidth={fullWidth || true}
    >
      <span className={childStyles}>{children}</span>
      {arrow && <span className={styles.arrow}>→</span>}
    </El>
  );
};

export default Button;
