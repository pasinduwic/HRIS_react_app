import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Form, Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addAlertDetails,
  addModalTogal,
  setRefresh
} from "../../redux/features/StatusVar";
import moment from "moment";
import { Formik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  // employee: yup.string().required(),
  leaveType: yup.string().required("Leave type is required!"),
  startDate: yup.string().required("Start data is required!"),
  endDate: yup.string().required("End date is required!")
  // numberofDays: yup.number().required().positive().integer(),
});

interface leaveI {
  employee: any;
  leaveType: number;
  startDate: any;
  endDate: any;
  numberofDays: number;
  status: number;
}

const AddLeave = () => {
  const addModal = useSelector((state: any) => state.statusVar.value.addModal);
  const refreshData = useSelector(
    (state: any) => state.statusVar.value.refreshData
  );
  const [addData, setAddData] = useState<leaveI>();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [dateCount, setDateCount] = useState(0);

  const emp = {
    _id: "642c4bd5bac1f5add5d5d3f5",
    employee_no: 1,
    first_name: "pasinduD",
    last_name: "wickramarachchi",
    designation: "SE",
    email: "pasindu0810@gmail.com",
    epf_no: 12901,
    photo: "",
    department: null,
    phone_office: 123123,
    phone_personal: 3232,
    address: "fwefeffef",
    emergancy_contact_name: "Nihal Rohana",
    emergancy_contact_number: 34234234,
    joined_date: "2023-04-04T00:00:00.000Z",
    end_date: null,
    emp_status: 1,
    office: {
      _id: "642abafa68f698c02802d23b",
      name: "cmb 2",
      location: "Access towers",
      __v: 0
    },
    __v: 0
  };

  useEffect(() => {
    setAddData({
      employee: emp._id,
      leaveType: 0,
      startDate: "",
      endDate: "",
      numberofDays: 0,
      status: 0
    });
    setDateCount(0);
    return () => {
      dispatch(addModalTogal(false));
      // console.log("hutta")
    };
  }, []);
  //handel submit
  const handleFormSubmit = async () => {
    // e.preventDefault();
    setLoader(true);
    if (addData?.numberofDays < 0) {
      return dispatch(
        addAlertDetails({
          status: true,
          type: "error",
          message: "Selected end date is invalid!"
        })
      );
    }
    try {
      const responce = await axios.post(
        "https://gg85fw-3000.csb.app/api/leave",
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

    if (newData.startDate !== "" && newData.endDate !== "") {
      const countDays = moment(newData.endDate).diff(
        moment(newData.startDate),
        "days"
      );

      // setDateCount(countDays);
      newData.numberofDays = countDays;
    }
    setAddData(newData as leaveI);
    console.log(newData);
  };

  return (
    <Modal
      show={addModal}
      onHide={() => dispatch(addModalTogal(false))}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Leave</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            employee: "",
            leaveType: "",
            startDate: "",
            endDate: "",
            numberofDays: ""
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
                  // disabled
                >
                  <option value={emp._id} selected>
                    {emp.first_name}
                  </option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Leave Type</Form.Label>
                <Form.Select
                  placeholder="Name"
                  onChange={(e) => {
                    handelOnChange(e);
                    handleChange(e);
                  }}
                  name="leaveType"
                  isInvalid={!!errors.leaveType}
                >
                  <option value="">- Select Leave Type -</option>
                  <option value="1">Anual</option>
                  <option value="2">Casual</option>
                  <option value="3">Medical</option>
                  <option value="4">No pay</option>
                  <option value="5">Carry Over</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.leaveType}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Location"
                  onChange={(e) => {
                    handelOnChange(e);
                    handleChange(e);
                  }}
                  name="startDate"
                  isInvalid={!!errors.startDate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.startDate}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Location"
                  onChange={(e) => {
                    handelOnChange(e);
                    handleChange(e);
                  }}
                  name="endDate"
                  isInvalid={!!errors.endDate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.endDate}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>No of Days</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="No of Days"
                  onChange={(e) => {
                    handelOnChange(e);
                    handleChange(e);
                  }}
                  name="numberofDays"
                  value={addData?.numberofDays}
                  isInvalid={!!errors.numberofDays}
                  disabled
                />
                <Form.Control.Feedback type="invalid">
                  {errors.numberofDays}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  placeholder="Name"
                  onChange={handelOnChange}
                  name="status"
                  disabled
                >
                  <option>Approval Pending</option>
                </Form.Select>
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

export default AddLeave;
