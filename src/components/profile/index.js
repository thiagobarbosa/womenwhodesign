import React from "react";
import Img from "gatsby-image";
import MapIcon from "../../icons/map";
import LinkIcon from "../../icons/link";
import TwitterIcon from "../../icons/twitter";
import styles from "./profile.module.scss";
import Button from "../button";

const Profile = (props) => {
  return (
    <div
      className={styles.profile}
      style={{
        "--profile-theme-color":
          props.hex === "#FFFFFF" ? "#1da1f2" : props.hex,
      }}
    >
      {props.fluid ? (
        <Img
          alt={`${props.name}'s avatar on Twitter.'`}
          fluid={props.fluid}
          backgroundColor
          className={styles.image}
        />
      ) : (
        <img
          className={styles.grayImage}
          alt={`${props.name}'s avatar on Twitter.'`}
          src={props.image.replace("_normal", "_400x400")}
          loading="lazy"
        />
      )}
      <h2 className={styles.name}>{props.name}</h2>
      <p className={styles.location}>
        <MapIcon
          style={{ marginBottom: "-2px", marginRight: "2px" }}
          size={14}
        />
        {props.location}
      </p>
      <div className={styles.url}>
        <LinkIcon size={14} />

        {props.expandedUrl ? (
          <a href={props.expandedUrl} target="_blank" rel="noopener noreferrer">
            {props.displayUrl}
          </a>
        ) : (
          <span>N/A</span>
        )}
      </div>

      <p
        className={styles.description}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: props.description }}
      />

      <Button
        href={`https://twitter.com/${props.handle}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          "--background": "var(--profile-theme-color)",
          gridColumn: "1 / -1",
          marginTop: "auto",
          marginBottom: 0,
        }}
      >
        <span className={styles.linkText}>
          <TwitterIcon style={{ color: "white" }} /> Twitter
        </span>
      </Button>
    </div>
  );
};

export default Profile;
