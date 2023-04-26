import { useEffect, useState } from "react";
import axios from "axios";

import { Close, Edit, ExpandMore, Save } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  Skeleton,
  Step,
  StepLabel,
  Stepper,
  Tooltip
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { addAlertDetails, addModalTogal } from "../redux/features/StatusVar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Col, Form, Placeholder, Row, Spinner } from "react-bootstrap";
import Notifications from "../components/Notification";
import { Formik } from "formik";
import * as yup from "yup";
import moment from "moment";

const validationSchema = yup.object().shape({
  epf_no: yup.number().required("EPF is required!"),
  first_name: yup.string().required("First name is required!"),
  last_name: yup.string().required("Last name is required!"),
  email: yup.string().required("Email is required!"),
  NIC: yup.string().required("NIC is required!")
});
const validationSalarySchema = yup.object().shape({
  basic: yup.number().required("Basic Salary is required!").positive()
});

interface empI {
  employee_no: string;
  first_name: string;
  last_name: string;
  designation: any;
  email: string;
  epf_no: number;
  photo: string;
  HOD: any;
  department: any;
  phone_office: number;
  phone_personal: number;
  address: string;
  emergancy_contact_name: string;
  emergancy_contact_number: number;
  joined_date: any;
  end_date: any;
  emp_status: number;
  office: any;
  NIC: string;
  nationality: string;
  riligion: string;
  marital_status: number;
  carder: number;
  brithDay: any;
}
interface deptI {
  name: string;
  office: any;
}
interface desigI {
  name: string;
  level: number;
  department: any;
}
interface salaryI {
  _id: string;
  EPFCompany: number;
  EPFEmp: number;
  ETF: number;
  OTAllawance: number;
  basic: number;
  employee: any;
  gross: number;
  mobileAllawance: number;
  net: number;
  otherAllawance: number;
  transportAllawance: number;
  tax: number;
}
interface leaveI {
  _id: string;
  employee: any;
  anual: number;
  casual: number;
  medical: number;
  nopay: number;
  carryOver: number;
}

