import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Form, Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addUpdateData } from "../../redux/features/GlobalData";
import {
  addAlertDetails,
  setRefresh,
  updateModalTogal
} from "../../redux/features/StatusVar";
import { Formik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  name: yup.string().required()
});

interface designationI {
  name: string;
  level: string;
  department: any;
}

const UpdateDesignation = ({ deptList }: any) => {
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

  useEffect(() => {
    return () => {
      dispatch(updateModalTogal(false));
      // console.log("hutta")
    };
  }, []);

  // handel submit
  const handleFormSubmit = async () => {
    // console.log(_id);
    // e.preventDefault();
    setLoader(true);
    const passingData = updateDataInitial;
    delete updateDataInitial._id;
    delete updateDataInitial.__v;

    try {
      const responce = await axios.put(
        "https://gg85fw-3000.csb.app/api/designation" + _id,
        passingData
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
        <Modal.Title>Update Designation</Modal.Title>
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
                  // value={updateDataInitial.name}
                  defaultValue={updateDataInitial.name}
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
                  defaultValue={updateDataInitial.level}
                >
                  <option value="0" selected={updateDataInitial.level === 0}>
                    Trainee
                  </option>
                  <option value="1" selected={updateDataInitial.level === 1}>
                    Associate
                  </option>
                  <option value="2" selected={updateDataInitial.level === 2}>
                    Senior
                  </option>
                  <option value="3" selected={updateDataInitial.level === 3}>
                    Manager
                  </option>
                  <option value="4" selected={updateDataInitial.level === 4}>
                    Exco
                  </option>
                </Form.Select>
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
                  defaultValue={updateDataInitial.department?._id}
                >
                  {deptList?.map((dept: any) =>
                    updateDataInitial.department?._id === dept?._id ? (
                      <option value={dept._id} key={dept._id} selected>
                        {dept.name}
                      </option>
                    ) : (
                      <option value={dept._id} key={dept._id}>
                        {dept.name}
                      </option>
                    )
                  )}
                </Form.Select>
              </Form.Group>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => dispatch(updateModalTogal(false))}
                >
                  Close
                </Button>
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                  {loader ? <Spinner animation="border" size="sm" /> : "Update"}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateDesignation;
