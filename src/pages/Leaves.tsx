import { useEffect, useState } from "react";
import axios from "axios";

import { MRT_ColumnDef } from "material-react-table";
import { Add } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

import UpdateLeave from "../components/leave-comp/UpdateLeave";
import AddLeave from "../components/leave-comp/AddLeave";
import Table from "../components/Table";
import { useDispatch, useSelector } from "react-redux";
import {
  addAlertDetails,
  addModalTogal,
  setTableLoader
} from "../redux/features/StatusVar";

interface attendanceI {
  employee: any;
  leaveType: number;
  startDate: Date;
  endDate: Date;
  numberofDays: number;
  status: number;
}

const Leaves = () => {
  const [tableData, setTableData] = useState([]);
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
          "https://gg85fw-3000.csb.app/api/leave642c4bd5bac1f5add5d5d3f5"
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

  //defining columns
  const columns: MRT_ColumnDef<attendanceI>[] = [
    {
      header: "Employee",
      accessorKey: "employee.first_name"
    },
    {
      header: "Type",
      accessorKey: "leaveType",
      Cell: ({ cell }) =>
        cell.getValue() === 1
          ? "Anual"
          : cell.getValue() === 2
          ? "Casual"
          : cell.getValue() === 3
          ? "Medical"
          : cell.getValue() === 4
          ? "Nopay"
          : "Carry overs"
    },
    {
      header: "Start",
      accessorKey: "startDate",
      Cell: ({ cell }) => new Date(cell.getValue() as any).toLocaleDateString()
    },
    {
      header: "End",
      accessorKey: "endDate",
      Cell: ({ cell }) => new Date(cell.getValue() as any).toLocaleDateString()
    },
    {
      header: "No of Days",
      accessorKey: "numberofDays"
    },
    {
      header: "Status",
      accessorKey: "status",
      Cell: ({ cell }) => (
        <span
          style={{
            color:
              cell.getValue() === 1
                ? "green"
                : cell.getValue() === 2
                ? "red"
                : ""
          }}
        >
          {cell.getValue() === 0
            ? "Approval Pending"
            : cell.getValue() === 1
            ? "Approved"
            : "Rejected"}
        </span>
      )
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h3>Leaves</h3>
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
          endPoint="/api/leave"
          fileName="Leaves-Data"
        />
      </div>

      <UpdateLeave />
      <AddLeave />
    </div>
  );
};

export default Leaves;
