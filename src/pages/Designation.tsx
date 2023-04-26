import { useEffect, useState } from "react";
import axios from "axios";

import { MRT_ColumnDef } from "material-react-table";
import { Add } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

import UpdateDesignation from "../components/designation-comp/UpdateDesignation";
import AddDesignation from "../components/designation-comp/AddDesignation";
import Table from "../components/Table";
import { useDispatch, useSelector } from "react-redux";
import {
  addAlertDetails,
  addModalTogal,
  setTableLoader
} from "../redux/features/StatusVar";
import { Link } from "react-router-dom";

interface designationI {
  name: string;
  level: string;
  department: any;
}

const Designation = () => {
  const [tableData, setTableData] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const deleteModal = useSelector(
    (state: any) => state.statusVar.value.deleteModal
  );
  const dispatch = useDispatch();
  const addModal = useSelector((state: any) => state.statusVar.value.addModal);
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
          "https://gg85fw-3000.csb.app/api/designation"
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
          "https://gg85fw-3000.csb.app/api/department"
        );

        setDeptData(responce.data);
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
  const columns: MRT_ColumnDef<designationI>[] = [
    {
      header: "Name",
      accessorKey: "name"
    },
    {
      header: "Level",
      accessorKey: "level",
      Cell: ({ cell }) =>
        cell.getValue() === 0
          ? "Trainee"
          : cell.getValue() === 1
          ? "Associate"
          : cell.getValue() === 2
          ? "Senior"
          : cell.getValue() === 3
          ? "Manager"
          : "Exco"
    },
    {
      header: "Department",
      accessorKey: "department.name"
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h3>Designations</h3>
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
          endPoint="/api/designation"
          fileName="Designation"
        />
      </div>

      <AddDesignation deptList={deptData} />
      <UpdateDesignation deptList={deptData} />
    </div>
  );
};

export default Designation;
