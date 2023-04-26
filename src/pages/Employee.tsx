import { useEffect, useState } from "react";
import axios from "axios";

import { MRT_ColumnDef } from "material-react-table";
import { Add, Download, Visibility } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import MaterialReactTable from "material-react-table";

import AddEmployee from "../components/emp-comp/AddEmployee";
import { useDispatch, useSelector } from "react-redux";
import {
  addAlertDetails,
  addModalTogal,
  setTableLoader
} from "../redux/features/StatusVar";
import { Link, useNavigate } from "react-router-dom";
import { ExportToCsv } from "export-to-csv";
import Notifications from "../components/Notification";
import { CSVLink } from "react-csv";

interface empI {
  employee_no: string;
  first_name: string;
  last_name: string;
  designation: string;
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
  joined_date: Date;
  end_date: Date;
  emp_status: string;
  office: any;
  NIC: string;
  nationality: string;
  riligion: string;
  marital_status: number;
}

const Employee = () => {
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
  const tableLoader = useSelector(
    (state: any) => state.statusVar.value.tableLoader
  );
  const [exportHeaders, setExportHeaders] = useState([]);

  const navigate = useNavigate();

  //fetching table data
  useEffect(() => {
    const getData = async () => {
      dispatch(setTableLoader(true));
      try {
        const responce = await axios.get(
          "https://gg85fw-3000.csb.app/api/employee"
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
  const columns: MRT_ColumnDef<empI>[] = [
    {
      header: "Emp No",
      accessorKey: "employee_no"
    },
    {
      header: "First name",
      accessorKey: "first_name"
    },
    {
      header: "Last Name",
      accessorKey: "last_name"
    },
    {
      header: "Designation",
      accessorKey: "designation.name"
    },
    // {
    //   header: "Email",
    //   accessorKey: "email"
    // },
    // {
    //   header: "EPF",
    //   accessorKey: "epf_no"
    // },
    // {
    //   header: "Photo",
    //   accessorKey: "photo"
    // },
    // {
    //   header: "HOD",
    //   accessorKey: "HOD.first_name"
    // },
    {
      header: "department",
      accessorKey: "department.name"
    }
    // {
    //   header: "Phone: office",
    //   accessorKey: "phone_office"
    // },
    // {
    //   header: "Phone: personal",
    //   accessorKey: "phone_personal"
    // },
    // {
    //   header: "Address",
    //   accessorKey: "address"
    // },
    // {
    //   header: "Emg-contact",
    //   accessorKey: "emergancy_contact_name"
    // },
    // {
    //   header: "Emg-number",
    //   accessorKey: "emergancy_contact_number"
    // },
    // {
    //   header: "Joined Date",
    //   accessorKey: "joined_date"
    // },
    // {
    //   header: "End Date",
    //   accessorKey: "end_date"
    // },
    // {
    //   header: "Status",
    //   accessorKey: "emp_status"
    // },
    // {
    //   header: "Office",
    //   accessorKey: "office.name"
    // }
  ];

  useEffect(() => {
    const downloadData = columns.map((col: any) => ({
      label: col.header,
      key: col.accessorKey
    }));

    setExportHeaders(downloadData as any);
  }, []);

  const handelView = (row: any) => {
    console.log(row.original);
    navigate(`/home/employee/${row.original._id}`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h3>Employees</h3>
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
        {!addModal ? (
          <div className="tb">
            <MaterialReactTable
              displayColumnDefOptions={{
                "mrt-row-actions": {
                  muiTableHeadCellProps: {
                    align: "center"
                  },
                  size: 120
                }
              }}
              columns={columns}
              data={tableData}
              state={{ showSkeletons: tableLoader }}
              // enableEditing
              enableRowActions
              renderTopToolbarCustomActions={({ table }) => (
                <Box>
                  <CSVLink
                    data={tableData}
                    headers={exportHeaders}
                    filename={"Employee-data.csv"}
                    target="_blank"
                  >
                    <Tooltip title="Download">
                      <IconButton>
                        <Download />
                      </IconButton>
                    </Tooltip>
                  </CSVLink>
                </Box>
              )}
              renderRowActions={({ row, table }) => (
                <Box
                  sx={{
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "center"
                  }}
                >
                  <IconButton onClick={() => handelView(row)}>
                    <Visibility />
                  </IconButton>
                </Box>
              )}
            />
          </div>
        ) : (
          <AddEmployee empNo={tableData.length + 1} />
        )}
      </div>

      <Notifications />
    </div>
  );
};

export default Employee;
