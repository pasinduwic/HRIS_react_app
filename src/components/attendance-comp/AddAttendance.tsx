import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Form, Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addAlertDetails,
  addModalTogal,
  setRefresh,
  updateModalTogal
} from "../../redux/features/StatusVar";
import moment from "moment";
import { Formik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  employee: yup.string().required(),
  date: yup.string().required(),
  in: yup.string().required()
  // out: yup.string().required(),
});
interface attendanceI {
  employee: any;
  date: any;
  in: string;
  out: string;
  OT: number;
  month: number;
}

const AddAttendance = ({ employeeList }: any) => {
  const addModal = useSelector((state: any) => state.statusVar.value.addModal);
  const refreshData = useSelector(
    (state: any) => state.statusVar.value.refreshData
  );
  const dispatch = useDispatch();
  const [addData, setAddData] = useState<attendanceI>();
  const [loader, setLoader] = useState(false);
  // const [employeeList, setEmployeeList] = useState([]);

  useEffect(() => {
    setAddData({
      employee: "",
      date: "",
      in: "",
      out: "",
      OT: 0,
      month: 0
    });
    return () => {
      dispatch(addModalTogal(false));
      dispatch(updateModalTogal(false));
    };
  }, []);
  //handel submit
  const handleFormSubmit = async () => {
    // e.preventDefault();
    setLoader(true);
    try {
      const responce = await axios.post(
        "https://gg85fw-3000.csb.app/api/attendance",
        addData
      );
      // console.log(responce.data);
      if (responce.data.error) {
        return dispatch(
          addAlertDetails({
            status: true,
            type: "error",
            message: "Something went wrong!"
          })
        );
      }
      if (responce.data.errorSpecified) {
        return dispatch(
          addAlertDetails({
            status: true,
            type: "error",
            message: responce.data.errorSpecified
          })
        );
      }
      dispatch(
        addAlertDetails({
          status: true,
          type: "success",
          message: "Item added successfully!"
        })
      );
      dispatch(setRefresh(!refreshData));
    } catch (e) {
      dispatch(
        addAlertDetails({
          status: true,
          type: "error",
          message: "Something went wrong!"
        })
      );
    } finally {
      dispatch(addModalTogal(false));
      setLoader(false);
    }
  };

  //handel change
  const handelOnChange = (e: any) => {
    const fieldName: string = e.target.getAttribute("name");
    const fieldValue: string = e.target.value;

    const newData = { ...addData };
    newData[fieldName as keyof typeof newData] = fieldValue;

    if (newData.in !== "" && newData.out !== "") {
      const countOT =
        moment(newData.out, "HH:mm:ss").diff(
          moment(newData.in, "HH:mm:ss"),
          "hours"
        ) - 8;
      // const test = moment(newData.out, "HH:mm:ss").diff(
      //   moment(newData.in, "HH:mm:ss"),
      //   "hours"
      // )

      // setDateCount(countDays);
      newData.OT = countOT;
    }
    if (newData.date !== "") {
      const month = moment(newData.date).month() + 1;
      // const test = moment(newData.out, "HH:mm:ss").diff(
      //   moment(newData.in, "HH:mm:ss"),
      //   "hours"
      // )

      // setDateCount(countDays);
      newData.month = month;
    }

    // console.log(moment(newData.date).month());
    setAddData(newData as attendanceI);
    // console.log(addData);
  };

  return (
    <Modal
      show={addModal}
      onHide={() => dispatch(addModalTogal(false))}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Attendance</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            employee: "",
            data: "",
            in: "",
            out: ""
          }}
          onSubmit={(values) => {
            handleFormSubmit();
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors
          }) => (
            <Form>
              <Form.Group>
                <Form.Label>Employee Name</Form.Label>
                <Form.Select
                  placeholder="Name"
                  onChange={(e) => {
                    handelOnChange(e);
                    handleChange(e);
                  }}
                  name="employee"
                  isInvalid={!!errors.employee}
                >
                  <option>- Select Employee -</option>
                  {employeeList.map((emp: any) => (
                    <option value={emp._id} key={emp._id}>
                      {emp.first_name + " " + emp.last_name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.employee}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Location"
                  onChange={(e) => {
                    handelOnChange(e);
                    handleChange(e);
                  }}
                  name="date"
                  isInvalid={!!errors.date}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.date}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>In</Form.Label>
                <Form.Control
                  type="time"
                  placeholder="Location"
                  onChange={(e) => {
                    handelOnChange(e);
                    handleChange(e);
                  }}
                  name="in"
                  isInvalid={!!errors.in}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.in}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Out</Form.Label>
                <Form.Control
                  type="time"
                  placeholder="Location"
                  onChange={(e) => {
                    handelOnChange(e);
                    handleChange(e);
                  }}
                  name="out"
                  isInvalid={!!errors.out}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.out}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Over Time (hr)</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => {
                    handelOnChange(e);
                    handleChange(e);
                  }}
                  name="out"
                  value={addData?.OT}
                  disabled
                />
              </Form.Group>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => dispatch(addModalTogal(false))}
                >
                  Close
                </Button>
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                  {loader ? <Spinner animation="border" size="sm" /> : "Add"}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default AddAttendance;
