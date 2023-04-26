import { Button, Form, Spinner } from "react-bootstrap";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  addAlertDetails,
  addSessionUser
} from "../../redux/features/StatusVar";
import logo from "../../images/google.png";
import AlertComp from "../AlertComp";

interface userI {
  email: string;
  password: string;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<userI>({
    email: "",
    password: ""
  });
  const [loaderStatus, setLoaderStatus] = useState(false);
  const [errors, setErrors] = useState<userI>({
    email: "",
    password: ""
  });
  const dispatch = useDispatch();

  const loginRequest = async (data: any) => {
    try {
      // console.log(data);

      const responce = await axios.post(
        "https://gg85fw-3000.csb.app/api/users/login",
        data as any
      );
      const user = responce.data;
      // console.log(user);

      if (user.error) {
        dispatch(
          addAlertDetails({
            status: true,
            type: "danger",
            message: "Invalid credentials!"
          })
        );
        return;
      }
      dispatch(addSessionUser({ type: "add", payload: user }));
      navigate("/home");
    } catch (e) {
      console.log(e);
      dispatch(
        addAlertDetails({
          status: true,
          type: "danger",
          message: "Something went wrong!!"
        })
      );
    } finally {
      setLoaderStatus(false);
    }
  };

  const useGoogle = async () => {
    try {
      const user = await signInWithPopup(auth, provider);
      if (user.user) {
        const googleUser = {
          email: user.user.email,
          password: user.user.uid
        };
        loginRequest(googleUser);
      }
    } catch (e) {
      // console.log(e)
      dispatch(
        addAlertDetails({
          status: true,
          type: "danger",
          message: "Something went wrong!!"
        })
      );
    }
    // console.log("used google");
  };

  const validateForm = () => {
    // console.log(userDetails);
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])((?!pasindu).){8,}$/;
    let status = true;
    // console.log("check");
    if (!userDetails.email || userDetails?.email === "") {
      setErrors(
        (prevState) =>
          ({
            ...prevState,
            email: "Email is required!"
          } as any)
      );
      status = false;
      // console.log(errors);
    } else if (!regexEmail.test(userDetails.email)) {
      setErrors(
        (prevState) =>
          ({
            ...prevState,
            email: "Email is not valid!"
          } as any)
      );
      status = false;
      // console.log(errors);
    }

    if (!userDetails.password || userDetails?.password === "") {
      setErrors(
        (prevState) =>
          ({
            ...prevState,
            password: "Password is required!"
          } as any)
      );
      status = false;
      // console.log(errors);
    }
    if (userDetails?.password.length < 8 && userDetails?.password.length > 0) {
      setErrors(
        (prevState) =>
          ({
            ...prevState,
            password: "Password is not strong!"
          } as any)
      );
      status = false;
    } else if (!regexPassword.test(userDetails.password)) {
      setErrors(
        (prevState) =>
          ({
            ...prevState,
            password: "Password is not Valid!"
          } as any)
      );
      status = false;
    }

    return status;
  };

  const handleOnChange = (e: any) => {
    const key: string = e.target.getAttribute("name");
    const enterdValue: string = e.target.value;
    // console.log(key);
    const newData = { ...userDetails };
    newData[key as keyof typeof newData] = enterdValue;
    setUserDetails(newData as userI);
    if (errors) {
      if (!!errors[key as keyof typeof newData]) {
        setErrors({
          ...errors,
          [key]: null
        });
      }
    }

    // console.log(errors);
    // console.log(userDetails);
  };

  const handelLogin = async (e: any) => {
    e.preventDefault();

    const isValid = await validateForm();
    // console.log("errors");
    // console.log("userDetails");
    // console.log(userDetails);

    if (isValid) {
      if (userDetails) {
        setLoaderStatus(true);
        const data = userDetails;
        loginRequest(data);
        // console.log(data);
      }
    }
  };
  return (
    <div className="login-form">
      <Form className="mt-3">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            onChange={handleOnChange}
            isInvalid={!!errors?.email}
            className="bg-dark text-light"
          />
          <Form.Control.Feedback type="invalid">
            {errors?.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleOnChange}
            isInvalid={!!errors?.password}
            className="bg-dark text-light"
          />
          <Form.Control.Feedback type="invalid">
            {errors?.password}
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          variant="secondary"
          type="submit"
          onClick={handelLogin}
          className="mb-3 w-100"
        >
          {loaderStatus ? (
            <Spinner animation="border" variant="secondary" />
          ) : (
            "Login"
          )}
        </Button>
      </Form>
      <div className="login-options">
        <p style={{ margin: "0" }}>
          Login with{" "}
          <button
            style={{
              background: "none",
              border: "none",
              color: "#0d6efd",
              textDecoration: "underline"
            }}
            onClick={useGoogle}
          >
            <img src={logo} alt="" style={{ width: "40px" }} />
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
