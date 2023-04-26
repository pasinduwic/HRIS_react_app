import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Dropdown,
  Navbar as NavbarBs,
  OverlayTrigger,
  Popover
} from "react-bootstrap";
import { AiOutlineMenu } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import {
  addSidebarOpen,
  addSessionUser,
  setScreenSize
} from "../redux/features/StatusVar";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "../config/firebase";
// import { signOut } from "firebase/auth";
// import { addToCart, removeFromCart } from "../redux/features/CartItems";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { Tooltip } from "@mui/material";

const Navbar = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(
    (state: any) => state.statusVar.value.sessionUser
  );
  const sidebarOpen = useSelector(
    (state: any) => state.statusVar.value.sidebarOpen
  );
  const screenSize = useSelector(
    (state: any) => state.statusVar.value.screenSize
  );

  // const [user] = useAuthState(auth);
  const navigate = useNavigate();
  // const [screenSize, setScreenSize] = useState<number>();

  const logout = async () => {
    // console.log("loginout");

    // if (user) {
    //   await signOut(auth);
    // }
    await dispatch(addSessionUser({ type: "remove", payload: sessionUser }));
    navigate("/");
  };

  const popover = (
    <Popover>
      <Popover.Header as="h3">Profile</Popover.Header>
      <Popover.Body>
        <div className="popover-profile">
          <img
            src={sessionUser?.imagePath || ""}
            alt=""
            style={{ width: "54px", borderRadius: "50%" }}
          />
          <span> {sessionUser?.displayName}</span>
        </div>
      </Popover.Body>
      <Popover.Header
        as="h2"
        style={{ display: "flex", justifyContent: "center", padding: "0" }}
      >
        <Tooltip title="Logout">
          <button
            className="btn "
            onClick={logout}
            style={{ fontSize: "1.2rem", padding: "0" }}
          >
            <BiLogOut />
          </button>
        </Tooltip>
      </Popover.Header>
    </Popover>
  );

  useEffect(() => {
    const handleResize = () => dispatch(setScreenSize(window.innerWidth));

    window.addEventListener("resize", handleResize);
    handleResize();
    // console.log(screenSize)

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="navbar-container">
      <NavbarBs
        sticky="top"
        className="bg-light"
        expand="lg"
        style={{ boxShadow: "0 .5rem 1rem rgba(0,0,0,.15)", height: "68px" }}
      >
        <div className="navbar-left">
          <div>
            {(screenSize as any) < 852 ? (
              <Dropdown>
                <DropdownToggle variant="Secondary">
                  <AiOutlineMenu />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>
                    <NavLink
                      className="navbar-link"
                      to="/home/dashboard"
                      style={({ isActive }) => ({
                        // backgroundColor: isActive ? "#0d6efd" : "white",
                        color: isActive ? "#0d6efd" : ""
                        // border: isActive ? "none" : "1px solid gray"
                      })}
                    >
                      Dashboard{" "}
                    </NavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <NavLink
                      className="navbar-link"
                      to="/home/employee"
                      style={({ isActive }) => ({
                        // backgroundColor: isActive ? "#0d6efd" : "white",
                        color: isActive ? "#0d6efd" : ""
                        // border: isActive ? "none" : "1px solid gray"
                      })}
                    >
                      Employee{" "}
                    </NavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <NavLink
                      className="navbar-link"
                      to="/home/department"
                      style={({ isActive }) => ({
                        // backgroundColor: isActive ? "#0d6efd" : "white",
                        color: isActive ? "#0d6efd" : ""
                        // border: isActive ? "none" : "1px solid gray"
                      })}
                    >
                      Departments{" "}
                    </NavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <NavLink
                      className="navbar-link"
                      to="/home/office"
                      style={({ isActive }) => ({
                        // backgroundColor: isActive ? "#0d6efd" : "white",
                        color: isActive ? "#0d6efd" : ""
                        // border: isActive ? "none" : "1px solid gray"
                      })}
                    >
                      Offices{" "}
                    </NavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <NavLink
                      className="navbar-link"
                      to="/home/designation"
                      style={({ isActive }) => ({
                        // backgroundColor: isActive ? "#0d6efd" : "white",
                        color: isActive ? "#0d6efd" : ""
                        // border: isActive ? "none" : "1px solid gray"
                      })}
                    >
                      Designations{" "}
                    </NavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <NavLink
                      className="navbar-link"
                      to="/home/attendance"
                      style={({ isActive }) => ({
                        // backgroundColor: isActive ? "#0d6efd" : "white",
                        color: isActive ? "#0d6efd" : ""
                        // border: isActive ? "none" : "1px solid gray"
                      })}
                    >
                      Attendance{" "}
                    </NavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <NavLink
                      className="navbar-link"
                      to="/home/leave"
                      style={({ isActive }) => ({
                        // backgroundColor: isActive ? "#0d6efd" : "white",
                        color: isActive ? "#0d6efd" : ""
                        // border: isActive ? "none" : "1px solid gray"
                      })}
                    >
                      Leave{" "}
                    </NavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <NavLink
                      className="navbar-link"
                      to="/home/payrol"
                      style={({ isActive }) => ({
                        // backgroundColor: isActive ? "#0d6efd" : "white",
                        color: isActive ? "#0d6efd" : ""
                        // border: isActive ? "none" : "1px solid gray"
                      })}
                    >
                      Payrol{" "}
                    </NavLink>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : !sidebarOpen ? (
              <div>
                <button
                  onClick={() => dispatch(addSidebarOpen(true))}
                  style={{ background: "none", border: "none" }}
                >
                  <AiOutlineMenu />
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <div className="user-info">
            <OverlayTrigger
              trigger="click"
              placement="bottom"
              overlay={popover}
            >
              <div>
                <img
                  src={sessionUser?.imagePath || ""}
                  alt=""
                  style={{
                    width: "54px",
                    borderRadius: "50%",
                    marginLeft: "20px"
                  }}
                />
                <span className="user">{sessionUser?.displayName}</span>
              </div>
            </OverlayTrigger>
          </div>
        </div>
      </NavbarBs>
    </div>
  );
};

export default Navbar;
