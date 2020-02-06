import React from "react";
import "./phoneMenu.css";
import { NavLink } from "react-router-dom";
const navlinkStile = {
  textDecorationLine: "underline"
};
const PhoneMenu = props => {
  let style = props.display ? "menuPhone" : "menuPhone hidden";
  let shadow = props.display ? "shadowMenuPhone" : "shadowMenuPhone hidden";
  return (
    <>
      <div className={style}>
        <div />

        <NavLink
          activeStyle={navlinkStile}
          to="/Biography"
          onClick={props.fclose}
        >
          Biography
        </NavLink>
        <NavLink activeStyle={navlinkStile} to="/music" onClick={props.fclose}>
          Listen Us
        </NavLink>
        <NavLink
          activeStyle={navlinkStile}
          to="/Discography"
          onClick={props.fclose}
        >
          Discography
        </NavLink>

        <div />
      </div>
      <div className={shadow}></div>
    </>
  );
};
export default PhoneMenu;
