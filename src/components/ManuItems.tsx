import { NavLink } from "react-router-dom";
import { MdArrowDropDown } from "react-icons/md";
import { IoMdArrowDropright } from "react-icons/io";
import { useState } from "react";

const ManuItems = ({
  icon,
  title,
  toLink,
  isSubManu = false,
  subManus
}: any) => {
  const [subOpen, setSubOpen] = useState(false);
  return (
    <div className="manu-item">
      <NavLink
        to={toLink}
        style={({ isActive }) => ({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          textDecoration: "none",
          color: "inherit",
          height: "100%",
          backgroundColor: isSubManu ? "" : isActive ? "#3b3f46" : ""
        })}
        className="manu-item-title"
        onClick={() => {
          setSubOpen((pre) => !pre);
        }}
      >
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {icon}
          <span>{title}</span>
        </div>

        {isSubManu && (
          <div className="dropdown">
            {subOpen ? <MdArrowDropDown /> : <IoMdArrowDropright />}
          </div>
        )}
      </NavLink>
      {isSubManu && (
        <div className={subOpen ? "sub-manu" : "sub-manu close"}>
          {subManus.map((manu: any) => (
            <NavLink
              to={manu.to}
              style={({ isActive }) => ({
                textDecoration: "none",
                color: "inherit",
                backgroundColor: isActive ? "#3b3f46" : "",
                width: "100%",
                border: "1px solid #3b3f46",
                borderRight: "none"
              })}
              className="manu-item-title"
            >
              <span>{manu.name}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManuItems;
