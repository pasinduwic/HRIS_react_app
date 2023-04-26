import { useEffect, useState } from "react";
import axios from "axios";

import { MRT_ColumnDef } from "material-react-table";
import { Add } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

import UpdateDepartent from "../components/dept-comp/UpdateDept";
import AddDepartment from "../components/dept-comp/AddDept";
import Table from "../components/Table";
import { useDispatch, useSelector } from "react-redux";
import {
  addAlertDetails,
  addModalTogal,
  setTableLoader
} from "../redux/features/StatusVar";
import { Link } from "react-router-dom";

interface deptI {
  name: string;
  office: any;
}

const Department = () => {
  const [tableData, setTableData] = useState([]);
  const [officeData, setOfficeData] = useState([]);
  const deleteModal = useSelector(
    (state: any) => state.statusVar.value.deleteModal
  );
  const dispatch = useDispatch();
  const refreshData = useSelector(
    (state: any) => state.statusVar.value.refreshData
  );
  const updateModal = useSelector(
    (state: any) => state.statusVar.value.updateModal
  );

  //fetching table data
  useEffect(() => {
    dispatch(setTableLoader(true));
    const getData = async () => {
      try {
        const responce = await axios.get(
          "https://gg85fw-3000.csb.app/api/department"
        );

        setTableData(responce.data);
        dispatch(setTableLoader(false));
        // console.log(tableData);
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
  }, [refreshData]);

  useEffect(() => {
    const getOfficeData = async () => {
      try {
        const responce = await axios.get(
          "https://gg85fw-3000.csb.app/api/office"
        );

        setOfficeData(responce.data);
        // console.log(tableData);
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
    getOfficeData();
  }, []);

  //defining columns
  const columns: MRT_ColumnDef<deptI>[] = [
    {
      header: "Name",
      accessorKey: "name"
    },
    {
      header: "Office",
      accessorKey: "office.name"
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h3>Departments</h3>
        <div style={{ display: "flex" }}>
          <div className="add">
            <Tooltip title="Add Item">
              <IconButton
                onClick={() => dispatch(addModalTogal(true))}
                // variant="contained"
                sx={{ border: "1px solid gray" }}
                size="medium"
              >
                {" "}
                <Add />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="page-content">
        <Table
          tableData={tableData}
          columns={columns}
          endPoint="/api/department"
          fileName="Departments"
        />
      </div>

      <UpdateDepartent officeList={officeData} />
      <AddDepartment officeList={officeData} />
    </div>
  );
};

export default Department;
