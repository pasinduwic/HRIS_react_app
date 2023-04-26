import axios from "axios";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  IconButton,
  Step,
  StepLabel,
  Stepper
} from "@mui/material";
import { Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addAlertDetails,
  addModalTogal,
  setRefresh,
  updateModalTogal
} from "../../redux/features/StatusVar";
import { Formik } from "formik";
import * as yup from "yup";
import { Close } from "@mui/icons-material";

const validationSchema = yup.object().shape({
  epf_no: yup.number().required("EPF is required!").positive(),
  first_name: yup.string().required("First name is required!"),
  last_name: yup.string().required("Last name is required!"),
  designation: yup.string().required("Designation is required!"),
  department: yup.string().required("Department is required!"),
  office: yup.string().required("Office is required!"),
  HOD: yup.string().required("HOD is required!"),
  joined_date: yup.string().required("Joined date is required!"),
  emp_status: yup.string().required("Employee status is required!"),
  carder: yup.string().required("Employee carder is required!"),
  email: yup.string().required("Email is required!"),
  NIC: yup.string().required("NIC is required!"),
  marital_status: yup.string().required("Marital status is required!")
});
const validationSalarySchema = yup.object().shape({
  basic: yup.number().required("Basic Salary is required!").positive()
});
const validationLeaveSchema = yup.object().shape({
  anual: yup.number().required("Anual leave is required!").positive(),
  casual: yup.number().required("Casual leave is required!").positive(),
  medical: yup.number().required("Medical leave is required!").positive()
});

//types
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
  birthDay: any;
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
}

