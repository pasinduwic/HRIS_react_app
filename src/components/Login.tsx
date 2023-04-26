import { auth, provider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Nav, Tab, Tabs } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import LoginForm from "../components/loginComp/loginForm";
import SigninForm from "./loginComp/SigninForm";
import AlertComp from "./AlertComp";
import { useSelector } from "react-redux";

const Login = () => {
  const alertDetails = useSelector(
    (state: any) => state.statusVar.value.alertShowDetails
  );
  return (
    <div
      className="login-page"
      style={{
        height: "100vh",
        backgroundColor: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        className="alert"
        style={{ position: "fixed", top: "8px", width: "94%" }}
      >
        {/* {alertDetails.status && (
          <AlertComp type={alertDetails.type} message={alertDetails.message} />
        )} */}
        <AlertComp type={alertDetails.type} message={alertDetails.message} />
      </div>
      <div
        style={{
          // backgroundColor: "#292525",
          padding: "10px",
          borderRadius: "20px",
          width: "40%",
          minWidth: "320px"

          // boxShadow: "5px 5px 20px white"
        }}
        className="bg-dark"
      >
        <div
          className="login-header"
          style={{
            color: "white",
            margin: "20px"
          }}
        >
          <h3>Whelcome to App</h3>
        </div>
        <div
          className="login-content"
          style={{
            margin: "10px",
            padding: "10px",
            // backgroundColor: "white",
            color: "white"
          }}
        >
          {/* <Tabs defaultActiveKey="login" className="bg-dark">
            <Tab eventKey="login" title="login" className="bg-dark">
              <LoginForm />
            </Tab>
            <Tab eventKey="signin" title="signin" className="bg-dark">
              <SigninForm />
            </Tab>
          </Tabs> */}

          <Tab.Container defaultActiveKey="login">
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link
                  eventKey="login"
                  className="bg-transparent text-light "
                >
                  Login
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="signin"
                  className="bg-transparent text-light"
                >
                  Signin
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <LoginForm />
              </Tab.Pane>
              <Tab.Pane eventKey="signin">
                <SigninForm />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
      <NavLink to="/home">Home</NavLink>
    </div>
  );
};

export default Login;
