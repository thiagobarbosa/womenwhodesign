import React from "react";
import styles from "./filterItem.module.scss";

const FilterItem = props => {
  return (
    <li className={styles.item} key={props.index}>
      <input
        id={props.id}
        type="checkbox"
        value={props.id}
        onClick={props.onFilterClick}
        checked={props.isChecked}
        className={styles.input}
      />
      <label htmlFor={props.id} className={styles.label}>
        <span className={styles.span}>{props.title}</span>
      </label>
      <span className={styles.counter}>{props.counter}</span>
    </li>
  );
};

export default FilterItem;