const AddEmployee = ({ empNo }: any) => {
  const addModal = useSelector((state: any) => state.statusVar.value.addModal);
  const refreshData = useSelector(
    (state: any) => state.statusVar.value.refreshData
  );
  const dispatch = useDispatch();
  const [addData, setAddData] = useState<empI>({
    employee_no: empNo,
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
    birthDay: ""
  });
  const [loader, setLoader] = useState(false);
  const [deptData, setDeptData] = useState([]);
  const [officeData, setOfficeData] = useState([]);
  const [designationData, setDesignationData] = useState([]);
  const [HODData, setHODData] = useState([]);
  const steps = ["Official", "Contact", "Personal"];
  const [activeStep, setActiveStep] = useState(0);
  const [addSalary, setAddSalary] = useState(0);
  const [salaryDetails, setSalaryDetails] = useState<salaryI>();
  const [leaveDetails, setLeaveDetails] = useState<leaveI>();

  //fetching data
  useEffect(() => {
    const getData = async () => {
      try {
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

        //need  check error logics
        setDeptData(responceDept.data);
        setHODData(responceHOD.data);
        setDesignationData(responceDesignation.data);
        setOfficeData(responceOffice.data);
        console.log("addData");
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
    return () => {
      dispatch(addModalTogal(false));
      // console.log("hutta")
    };
  }, []);

  //handel clicks
  const handelNext = () => {
    setActiveStep((pre) => pre + 1);
  };
  const handelBack = () => {
    setActiveStep((pre) => pre - 1);
  };
  const handelClose = () => {
    dispatch(addModalTogal(false));
  };
  const handelSkip = () => setAddSalary(2);

  //handel submit
  const handleFormSubmit = async () => {
    const newAdd = { ...addData, employee_no: empNo };

    // console.log(newAdd);
    setLoader(true);
    try {
      const responce = await axios.post(
        "https://gg85fw-3000.csb.app/api/employee",
        newAdd
      );
      console.log(responce.data);
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

      setLeaveDetails({
        employee: responce.data._id,
        anual: 0,
        casual: 0,
        medical: 0
      } as leaveI);
      setAddSalary(1);
      dispatch(setRefresh(!refreshData));
    } catch (e) {
      console.log(e);

      dispatch(
        addAlertDetails({
          status: true,
          type: "error",
          message: "Something went wrong!"
        })
      );
    } finally {
      // dispatch(addModalTogal(false));
      setLoader(false);
    }
  };
  const handelSalarySubmit = async () => {
    // console.log(addData);
    setLoader(true);
    try {
      const responceSalary = await axios.post(
        "https://gg85fw-3000.csb.app/api/salary",
        salaryDetails
      );
      console.log(responceSalary.data);
      if (responceSalary.data.error) {
        return dispatch(
          addAlertDetails({
            status: true,
            type: "error",
            message: "Something went wrong!"
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
          message: "Item added successfully!"
        })
      );

      setAddSalary(2);
      dispatch(setRefresh(!refreshData));
    } catch (e) {
      console.log(e);

      dispatch(
        addAlertDetails({
          status: true,
          type: "error",
          message: "Something went wrong!"
        })
      );
    } finally {
      // dispatch(addModalTogal(false));
      setLoader(false);
    }
  };
  const handelLeaveSubmit = async () => {
    // console.log(addData);
    setLoader(true);
    try {
      const responceLeave = await axios.post(
        "https://gg85fw-3000.csb.app/api/lvrecords",
        leaveDetails
      );
      console.log(responceLeave.data);
      if (responceLeave.data.error) {
        return dispatch(
          addAlertDetails({
            status: true,
            type: "error",
            message: "Something went wrong!"
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
          message: "Item added successfully!"
        })
      );
      setAddSalary(0);
      dispatch(setRefresh(!refreshData));
    } catch (e) {
      console.log(e);

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

    setAddData(newData as any);
    console.log(newData);
  };
  const handelSalaryOnChange = (e: any) => {
    const fieldName: string = e.target.getAttribute("name");
    const fieldValue: any = e.target.value;
    // console.log(fieldName);
    const newData = { ...salaryDetails };
    newData[fieldName as keyof typeof newData] = fieldValue;
    newData.gross =
      parseInt(newData.basic) +
      parseInt(newData.transportAllawance) +
      parseInt(newData.mobileAllawance) +
      parseInt(newData.otherAllawance);

    //calc epf
    newData.EPFEmp = (parseInt(newData.basic) * 8) / 100;
    newData.EPFCompany = (parseInt(newData.basic) * 12) / 100;
    newData.ETF = (parseInt(newData.basic) * 3) / 100;

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

  return (
    <Card
      sx={{
        margin: " 10px 10px 100px 10px",
        textAlign: "left",
        padding: "20px"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px"
        }}
      >
        <h5
          style={{
            margin: "0"
          }}
        >
          {addSalary === 0
            ? "Add new Employee"
            : addSalary === 1
            ? "New Salary Details"
            : "New Leave Details"}
        </h5>
        <IconButton
          onClick={() => {
            dispatch(addModalTogal(false));
          }}
          // variant="contained"
          sx={{ borderRadius: "50%", border: "1px solid gray" }}
          size="small"
        >
          {" "}
          <Close />
        </IconButton>
      </div>

      {addSalary === 0 ? (
        //employee detailss
        <>
          <Formik
            validationSchema={validationSchema}
            initialValues={{
              first_name: "",
              last_name: "",
              designation: "",
              email: "",
              epf_no: "",
              HOD: "",
              department: "",
              joined_date: "",
              emp_status: "",
              office: "",
              NIC: "",
              marital_status: "",
              carder: "",
              phone_office: "",
              phone_personal: ""
            }}
            onSubmit={(values) => {
              // console.log("received")
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
                <Box>
                  <Row>
                    <h5
                      style={{
                        backgroundColor: "whitesmoke",
                        padding: "6px",
                        marginBottom: "10px"
                      }}
                    >
                      Official Details
                    </h5>
                  </Row>
                  <Row>
                    <Form.Group as={Col}>
                      <Form.Label>Employee Number</Form.Label>
                      <Form.Control
                        type="text"
                        value={empNo}
                        onChange={(e) => {
                          handelOnChange(e);
                          handleChange(e);
                        }}
                        name="employee_no"
                        disabled
                        size="sm"
                        // isInvalid={!!errors.employee_no}
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>EPF Number</Form.Label>
                      <Form.Control
                        type="number"
                        value={addData.epf_no}
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
                            type="text"
                            value={addData.photo}
                            onChange={(e) => {
                              handelOnChange(e);
                              handleChange(e);
                            }}
                            name="photo"
                          />
                        </Form.Group> */}
                  </Row>
                  <Row>
                    <Form.Group as={Col}>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={addData.first_name}
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
                        type="text"
                        value={addData.last_name}
                        onChange={(e) => {
                          handelOnChange(e);
                          handleChange(e);
                        }}
                        name="last_name"
                        size="sm"
                        isInvalid={!!errors.last_name}
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
                        onChange={(e) => {
                          handelOnChange(e);
                          handleChange(e);
                        }}
                        name="designation"
                        size="sm"
                        isInvalid={!!errors.designation}
                        defaultValue={addData.designation}
                      >
                        <option value="null" selected>
                          - Select Item -
                        </option>
                        {designationData.map((desig: any) => (
                          <option value={desig._id} key={desig._id}>
                            {desig.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.designation}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Department</Form.Label>
                      <Form.Select
                        onChange={(e) => {
                          handelOnChange(e);
                          handleChange(e);
                        }}
                        name="department"
                        size="sm"
                        isInvalid={!!errors.department}
                        defaultValue={addData.department}
                      >
                        <option value="null" selected>
                          - Select Item -
                        </option>
                        {deptData.map((dept: any) => (
                          <option value={dept._id} key={dept._id}>
                            {dept.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.department}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col}>
                      <Form.Label>Office Based At</Form.Label>
                      <Form.Select
                        onChange={(e) => {
                          handelOnChange(e);
                          handleChange(e);
                        }}
                        size="sm"
                        name="office"
                        isInvalid={!!errors.office}
                        defaultValue={addData.office}
                      >
                        <option value="null" selected>
                          - Select Item -
                        </option>
                        {officeData.map((office: any) => (
                          <option value={office._id} key={office._id}>
                            {office.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.office}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Reporting Manger</Form.Label>
                      <Form.Select
                        onChange={(e) => {
                          handelOnChange(e);
                          handleChange(e);
                        }}
                        size="sm"
                        name="HOD"
                        isInvalid={!!errors.HOD}
                        defaultValue={addData.HOD}
                      >
                        <option value="null" selected>
                          - Select Item -
                        </option>
                        {HODData.map((HOD: any) => (
                          <option value={HOD._id} key={HOD._id}>
                            {HOD.first_name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.HOD}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col}>
                      <Form.Label>Joined Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={addData.joined_date}
                        onChange={(e) => {
                          handelOnChange(e);
                          handleChange(e);
                        }}
                        size="sm"
                        name="joined_date"
                        isInvalid={!!errors.joined_date}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.joined_date}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Resigned Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={addData.end_date}
                        onChange={(e) => {
                          handelOnChange(e);
                          handleChange(e);
                        }}
                        size="sm"
                        name="end_date"
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Employee Status</Form.Label>
                      <Form.Select
                        onChange={(e) => {
                          handelOnChange(e);
                          handleChange(e);
                        }}
                        size="sm"
                        name="emp_status"
                        isInvalid={!!errors.emp_status}
                      >
                        <option>-- Select item --</option>
                        <option
                          value="1"
                          selected={addData.emp_status === 1 && true}
                        >
                          Active
                        </option>
                        <option
                          value="2"
                          selected={addData.emp_status === 2 && true}
                        >
                          Inactive
                        </option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.emp_status}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Employee Carder</Form.Label>
                      <Form.Select
                        onChange={(e) => {
                          handelOnChange(e);
                          handleChange(e);
                        }}
                        size="sm"
                        name="carder"
                        isInvalid={!!errors.carder}
                      >
                        <option value="null" selected>
                          - Select Item -
                        </option>
                        <option value="0">Intern</option>
                        <option value="1">Contract</option>
                        <option value="2">Permanent</option>
                        <option value="3">Exco</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.carder}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  {/* </Form> */}
                </Box>

                <Box>
                  {/* <Form> */}
                  <Row>
                    <Form.Group as={Col}>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={addData.email}
                        onChange={(e) => {
                          handelOnChange(e);
                          handleChange(e);
                        }}
                        size="sm"
                        name="email"
                        isInvalid={!!errors.email}
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
                        type="number"
                        value={addData.phone_office}
                        onChange={(e) => {
                          handelOnChange(e);
                          handleChange(e);
                        }}
                        size="sm"
                        name="phone_office"
                        isInvalid={!!errors.phone_office}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone_office}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Phone - Personal</Form.Label>
                      <Form.Control
                        type="number"
                        value={addData.phone_personal}
                        onChange={(e) => {
                          handelOnChange(e);
                          handleChange(e);
                        }}
                        size="sm"
                        name="phone_personal"
                        isInvalid={!!errors.phone_personal}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone_personal}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col}>
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        value={addData.address}
                        onChange={(e) => {
                          handelOnChange(e);
                          handleChange(e);
                        }}
                        size="sm"
                        name="address"
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <h5
                      style={{
                        backgroundColor: "whitesmoke",
                        padding: "6px",
                        margin: "8px 0"
                      }}
                    >
                      Emergancy Contact Details
                    </h5>
                  </Row>
                  <Row>
                    <Form.Group as={Col}>
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={addData.emergancy_contact_name}
                        onChange={(e) => {
                          handelOnChange(e);
                          handleChange(e);
                        }}
                        size="sm"
                        name="emergancy_contact_name"
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Contact Number</Form.Label>
                      <Form.Control
                        type="number"
                        value={addData.emergancy_contact_number}
                        onChange={(e) => {
                          handelOnChange(e);
                          handleChange(e);
                        }}
                        size="sm"
                        name="emergancy_contact_number"
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <h5
                      style={{
                        backgroundColor: "whitesmoke",
                        padding: "6px",
                        margin: "8px 0"
                      }}
                    >
                      Personal Details
                    </h5>
                  </Row>
                </Box>

                <Box>
                  {/* <Form> */}
                  <Row>
                    <Form.Group as={Col}>
                      <Form.Label>NIC</Form.Label>
                      <Form.Control
                        type="text"
                        value={addData.NIC}
                        onChange={(e) => {
                          handelOnChange(e);
                          handleChange(e);
                        }}
                        size="sm"
                        name="NIC"
                        isInvalid={!!errors.NIC}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.NIC}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>BirthDay</Form.Label>
                      <Form.Control
                        type="date"
                        value={addData.birthDay}
                        onChange={(e) => {
                          handelOnChange(e);
                          handleChange(e);
                        }}
                        size="sm"
                        name="brithDay"
                        isInvalid={!!errors.brithDay}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.brithDay}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col}>
                      <Form.Label>Nationality</Form.Label>
                      <Form.Control
                        type="text"
                        value={addData.nationality}
                        onChange={(e) => {
                          handelOnChange(e);
                          handleChange(e);
                        }}
                        size="sm"
                        name="nationality"
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Religion</Form.Label>
                      <Form.Control
                        type="text"
                        value={addData.riligion}
                        onChange={(e) => {
                          handelOnChange(e);
                          handleChange(e);
                        }}
                        size="sm"
                        name="riligion"
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col}>
                      <Form.Label>Marital Status</Form.Label>
                      <Form.Select
                        onChange={(e) => {
                          handelOnChange(e);
                          handleChange(e);
                        }}
                        size="sm"
                        name="marital_status"
                        isInvalid={!!errors.marital_status}
                      >
                        <option>-- Select item --</option>
                        <option value="0">Unmarried</option>
                        <option value="1">Married</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.marital_status}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                    <Form.Group as={Col}></Form.Group>
                  </Row>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="primary" onClick={handleSubmit}>
                    {loader ? <Spinner animation="border" size="sm" /> : "Save"}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </>
      ) : addSalary === 1 ? (
        //salary details
        <Box>
          <Formik
            validationSchema={validationSalarySchema}
            initialValues={{
              basic: ""
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
                      type="number"
                      value={salaryDetails?.basic}
                      onChange={(e) => {
                        handelSalaryOnChange(e);
                        handleChange(e);
                      }}
                      size="sm"
                      name="basic"
                      isInvalid={!!errors.basic}
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
                      type="number"
                      value={salaryDetails?.transportAllawance}
                      onChange={handelSalaryOnChange}
                      size="sm"
                      name="transportAllawance"
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Mobile Allawance</Form.Label>
                    <Form.Control
                      type="number"
                      value={salaryDetails?.mobileAllawance}
                      onChange={handelSalaryOnChange}
                      size="sm"
                      name="mobileAllawance"
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col}>
                    <Form.Label>Other Allawances</Form.Label>
                    <Form.Control
                      type="number"
                      value={salaryDetails?.otherAllawance}
                      onChange={handelSalaryOnChange}
                      size="sm"
                      name="otherAllawance"
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>OT Allawance</Form.Label>
                    <Form.Control
                      type="number"
                      value={salaryDetails?.OTAllawance}
                      onChange={handelSalaryOnChange}
                      size="sm"
                      name="OTAllawance"
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col}>
                    <Form.Label>Gross Salary</Form.Label>
                    <Form.Control
                      type="number"
                      value={salaryDetails?.gross}
                      onChange={handelSalaryOnChange}
                      size="sm"
                      name="gross"
                      disabled
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col}>
                    <Form.Label>EPF Employee</Form.Label>
                    <Form.Control
                      type="number"
                      value={salaryDetails?.EPFEmp}
                      onChange={handelSalaryOnChange}
                      size="sm"
                      name="EPFEmp"
                      disabled
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>EPF Company</Form.Label>
                    <Form.Control
                      type="number"
                      value={salaryDetails?.EPFCompany}
                      onChange={handelSalaryOnChange}
                      size="sm"
                      name="EPFCompany"
                      disabled
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>ETF</Form.Label>
                    <Form.Control
                      type="number"
                      value={salaryDetails?.ETF}
                      onChange={handelSalaryOnChange}
                      size="sm"
                      name="ETF"
                      disabled
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col}>
                    <Form.Label>Tax</Form.Label>
                    <Form.Control
                      type="number"
                      // value={salaryDetails?.tax}
                      onChange={handelSalaryOnChange}
                      size="sm"
                      name="tax"
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Net Salary</Form.Label>
                    <Form.Control
                      type="number"
                      value={salaryDetails?.net}
                      onChange={handelSalaryOnChange}
                      size="sm"
                      name="net"
                      disabled
                    />
                  </Form.Group>
                </Row>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    variant="secondary"
                    onClick={addSalary === 1 ? handelSkip : handelClose}
                  >
                    Skip
                  </Button>
                  <Button variant="primary" onClick={handleSubmit}>
                    {loader ? <Spinner animation="border" size="sm" /> : "Save"}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      ) : (
        //leave details
        <Box>
          <Formik
            validationSchema={validationLeaveSchema}
            initialValues={{
              anual: "",
              casual: "",
              medical: ""
            }}
            onSubmit={(values) => {
              handelLeaveSubmit();
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
                    <Form.Label>Anual Leaves</Form.Label>
                    <Form.Control
                      type="number"
                      value={leaveDetails?.anual}
                      onChange={(e) => {
                        handelLeaveOnChange(e);
                        handleChange(e);
                      }}
                      size="sm"
                      name="anual"
                      isInvalid={!!errors.anual}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.anual}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col}>
                    <Form.Label>Casual Leaves</Form.Label>
                    <Form.Control
                      type="number"
                      value={leaveDetails?.casual}
                      onChange={(e) => {
                        handelLeaveOnChange(e);
                        handleChange(e);
                      }}
                      size="sm"
                      name="casual"
                      isInvalid={!!errors.casual}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.casual}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col}>
                    <Form.Label>Medical Leaves</Form.Label>
                    <Form.Control
                      type="number"
                      value={leaveDetails?.medical}
                      onChange={(e) => {
                        handelLeaveOnChange(e);
                        handleChange(e);
                      }}
                      size="sm"
                      name="medical"
                      isInvalid={!!errors.medical}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.medical}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ color: "red", fontSize: "0.8rem" }}>
                      No update option available for leave details! we request
                      you to initialize details at this satege!
                    </p>
                  </div>
                  <Button variant="primary" onClick={handleSubmit}>
                    {loader ? <Spinner animation="border" size="sm" /> : "Save"}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      )}
    </Card>
  );
};

export default AddEmployee;
