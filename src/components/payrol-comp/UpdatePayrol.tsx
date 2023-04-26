import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Button, Card, IconButton, Skeleton } from "@mui/material";
import { Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addAlertDetails,
  addModalTogal,
  setTableLoader,
  updateModalTogal
} from "../../redux/features/StatusVar";
import { Close } from "@mui/icons-material";
import moment from "moment";

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
  otAmount: number;
}
interface addDataI {
  EPFCompany: number;
  EPFEmp: number;
  ETF: number;
  OTAllawance: number;
  basic: number;
  employee: any;
  gross: number;
  mobileAllawance: number;
  amountToEmployee: number;
  otherAllawance: number;
  transportAllawance: number;
  tax: number;
  otAmount: number;
  nopay: number;
  month: number;
  paidBy: any;
  description: string;
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

const UpdatePayrol = ({ empList }: any) => {
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState();
  const [salaryData, setSalaryData] = useState<salaryI>();
  const [loader, setLoader] = useState(false);
  const [leaveData, setLeaveData] = useState<leaveI>();
  const noPayRate = 12;
  const deleteModal = useSelector(
    (state: any) => state.statusVar.value.deleteModal
  );
  const dispatch = useDispatch();
  const addModal = useSelector((state: any) => state.statusVar.value.addModal);
  const updateModal = useSelector(
    (state: any) => state.statusVar.value.updateModal
  );
  const sessionUser = useSelector(
    (state: any) => state.statusVar.value.sessionUser
  );
  const [addData, setAddData] = useState<addDataI>({
    paidBy: sessionUser?._id
  } as any);
  const updateDataInitial = useSelector(
    (state: any) => state.globalData.value.updateData
  );
  const [formLoader, setFormLoader] = useState(true);
  const [finishCalculation, setFinishCalculation] = useState(false);

  //fetching table data
  useEffect(() => {
    setFormLoader(true);
    // const getData = async () => {
    //   try {
    //     const responceEmp = await axios.get(
    //       "https://gg85fw-3000.csb.app/api/employee"
    //     );

    //     setEmployeeData(responceEmp.data);
    //     setFormLoader(false);
    //   } catch (e) {
    //     dispatch(
    //       addAlertDetails({
    //         status: true,
    //         type: "error",
    //         message: "failed to load data!"
    //       })
    //     );
    //   }
    // };
    // getData();
    return () => {
      dispatch(addModalTogal(false));
      dispatch(updateModalTogal(false));
      // console.log("hutta")
    };
  }, []);

  //calculate
  const handelCalculate = async () => {
    // console.log(selectedEmployeeData);
    // setFinishCalculation(false)
    setLoader(true);
    try {
      const responceSalary = await axios.get(
        "https://gg85fw-3000.csb.app/api/salary" + selectedEmployeeData
      );

      setSalaryData(responceSalary.data);

      const responceLeave = await axios.get(
        "https://gg85fw-3000.csb.app/api/lvrecords" + selectedEmployeeData
      );
      const responceAttendance = await axios.get(
        "https://gg85fw-3000.csb.app/api/attendance" + selectedEmployeeData
      );
      // await setLeaveData(responceLeave.data);
      const newLeaveData = responceLeave.data;
      const newSalaryData = responceSalary.data;
      // console.log(addData);

      const attendanceData = responceAttendance.data.filter(
        (data: any) => data.month === 4
      );
      let otCount = 0;
      if (addData?.month !== 0 && attendanceData.length !== addData?.month) {
        attendanceData.map((atte: any) => (otCount += atte.OT));
        // console.log(otCount);
      }

      // console.log(leaveData);
      // console.log(addData);
      const salaryEdited = Object.assign({}, responceSalary.data);

      delete salaryEdited._id;
      delete salaryEdited.__v;
      // delete salaryEdited.net;
      // delete salaryEdited.OTAllawance
      salaryEdited["OTCount"] = otCount;
      salaryEdited["otAmount"] =
        salaryEdited?.OTCount * newSalaryData?.OTAllawance;
      salaryEdited["nopay"] = noPayRate * newLeaveData?.nopay;
      salaryEdited["gross"] = newSalaryData?.gross + salaryEdited?.otAmount;
      salaryEdited["amountToEmployee"] =
        salaryEdited?.gross -
        salaryEdited?.EPFEmp -
        salaryEdited?.nopay -
        salaryEdited?.tax;
      salaryEdited["amount"] =
        salaryEdited?.amountToEmployee +
        newSalaryData?.ETF +
        newSalaryData?.EPFCompany;

      console.log(salaryEdited);
      setAddData((pre: any) => ({ ...pre, ...salaryEdited }));
      console.log(addData);
      setFinishCalculation(true);

      // console.log(responceLeave.data);
    } catch (e) {
      dispatch(
        addAlertDetails({
          status: true,
          type: "error",
          message: "failed to load data!"
        })
      );
    } finally {
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

  const handelSubmit = async () => {
    console.log(addData);
    setLoader(true);
    try {
      const responce = await axios.post(
        "https://gg85fw-3000.csb.app/api/payrol",
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

  const datForPicker = (date: Date) => {
    return moment(date).format("YYYY-MM-DD");
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
        <h3>Payrol Details</h3>
        <IconButton
          onClick={() => {
            dispatch(addModalTogal(false));
            dispatch(updateModalTogal(false));
          }}
          // variant="contained"
          sx={{ borderRadius: "50%", border: "1px solid gray" }}
          size="small"
        >
          {" "}
          <Close />
        </IconButton>
      </div>

      <Form>
        <>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Employee</Form.Label>

                <Form.Select
                  placeholder="Location"
                  onChange={(e: any) => {
                    setSelectedEmployeeData(e.target.value);
                    handelOnChange(e);
                  }}
                  name="employee"
                  size="sm"
                  disabled
                >
                  <option>{updateDataInitial.employee.first_name}</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col></Col>
          </Row>
          <Row style={{ marginBottom: "20px" }}>
            <Form.Group as={Col}>
              <Form.Label>Payrol Type</Form.Label>
              <Form.Select
                placeholder="Location"
                onChange={handelOnChange}
                name="payType"
                size="sm"
                disabled
              >
                <option value="1" selected={updateDataInitial.payrolType === 1}>
                  Salary
                </option>
                <option value="2" selected={updateDataInitial.payrolType === 2}>
                  Other
                </option>
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="amount"
                onChange={handelOnChange}
                name="date"
                size="sm"
                disabled
                //need toadd date formating
                value={datForPicker(updateDataInitial.date)}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Month</Form.Label>
              <Form.Select
                placeholder="Location"
                onChange={handelOnChange}
                name="month"
                size="sm"
                disabled
              >
                <option value={1} selected={updateDataInitial.month === 1}>
                  January
                </option>
                <option value={2} selected={updateDataInitial.month === 2}>
                  February
                </option>
                <option value={3} selected={updateDataInitial.month === 3}>
                  March
                </option>
                <option value={4} selected={updateDataInitial.month === 4}>
                  April
                </option>
                <option value={5} selected={updateDataInitial.month === 5}>
                  May
                </option>
                <option value={6} selected={updateDataInitial.month === 6}>
                  June
                </option>
                <option value={7} selected={updateDataInitial.month === 7}>
                  July
                </option>
                <option value={8} selected={updateDataInitial.month === 8}>
                  August
                </option>
                <option value={9} selected={updateDataInitial.month === 9}>
                  September
                </option>
                <option value={10} selected={updateDataInitial.month === 10}>
                  October
                </option>
                <option value={11} selected={updateDataInitial.month === 11}>
                  November
                </option>
                <option value={12} selected={updateDataInitial.month === 12}>
                  December
                </option>
              </Form.Select>
            </Form.Group>
          </Row>
        </>

        {/* salary */}

        <>
          <Row>
            <h5 style={{ marginBottom: "20px" }}>Salary</h5>
            <Col>
              <Form.Group>
                <Form.Label>Basic Salary</Form.Label>
                <Form.Control
                  type="number"
                  onChange={handelOnChange}
                  name="basic"
                  value={updateDataInitial?.net}
                  disabled
                  size="sm"
                />
              </Form.Group>
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-end",
                padding: "0 20px"
              }}
            ></Col>
          </Row>
          {/* ot */}
          <Row>
            {/* FROM  SALARY */}
            <Form.Group as={Col}>
              <Form.Label>OT (Addition)</Form.Label>
              <Form.Control
                type="number"
                placeholder="amount"
                onChange={handelOnChange}
                name="otAmount"
                value={updateDataInitial?.otAmount}
                disabled
                size="sm"
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Nopay (Deduction)</Form.Label>
              <Form.Control
                type="number"
                placeholder="amount"
                onChange={handelOnChange}
                name="otTime"
                value={updateDataInitial?.nopay}
                disabled
                size="sm"
              />
            </Form.Group>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Amount to employee</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="amount"
                  onChange={handelOnChange}
                  name="amountToEmployee"
                  value={updateDataInitial?.amountToEmployee}
                  disabled
                  size="sm"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Amount by company</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="amount"
                  onChange={handelOnChange}
                  name="amountByCompany"
                  value={updateDataInitial?.amountByCompany}
                  disabled
                  size="sm"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Total Payment</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="amount"
                  onChange={handelOnChange}
                  name="amount"
                  value={updateDataInitial?.amount}
                  disabled
                  size="sm"
                />
              </Form.Group>
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={updateDataInitial?.description}
                onChange={handelOnChange}
                size="sm"
                disabled
              />
            </Form.Group>
            <Col>
              <Form.Group style={{ marginTop: "40px" }}>
                <Form.Label>Paid By</Form.Label>
                <Form.Control
                  name="paiedBy"
                  value={updateDataInitial?.paidBy.displayName}
                  disabled
                  size="sm"
                />
              </Form.Group>
            </Col>
          </Row>
        </>
      </Form>
    </Card>
  );
};

export default UpdatePayrol;