const EmployeeDetails = () => {
  const [employeeData, setEmployeeData] = useState<empI>({
    employee_no: "",
    first_name: "",
    last_name: "",
    designation: "",
    email: "",
    epf_no: 0,
    photo: "",
    HOD: "",
    department: "",
    phone_office: 0,
    phone_personal: 0,
    address: "",
    emergancy_contact_name: "",
    emergancy_contact_number: 0,
    joined_date: "",
    end_date: "",
    emp_status: 0,
    office: "",
    NIC: "",
    nationality: "",
    riligion: "",
    marital_status: 0,
    carder: 0,
    brithDay: ""
  });
  const [salaryDetails, setSalaryDetails] = useState<salaryI>();
  const [loader, setLoader] = useState(false);
  const [newSalary, setNewSalary] = useState(false);
  const [newLeave, setNewLeave] = useState(false);
  const [deptData, setDeptData] = useState([]);
  const [officeData, setOfficeData] = useState([]);
  const [designationData, setDesignationData] = useState([]);
  const [HODData, setHODData] = useState([]);
  const [leaveDetails, setLeaveDetails] = useState<leaveI>();
  const deleteModal = useSelector(
    (state: any) => state.statusVar.value.deleteModal
  );
  const dispatch = useDispatch();
  const steps = ["Official", "Contact", "Personal", "Salary", "Leaves"];
  const [activeStep, setActiveStep] = useState(0);
  const [mode, setMode] = useState(0);
  const [formLoader, setFormLoader] = useState(true);
  const id = useParams().id;
  //fetching table data
  useEffect(() => {
    const getData = async () => {
      setFormLoader(true);
      try {
        const responce = await axios.get(
          "https://gg85fw-3000.csb.app/api/employee" + id
        );
        if (responce.data.error) {
          return dispatch(
            addAlertDetails({
              status: true,
              type: "error",
              message: "failed to load data!"
            })
          );
        }
        setEmployeeData(responce.data);
        console.log(employeeData);
        setFormLoader(false);
        const responceDept = await axios.get(
          "https://gg85fw-3000.csb.app/api/department"
        );
        const responceHOD = await axios.get(
          "https://gg85fw-3000.csb.app/api/employee"
        );
        const responceDesignation = await axios.get(
          "https://gg85fw-3000.csb.app/api/designation"
        );
        const responceOffice = await axios.get(
          "https://gg85fw-3000.csb.app/api/office"
        );
        const responceSalary = await axios.get(
          "https://gg85fw-3000.csb.app/api/salary" + id
        );
        const responceLeave = await axios.get(
          "https://gg85fw-3000.csb.app/api/lvrecords" + id
        );
        console.log(employeeData);
        if (responceDept.data) {
          dispatch(
            addAlertDetails({
              status: true,
              type: "error",
              message: "failed to load departments!"
            })
          );
        } else {
          setDeptData(responceDept.data);
        }
        if (responceHOD.data.error) {
          dispatch(
            addAlertDetails({
              status: true,
              type: "error",
              message: "failed to load HOD!"
            })
          );
        } else {
          setHODData(responceHOD.data);
        }
        if (responceDesignation.data.error) {
          dispatch(
            addAlertDetails({
              status: true,
              type: "error",
              message: "failed to load designations!"
            })
          );
        } else {
          setDesignationData(responceDesignation.data);
        }
        if (responceOffice.data.error) {
          dispatch(
            addAlertDetails({
              status: true,
              type: "error",
              message: "failed to load HOD!"
            })
          );
        } else {
          setOfficeData(responceOffice.data);
        }
        if (responceSalary.data.error) {
          dispatch(
            addAlertDetails({
              status: true,
              type: "error",
              message: "failed to load salary!"
            })
          );
          setSalaryDetails({
            EPFCompany: 0,
            EPFEmp: 0,
            ETF: 0,
            OTAllawance: 0,
            basic: 0,
            employee: responce.data._id,
            gross: 0,
            mobileAllawance: 0,
            net: 0,
            otherAllawance: 0,
            transportAllawance: 0,
            tax: 0
          } as salaryI);
          setNewSalary(true);
        } else {
          setSalaryDetails(responceSalary.data);
        }
        if (responceLeave.data.error) {
          dispatch(
            addAlertDetails({
              status: true,
              type: "error",
              message: "failed to load leave!"
            })
          );
          setLeaveDetails({
            employee: responce.data._id,
            anual: 0,
            casual: 0,
            medical: 0
          } as leaveI);
          setNewLeave(true);
        } else {
          setLeaveDetails(responceLeave.data);
        }
        //need  check error logics

        // console.log(salaryDetails);
      } catch (e) {
        dispatch(
          addAlertDetails({
            status: true,
            type: "error",
            message: "failed to load data!"
          })
        );
      }
    };
    getData();
  }, []);

  const handelNext = () => {
    // console.log(salaryDetails);
    setActiveStep((pre) => pre + 1);
  };
  const handelBack = () => {
    setActiveStep((pre) => pre - 1);
  };

  const handelSalarySubmit = async () => {
    setLoader(true);
    // const passingData = updateDataInitial;
    // delete updateDataInitial._id;
    // delete updateDataInitial.__v;
    // console.log(salaryDetails);

    try {
      // console.log(newSalary)
      let responceSalary;
      if (newSalary) {
        responceSalary = await axios.post(
          "https://gg85fw-3000.csb.app/api/salary",
          salaryDetails
        );
      } else {
        responceSalary = await axios.put(
          "https://gg85fw-3000.csb.app/api/salary" + salaryDetails?._id,
          salaryDetails
        );
      }

      console.log(responceSalary.data);

      if (responceSalary.data.error) {
        return dispatch(
          addAlertDetails({
            status: true,
            type: "error",
            message: "Something went wrong in Salary updating!"
          })
        );
      }
      if (responceSalary.data.errorSpecified) {
        return dispatch(
          addAlertDetails({
            status: true,
            type: "error",
            message: responceSalary.data.errorSpecified
          })
        );
      }

      dispatch(
        addAlertDetails({
          status: true,
          type: "success",
          message: "Salary Details updated successfully!"
        })
      );
      // setActiveStep(0);
      setMode(0);
      setNewSalary(false);
    } catch (e) {
      dispatch(
        addAlertDetails({
          status: true,
          type: "error",
          message: "Something went wrong!"
        })
      );
    } finally {
      setLoader(false);
    }
  };
  const handleFormSubmit = async () => {
    setLoader(true);
    // const passingData = updateDataInitial;
    // delete updateDataInitial._id;
    // delete updateDataInitial.__v;
    // console.log(passingData);

    try {
      const responce = await axios.put(
        "https://gg85fw-3000.csb.app/api/employee" + id,
        employeeData
      );
      // const responceSalary = await axios.put(
      //   "https://gg85fw-3000.csb.app/api/salary" + salaryDetails?._id,
      //   salaryDetails
      // );
      // const responceLeave = await axios.put(
      //   "https://gg85fw-3000.csb.app/api/lvrecords" + leaveDetails?._id,
      //   leaveDetails
      // );
      // console.log(responce.data);
      if (responce.data.error) {
        return dispatch(
          addAlertDetails({
            status: true,
            type: "error",
            message: "Something went wrong in Employe updating!"
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
          message: "Employee Details updated successfully!"
        })
      );
      // setActiveStep(0);
      setMode(0);
    } catch (e) {
      dispatch(
        addAlertDetails({
          status: true,
          type: "error",
          message: "Something went wrong!"
        })
      );
    } finally {
      setLoader(false);
    }
  };
  const handelLeaveSubmit = async () => {
    setLoader(true);
    // const passingData = updateDataInitial;
    // delete updateDataInitial._id;
    // delete updateDataInitial.__v;
    // console.log(passingData);

    try {
      let responceLeave;
      if (newLeave) {
        responceLeave = await axios.post(
          "https://gg85fw-3000.csb.app/api/lvrecords",
          leaveDetails
        );
      } else {
        responceLeave = await axios.put(
          "https://gg85fw-3000.csb.app/api/lvrecords" + leaveDetails?._id,
          leaveDetails
        );
      }

      // console.log(responceLeave.data);
      if (responceLeave.data.error) {
        return dispatch(
          addAlertDetails({
            status: true,
            type: "error",
            message: "Something went wrong in Leave updating!"
          })
        );
      }
      if (responceLeave.data.errorSpecified) {
        return dispatch(
          addAlertDetails({
            status: true,
            type: "error",
            message: responceLeave.data.errorSpecified
          })
        );
      }

      dispatch(
        addAlertDetails({
          status: true,
          type: "success",
          message: "Leave details updated successfully!"
        })
      );
      // setActiveStep(0);
      setMode(0);
      setNewLeave(false);
    } catch (e) {
      dispatch(
        addAlertDetails({
          status: true,
          type: "error",
          message: "Something went wrong!"
        })
      );
    } finally {
      setLoader(false);
    }
  };

  const handelOnChange = (e: any) => {
    const fieldName: string = e.target.getAttribute("name");
    const fieldValue: string = e.target.value;
    // console.log(fieldName);
    const newData = { ...employeeData };
    newData[fieldName as keyof typeof newData] = fieldValue;
    setEmployeeData(newData);
    // console.log(newData);
  };
  const handelSalaryOnChange = (e: any) => {
    const fieldName: string = e.target.getAttribute("name");
    const fieldValue: number = e.target.value;
    console.log(fieldValue);
    const newData = { ...salaryDetails };
    newData[fieldName as keyof typeof newData] = fieldValue;
    //calc gross
    newData.gross =
      parseInt(newData.basic) +
      parseInt(newData.transportAllawance) +
      parseInt(newData.mobileAllawance) +
      parseInt(newData.otherAllawance);

    //calc epf
    newData.EPFEmp = (parseInt(newData.basic) * 8) / 100;
    newData.EPFCompany = (parseInt(newData.basic) * 12) / 100;
    newData.ETF = (parseInt(newData.basic) * 3) / 100;

    //calc net
    newData.net =
      parseInt(newData.gross) -
      parseInt(newData.EPFEmp) -
      parseInt(newData.tax);

    setSalaryDetails(newData as any);
    console.log(newData);
  };
  const handelLeaveOnChange = (e: any) => {
    const fieldName: string = e.target.getAttribute("name");
    const fieldValue: string = e.target.value;
    // console.log(fieldName);
    const newData = { ...leaveDetails };
    newData[fieldName as keyof typeof newData] = fieldValue;
    setLeaveDetails(newData as any);
    // console.log(newData);
  };

  const handelMode = () => {
    setMode(0);
    // setActiveStep(0);
  };

  const datForPicker = (date: Date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h3>
          Employee Details - {employeeData.first_name} {employeeData.last_name}
        </h3>
        <div style={{ display: "flex" }}>
          <div className="add">
            <Tooltip title="Add Item">
              <IconButton
                onClick={() => {
                  mode === 0 ? setMode(1) : handelMode();
                }}
                sx={{ border: "1px solid gray" }}
                size="medium"
              >
                {" "}
                {loader ? (
                  <Spinner animation="border" size="sm" />
                ) : mode === 0 ? (
                  <Edit />
                ) : (
                  <Close />
                )}
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="emp-detail-content page-content">
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            first_name: "employeeData.first_name",
            last_name: "employeeData.last_name",
            email: "employeeData.email",
            epf_no: 1,
            NIC: "employeeData.NIC"
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
            <div>
              <Form>
                <Accordion expanded>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    Official Details
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      {formLoader ? (
                        <>
                          <Row>
                            <Form.Group as={Col}>
                              <Skeleton animation="wave" width="50%" />
                              <Skeleton animation="wave" />
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Skeleton animation="wave" width="50%" />
                              <Skeleton animation="wave" />
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Skeleton animation="wave" width="50%" />
                              <Skeleton animation="wave" />
                            </Form.Group>
                          </Row>
                          <Row>
                            <Form.Group as={Col}>
                              <Skeleton animation="wave" width="50%" />
                              <Skeleton animation="wave" />
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Skeleton animation="wave" width="50%" />
                              <Skeleton animation="wave" />
                            </Form.Group>
                          </Row>
                          <Row>
                            <Form.Group as={Col}>
                              <Skeleton animation="wave" width="50%" />
                              <Skeleton animation="wave" />
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Skeleton animation="wave" width="50%" />
                              <Skeleton animation="wave" />
                            </Form.Group>
                          </Row>
                          <Row>
                            <Form.Group as={Col}>
                              <Skeleton animation="wave" width="50%" />
                              <Skeleton animation="wave" />
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Skeleton animation="wave" width="50%" />
                              <Skeleton animation="wave" />
                            </Form.Group>
                          </Row>
                          <Row>
                            <Form.Group as={Col}>
                              <Skeleton animation="wave" width={50} />
                              <Skeleton animation="wave" />
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Skeleton animation="wave" width={50} />
                              <Skeleton animation="wave" />
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Skeleton animation="wave" width={50} />
                              <Skeleton animation="wave" />
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Skeleton animation="wave" width={50} />
                              <Skeleton animation="wave" />
                            </Form.Group>
                          </Row>
                        </>
                      ) : (
                        <>
                          <Row>
                            <Form.Group as={Col}>
                              <Form.Label>Employee Number</Form.Label>
                              <Form.Control
                                type="text"
                                value={employeeData.employee_no}
                                disabled
                                onChange={handelOnChange}
                                name="employee_no"
                                size="sm"
                              />
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Form.Label>EPF Number</Form.Label>
                              <Form.Control
                                disabled={mode === 0 ? true : false}
                                type="text"
                                value={employeeData.epf_no}
                                onChange={(e) => {
                                  handelOnChange(e);
                                  handleChange(e);
                                }}
                                name="epf_no"
                                isInvalid={!!errors.epf_no}
                                size="sm"
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.epf_no}
                              </Form.Control.Feedback>
                            </Form.Group>
                            {/* <Form.Group as={Col}>
                    <Form.Label>Photo</Form.Label>
                    <Form.Control
                      disabled={mode === 0 ? true : false}
                      type="text"
                      value={employeeData.photo}
                      onChange={handelOnChange}
                      name="photo"
                    />
                  </Form.Group> */}
                          </Row>
                          <Row>
                            <Form.Group as={Col}>
                              <Form.Label>First Name</Form.Label>
                              <Form.Control
                                disabled={mode === 0 ? true : false}
                                type="text"
                                value={employeeData.first_name}
                                onChange={(e) => {
                                  handelOnChange(e);
                                  handleChange(e);
                                }}
                                name="first_name"
                                isInvalid={!!errors.first_name}
                                size="sm"
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.first_name}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Form.Label>Last Name</Form.Label>
                              <Form.Control
                                disabled={mode === 0 ? true : false}
                                type="text"
                                value={employeeData.last_name}
                                onChange={(e) => {
                                  handelOnChange(e);
                                  handleChange(e);
                                }}
                                name="last_name"
                                isInvalid={!!errors.last_name}
                                size="sm"
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.last_name}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Row>
                          <Row>
                            <Form.Group as={Col}>
                              <Form.Label>Designation</Form.Label>
                              <Form.Select
                                disabled={mode === 0 ? true : false}
                                onChange={handelOnChange}
                                name="designation"
                                size="sm"
                              >
                                {mode === 1 ? (
                                  designationData.map((desig: any) =>
                                    desig._id ===
                                    employeeData.designation._id ? (
                                      <option
                                        value={desig._id}
                                        key={desig._id}
                                        selected
                                      >
                                        {desig.name}
                                      </option>
                                    ) : (
                                      <option value={desig._id} key={desig._id}>
                                        {desig.name}
                                      </option>
                                    )
                                  )
                                ) : (
                                  <option>
                                    {employeeData.designation?.name}
                                  </option>
                                )}
                              </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Form.Label>Department</Form.Label>
                              <Form.Select
                                disabled={mode === 0 ? true : false}
                                onChange={handelOnChange}
                                name="department"
                                size="sm"
                              >
                                {mode === 1 ? (
                                  deptData.map((dept: any) => (
                                    <option
                                      value={dept._id}
                                      key={dept._id}
                                      selected={
                                        dept._id ===
                                        employeeData.department?._id
                                      }
                                    >
                                      {dept.name}
                                    </option>
                                  ))
                                ) : (
                                  <option>
                                    {employeeData.department?.name}
                                  </option>
                                )}
                              </Form.Select>
                            </Form.Group>
                          </Row>
                          <Row>
                            <Form.Group as={Col}>
                              <Form.Label>Office Based At</Form.Label>
                              <Form.Select
                                disabled={mode === 0 ? true : false}
                                onChange={handelOnChange}
                                name="office"
                                size="sm"
                              >
                                {mode === 1 ? (
                                  officeData.map((office: any) => (
                                    <option
                                      value={office._id}
                                      key={office._id}
                                      selected={
                                        office._id === employeeData.office._id
                                      }
                                    >
                                      {office.name}
                                    </option>
                                  ))
                                ) : (
                                  <option>{employeeData.office?.name}</option>
                                )}
                              </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Form.Label>Reporting Manger</Form.Label>
                              <Form.Select
                                disabled={mode === 0 ? true : false}
                                onChange={handelOnChange}
                                name="HOD"
                                size="sm"
                              >
                                {mode === 1 ? (
                                  HODData.map((HOD: any) => (
                                    <option
                                      value={HOD._id}
                                      key={HOD._id}
                                      selected={
                                        HOD._id === employeeData.HOD?._id
                                          ? true
                                          : false
                                      }
                                    >
                                      {HOD.first_name}
                                    </option>
                                  ))
                                ) : (
                                  <option>
                                    {employeeData.HOD?.first_name}
                                  </option>
                                )}
                              </Form.Select>
                            </Form.Group>
                          </Row>
                          <Row>
                            <Form.Group as={Col}>
                              <Form.Label>Joined Date</Form.Label>
                              <Form.Control
                                disabled={mode === 0 ? true : false}
                                type="date"
                                value={datForPicker(employeeData.joined_date)}
                                onChange={handelOnChange}
                                name="joined_date"
                                size="sm"
                              />
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Form.Label>Resigned Date</Form.Label>
                              <Form.Control
                                disabled={mode === 0 ? true : false}
                                type="date"
                                value={
                                  employeeData.end_date
                                    ? datForPicker(employeeData.end_date)
                                    : ""
                                }
                                onChange={handelOnChange}
                                name="end_date"
                                size="sm"
                              />
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Form.Label>Employee Status</Form.Label>
                              <Form.Select
                                disabled={mode === 0 ? true : false}
                                onChange={handelOnChange}
                                name="emp_status"
                                size="sm"
                              >
                                <option
                                  value="1"
                                  selected={
                                    employeeData.emp_status === 1 && true
                                  }
                                >
                                  Active
                                </option>
                                <option
                                  value="2"
                                  selected={
                                    employeeData.emp_status === 2 && true
                                  }
                                >
                                  Inactive
                                </option>
                              </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Form.Label>Employee Carder</Form.Label>
                              <Form.Select
                                disabled={mode === 0 ? true : false}
                                onChange={handelOnChange}
                                name="emp_status"
                                size="sm"
                              >
                                <option
                                  value="0"
                                  selected={employeeData.carder === 0 && true}
                                >
                                  Intern
                                </option>
                                <option
                                  value="1"
                                  selected={employeeData.carder === 1 && true}
                                >
                                  Contract
                                </option>
                                <option
                                  value="2"
                                  selected={employeeData.carder === 2 && true}
                                >
                                  Permanent
                                </option>
                                <option
                                  value="3"
                                  selected={employeeData.carder === 3 && true}
                                >
                                  Exco
                                </option>
                              </Form.Select>
                            </Form.Group>
                          </Row>
                          <Box
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            {mode === 1 && !loader ? (
                              <Button
                                // color="inherit"
                                onClick={() => handelMode()}
                              >
                                Discard
                              </Button>
                            ) : (
                              ""
                            )}
                            {mode === 1 ? (
                              loader ? (
                                <Spinner animation="border" size="sm" />
                              ) : (
                                <Button
                                  variant="primary"
                                  onClick={handleSubmit}
                                >
                                  Save
                                </Button>
                              )
                            ) : (
                              ""
                            )}
                          </Box>
                        </>
                      )}{" "}
                    </Box>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    Contact Details
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      <Row>
                        <Form.Group as={Col}>
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            disabled={mode === 0 ? true : false}
                            type="text"
                            value={employeeData.email}
                            onChange={(e) => {
                              handelOnChange(e);
                              handleChange(e);
                            }}
                            name="email"
                            isInvalid={!!errors.email}
                            size="sm"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>
                      <Row>
                        <Form.Group as={Col}>
                          <Form.Label>Phone - Official</Form.Label>
                          <Form.Control
                            disabled={mode === 0 ? true : false}
                            type="text"
                            value={employeeData.phone_office}
                            onChange={handelOnChange}
                            name="phone_office"
                            size="sm"
                          />
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label>Phone - Personal</Form.Label>
                          <Form.Control
                            disabled={mode === 0 ? true : false}
                            type="text"
                            value={employeeData.phone_personal}
                            onChange={handelOnChange}
                            name="phone_personal"
                            size="sm"
                          />
                        </Form.Group>
                      </Row>
                      <Row>
                        <Form.Group as={Col}>
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            disabled={mode === 0 ? true : false}
                            type="text"
                            value={employeeData.address}
                            onChange={handelOnChange}
                            name="address"
                            size="sm"
                          />
                        </Form.Group>
                      </Row>
                      <Row>
                        <h3>Emergancy Contact Details</h3>
                      </Row>
                      <Row>
                        <Form.Group as={Col}>
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            disabled={mode === 0 ? true : false}
                            type="text"
                            value={employeeData.emergancy_contact_name}
                            onChange={handelOnChange}
                            name="emergancy_contact_name"
                            size="sm"
                          />
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label>Contact Number</Form.Label>
                          <Form.Control
                            disabled={mode === 0 ? true : false}
                            type="text"
                            value={employeeData.emergancy_contact_number}
                            onChange={handelOnChange}
                            name="emergancy_contact_number"
                            size="sm"
                          />
                        </Form.Group>
                      </Row>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      {mode === 1 && !loader ? (
                        <Button
                          // color="inherit"
                          onClick={() => handelMode()}
                        >
                          Discard
                        </Button>
                      ) : (
                        ""
                      )}
                      {mode === 1 ? (
                        loader ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          <Button variant="secondary" onClick={handleSubmit}>
                            Save
                          </Button>
                        )
                      ) : (
                        ""
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    Personal Details
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      <Row>
                        <Form.Group as={Col}>
                          <Form.Label>NIC</Form.Label>
                          <Form.Control
                            disabled={mode === 0 ? true : false}
                            type="text"
                            defaultValue={employeeData.NIC}
                            onChange={(e) => {
                              handelOnChange(e);
                              handleChange(e);
                            }}
                            name="NIC"
                            isInvalid={!!errors.NIC}
                            size="sm"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.NIC}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label>Birthday</Form.Label>
                          <Form.Control
                            disabled={mode === 0 ? true : false}
                            type="date"
                            value={datForPicker(employeeData.brithDay)}
                            onChange={handelOnChange}
                            name="brithDay"
                            size="sm"
                          />
                        </Form.Group>
                      </Row>
                      <Row>
                        <Form.Group as={Col}>
                          <Form.Label>Nationality</Form.Label>
                          <Form.Control
                            disabled={mode === 0 ? true : false}
                            type="text"
                            value={employeeData.nationality}
                            onChange={handelOnChange}
                            name="nationality"
                            size="sm"
                          />
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label>Religion</Form.Label>
                          <Form.Control
                            disabled={mode === 0 ? true : false}
                            type="text"
                            value={employeeData.riligion}
                            onChange={handelOnChange}
                            name="riligion"
                            size="sm"
                          />
                        </Form.Group>
                      </Row>
                      <Row>
                        <Form.Group as={Col}>
                          <Form.Label>Marital Status</Form.Label>
                          <Form.Select
                            disabled={mode === 0 ? true : false}
                            onChange={handelOnChange}
                            name="marital_status"
                            size="sm"
                          >
                            <option
                              value="0"
                              selected={
                                employeeData.marital_status === 0 && true
                              }
                            >
                              Unmarried
                            </option>
                            <option
                              value="1"
                              selected={
                                employeeData.marital_status === 1 && true
                              }
                            >
                              Married
                            </option>
                          </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col}></Form.Group>
                        <Form.Group as={Col}></Form.Group>
                      </Row>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      {mode === 1 && !loader ? (
                        <Button
                          // color="inherit"
                          onClick={() => handelMode()}
                        >
                          Discard
                        </Button>
                      ) : (
                        ""
                      )}
                      {mode === 1 ? (
                        loader ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          <Button variant="primary" onClick={handleSubmit}>
                            Save
                          </Button>
                        )
                      ) : (
                        ""
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Form>
            </div>
          )}
        </Formik>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            Salary Details
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Formik
                validationSchema={validationSalarySchema}
                initialValues={{
                  basic: salaryDetails?.basic
                }}
                onSubmit={(values) => {
                  handelSalarySubmit();
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
                    <Row>
                      <Form.Group as={Col}>
                        <Form.Label>Basic Salary</Form.Label>
                        <Form.Control
                          disabled={mode === 0 ? true : false}
                          type="text"
                          value={salaryDetails?.basic}
                          // defaultValue={salaryDetails?.basic}
                          onChange={(e) => {
                            handelSalaryOnChange(e);
                            handleChange(e);
                          }}
                          name="basic"
                          isInvalid={!!errors.basic}
                          size="sm"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.basic}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group as={Col}>
                        <Form.Label>Trasport Allawance </Form.Label>
                        <Form.Control
                          disabled={mode === 0 ? true : false}
                          type="text"
                          value={salaryDetails?.transportAllawance}
                          onChange={handelSalaryOnChange}
                          name="transportAllawance"
                          size="sm"
                        />
                      </Form.Group>
                      <Form.Group as={Col}>
                        <Form.Label>Mobile Allawance</Form.Label>
                        <Form.Control
                          disabled={mode === 0 ? true : false}
                          type="text"
                          value={salaryDetails?.mobileAllawance}
                          onChange={handelSalaryOnChange}
                          name="mobileAllawance"
                          size="sm"
                        />
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group as={Col}>
                        <Form.Label>Other Allawances</Form.Label>
                        <Form.Control
                          disabled={mode === 0 ? true : false}
                          type="text"
                          value={salaryDetails?.otherAllawance}
                          onChange={handelSalaryOnChange}
                          name="otherAllawance"
                          size="sm"
                        />
                      </Form.Group>
                      <Form.Group as={Col}>
                        <Form.Label>OT Allawance</Form.Label>
                        <Form.Control
                          disabled={mode === 0 ? true : false}
                          type="text"
                          value={salaryDetails?.OTAllawance}
                          onChange={handelSalaryOnChange}
                          name="OTAllawance"
                          size="sm"
                        />
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group as={Col}>
                        <Form.Label>Gross Salary</Form.Label>
                        <Form.Control
                          type="text"
                          value={salaryDetails?.gross}
                          onChange={handelSalaryOnChange}
                          name="gross"
                          disabled
                          size="sm"
                        />
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group as={Col}>
                        <Form.Label>EPF Employee</Form.Label>
                        <Form.Control
                          type="text"
                          value={salaryDetails?.EPFEmp}
                          onChange={handelSalaryOnChange}
                          name="EPFEmp"
                          disabled
                          size="sm"
                        />
                      </Form.Group>
                      <Form.Group as={Col}>
                        <Form.Label>EPF Company</Form.Label>
                        <Form.Control
                          type="text"
                          value={salaryDetails?.EPFCompany}
                          onChange={handelSalaryOnChange}
                          name="EPFCompany"
                          disabled
                          size="sm"
                        />
                      </Form.Group>
                      <Form.Group as={Col}>
                        <Form.Label>ETF</Form.Label>
                        <Form.Control
                          type="text"
                          value={salaryDetails?.ETF}
                          onChange={handelSalaryOnChange}
                          name="ETF"
                          disabled
                          size="sm"
                        />
                      </Form.Group>
                      <Form.Group as={Col}>
                        <Form.Label>Tax</Form.Label>
                        <Form.Control
                          // disabled
                          type="number"
                          value={salaryDetails?.tax}
                          onChange={handelSalaryOnChange}
                          name="tax"
                          size="sm"
                        />
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group as={Col}>
                        <Form.Label>Net Salary</Form.Label>
                        <Form.Control
                          type="text"
                          value={salaryDetails?.net}
                          onChange={handelSalaryOnChange}
                          name="net"
                          disabled
                          size="sm"
                        />
                      </Form.Group>
                    </Row>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      {mode === 1 && !loader ? (
                        <Button
                          // color="inherit"
                          onClick={() => handelMode()}
                        >
                          Discard
                        </Button>
                      ) : (
                        ""
                      )}
                      {mode === 1 ? (
                        loader ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          <Button variant="secondary" onClick={handleSubmit}>
                            Save
                          </Button>
                        )
                      ) : (
                        ""
                      )}
                    </Box>
                  </Form>
                )}
              </Formik>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            Leave Details
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Form>
                <Row>
                  <Form.Group as={Col}>
                    <Form.Label>Anual Leaves</Form.Label>
                    <Form.Control
                      type="number"
                      value={leaveDetails?.anual}
                      onChange={handelLeaveOnChange}
                      name="anual"
                      disabled
                      size="sm"
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Casual Leaves</Form.Label>
                    <Form.Control
                      type="number"
                      value={leaveDetails?.casual}
                      onChange={handelLeaveOnChange}
                      name="casual"
                      disabled
                      size="sm"
                    />
                  </Form.Group>
                  <Form.Group as={Col}></Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col}>
                    <Form.Label>Medical Leaves</Form.Label>
                    <Form.Control
                      type="number"
                      value={leaveDetails?.medical}
                      onChange={handelLeaveOnChange}
                      name="medical"
                      disabled
                      size="sm"
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Nopay Leaves</Form.Label>
                    <Form.Control
                      type="number"
                      value={leaveDetails?.nopay}
                      onChange={handelLeaveOnChange}
                      name="nopay"
                      disabled
                      size="sm"
                    />
                  </Form.Group>
                  <Form.Group as={Col}></Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col}>
                    <Form.Label>Carryover Leaves</Form.Label>
                    <Form.Control
                      type="number"
                      value={leaveDetails?.carryOver}
                      onChange={handelLeaveOnChange}
                      name="carryOver"
                      disabled={mode === 0 ? true : false}
                      size="sm"
                    />
                  </Form.Group>
                  <Form.Group as={Col}></Form.Group>
                  <Form.Group as={Col}></Form.Group>
                </Row>
              </Form>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {mode === 1 && !loader ? (
                  <Button
                    // color="inherit"
                    onClick={() => handelMode()}
                  >
                    Discard
                  </Button>
                ) : (
                  ""
                )}
                {mode === 1 ? (
                  loader ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <Button variant="secondary" onClick={handelLeaveSubmit}>
                      Finish
                    </Button>
                  )
                ) : (
                  ""
                )}
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </div>
      <Notifications />
    </div>
  );
};

export default EmployeeDetails;
