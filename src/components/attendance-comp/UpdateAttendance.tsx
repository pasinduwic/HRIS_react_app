import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Form, Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addUpdateData } from "../../redux/features/GlobalData";
import moment from "moment";
import {
  addAlertDetails,
  addModalTogal,
  setRefresh,
  updateModalTogal
} from "../../redux/features/StatusVar";
import { ModeComment, MonetizationOn } from "@mui/icons-material";

interface attendanceI {
  employee: any;
  date: any;
  in: string;
  out: string;
}

const UpdateAttendance = (data: any) => {
  const updateModal = useSelector(
    (state: any) => state.statusVar.value.updateModal
  );
  const updateDataInitial = useSelector(
    (state: any) => state.globalData.value.updateData
  );
  const refreshData = useSelector(
    (state: any) => state.statusVar.value.refreshData
  );
  const dispatch = useDispatch();
  const _id = updateDataInitial._id;
  const [loader, setLoader] = useState(false);

  const datForPicker = (date: Date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  useEffect(() => {
    return () => {
      dispatch(updateModalTogal(false));
      // console.log("hutta")
    };
  }, []);
  // handel submit
  const handelSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    const passingData = updateDataInitial;
    delete updateDataInitial._id;
    delete updateDataInitial.__v;
    console.log(passingData);

    try {
      const responce = await axios.put(
        "https://gg85fw-3000.csb.app/api/attendance" + updateDataInitial._id,
        passingData
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
          message: "Item updated successfully!"
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
      dispatch(updateModalTogal(false));
      setLoader(false);
    }
  };

  //handel change
  const handelOnChange = (e: any) => {
    const fieldName: string = e.target.getAttribute("name");
    const fieldValue: string = e.target.value;

    const newData = { ...updateDataInitial };
    newData[fieldName as keyof typeof newData] = fieldValue;

    console.log(newData);
    if (newData.in !== "" && newData.out !== "") {
      const countOT =
        moment(newData.out, "HH:mm:ss").diff(
          moment(newData.in, "HH:mm:ss"),
          "hours"
        ) - 8;

      console.log(countOT);
      // setDateCount(countDays);
      newData.OT = countOT;
    }
    dispatch(addUpdateData(newData));
    console.log(newData);
  };

  return (
    <Modal
      show={updateModal}
      onHide={() => dispatch(updateModalTogal(false))}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Update Office</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Employee Name</Form.Label>
            <Form.Select
              placeholder="Name"
              onChange={handelOnChange}
              name="employee"
              disabled
            >
              <option value={updateDataInitial.employee?._id}>
                {updateDataInitial.employee?.first_name +
                  " " +
                  updateDataInitial.employee?.last_name}
              </option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              placeholder="Location"
              onChange={handelOnChange}
              name="date"
              value={datForPicker(updateDataInitial.date)}
              disabled
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>In</Form.Label>
            <Form.Control
              type="time"
              placeholder="Location"
              onChange={handelOnChange}
              name="in"
              value={updateDataInitial.in}
              disabled
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Out</Form.Label>
            <Form.Control
              type="time"
              placeholder="Location"
              onChange={handelOnChange}
              name="out"
              value={updateDataInitial.out}
            />
          </Form.Group>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => dispatch(updateModalTogal(false))}
            >
              Close
            </Button>
            <Button variant="primary" type="submit" onClick={handelSubmit}>
              {loader ? <Spinner animation="border" size="sm" /> : "Update"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateAttendance;
