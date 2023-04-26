import { useEffect, useState } from "react";
import axios from "axios";

import { MRT_ColumnDef } from "material-react-table";
import { Add } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

import UpdateOffice from "../components/office-comp/UpdateOffice";
import AddAttendance from "../components/attendance-comp/AddAttendance";
import UpdateAttendance from "../components/attendance-comp/UpdateAttendance";
import Table from "../components/Table";
import { useDispatch, useSelector } from "react-redux";
import {
  addAlertDetails,
  addModalTogal,
  setTableLoader
} from "../redux/features/StatusVar";

//Date Picker Imports
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Link } from "react-router-dom";

interface attendanceI {
  employee: any;
  date: Date;
  in: string;
  out: string;
  OT: number;
}

const Attendance = () => {
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
  const [employeeList, setEmployeeList] = useState([]);

  //fetching table data
  useEffect(() => {
    dispatch(setTableLoader(true));
    const getData = async () => {
      try {
        const responce = await axios.get(
          "https://gg85fw-3000.csb.app/api/attendance"
        );

        setTableData(responce.data);
        dispatch(setTableLoader(false));
        console.log(responce.data);
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
    const getemployeeList = async () => {
      try {
        const responce = await axios.get(
          "https://gg85fw-3000.csb.app/api/employee"
        );
        // console.log(responce.data);

        setEmployeeList(responce.data);
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
    getemployeeList();
  }, []);

  //defining columns
  const columns: MRT_ColumnDef<attendanceI>[] = [
    {
      header: "Employee",
      accessorKey: "employee.first_name"
    },
    {
      header: "Date",
      // accessorFn: (row) => new Date(row.date),
      accessorKey: "date",
      Cell: ({ cell }) => new Date(cell.getValue() as any).toLocaleDateString()
      // Filter: ({ column }) => (
      //   <LocalizationProvider dateAdapter={AdapterDayjs}>
      //     <DatePicker
      //       onChange={(newValue: any) => {
      //         column.setFilterValue(newValue);
      //       }}
      //       slotProps={{
      //         textField: {
      //           helperText: 'Filter Mode: Less Than',
      //           sx: { minWidth: '120px' },
      //           variant: 'standard',
      //         },
      //       }}
      //       value={column.getFilterValue()}
      //     />
      //   </LocalizationProvider>
      // ),
    },
    {
      header: "In",
      accessorKey: "in"
    },
    {
      header: "Out",
      accessorKey: "out"
    },
    {
      header: "OT (hrs)",
      accessorKey: "OT"
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h3>Attendance</h3>
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
          endPoint="/api/attendance"
          fileName="Attendance"
        />
      </div>

      <UpdateAttendance />
      <AddAttendance employeeList={employeeList} />
    </div>
  );
};

export default Attendance;
