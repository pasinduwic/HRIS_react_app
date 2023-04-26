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
import { Formik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  name: yup.string().required(),
  level: yup.string().required(),
  department: yup.string().required()
});

interface designationI {
  name: string;
  level: string;
  department: any;
}

const AddDesignation = ({ deptList }: any) => {
  const addModal = useSelector((state: any) => state.statusVar.value.addModal);
  const refreshData = useSelector(
    (state: any) => state.statusVar.value.refreshData
  );
  const dispatch = useDispatch();
  const [addData, setAddData] = useState<designationI>();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(addModalTogal(false));
      // console.log("hutta")
    };
  }, []);
  //handel submit
  const handleFormSubmit = async () => {
    // e.preventDefault();
    setLoader(true);
    try {
      const responce = await axios.post(
        "https://gg85fw-3000.csb.app/api/designation",
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

    setAddData(newData as departmenI);
  };

  return (
    <Modal
      show={addModal}
      onHide={() => dispatch(addModalTogal(false))}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Designation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            name: "",
            office: ""
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
                <Form.Label>Designation Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  onChange={(e) => {
                    handelOnChange(e);
                    handleChange(e);
                  }}
                  name="name"
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Level</Form.Label>
                <Form.Select
                  placeholder="Location"
                  onChange={(e) => {
                    handelOnChange(e);
                    handleChange(e);
                  }}
                  name="level"
                  isInvalid={!!errors.level}
                >
                  <option>-- Select Item --</option>
                  <option value="0">Trainee</option>
                  <option value="1">Associate</option>
                  <option value="2">Senior</option>
                  <option value="3">Manager</option>
                  <option value="4">Exco</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.level}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Department</Form.Label>
                <Form.Select
                  placeholder="Location"
                  onChange={(e) => {
                    handelOnChange(e);
                    handleChange(e);
                  }}
                  name="department"
                  isInvalid={!!errors.department}
                >
                  <option value="4">- Select Item -</option>
                  {deptList.map((dept: any) => (
                    <option value={dept._id} key={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.department}
                </Form.Control.Feedback>
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

export default AddDesignation;
