import { useEffect, useState } from "react";
import axios from "axios";

import { MRT_ColumnDef } from "material-react-table";
import { Add } from "@mui/icons-material";
import { Box, Button, IconButton, Skeleton, Tooltip } from "@mui/material";

import UpdatePayrol from "../components/payrol-comp/UpdatePayrol";
import AddPayrol from "../components/payrol-comp/AddPayrol";
import Table from "../components/Table";
import { useDispatch, useSelector } from "react-redux";
import {
  addAlertDetails,
  addModalTogal,
  setTableLoader,
  updateModalTogal
} from "../redux/features/StatusVar";
import { Link } from "react-router-dom";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { addUpdateData } from "../redux/features/GlobalData";

interface attendanceI {
  employee: any;
  date: Date;
  amount: number;
  amountToEmployee: number;
  amountToEPF: number;
  noypayDeduction: number;
  description: string;
  paiedBy: any;
}
interface empI {
  _id: string;
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
  date: any;
  amount: number;
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

const Payrol = () => {
  const [tableData, setTableData] = useState();
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
  const sessionUser = useSelector(
    (state: any) => state.statusVar.value.sessionUser
  );
  const [mode, setMode] = useState(0);

  //fetching table data
  useEffect(() => {
    dispatch(setTableLoader(true));
    const getData = async () => {
      try {
        const responce = await axios.get(
          "https://gg85fw-3000.csb.app/api/payrol"
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
  }, []);

  const columns: MRT_ColumnDef<addDataI>[] = [
    {
      header: "Employee",
      accessorKey: "employee.first_name"
    },
    {
      header: "Date",
      accessorKey: "date",
      Cell: ({ cell }) => new Date(cell.getValue() as any).toLocaleDateString()
    },
    {
      header: "Amount",
      accessorKey: "amount"
    },
    {
      header: "Month",
      accessorKey: "month",
      Cell: ({ cell }) =>
        cell.getValue() === 1
          ? "January"
          : cell.getValue() === 2
          ? "February"
          : cell.getValue() === 3
          ? "March"
          : cell.getValue() === 4
          ? "April"
          : cell.getValue() === 5
          ? "May"
          : cell.getValue() === 6
          ? "June"
          : cell.getValue() === 7
          ? "July"
          : cell.getValue() === 8
          ? "August"
          : cell.getValue() === 9
          ? "September"
          : cell.getValue() === 10
          ? "October"
          : cell.getValue() === 11
          ? "November"
          : "December"
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h3>Payrol</h3>
        <div style={{ display: "flex" }}>
          <div className="add">
            {!addModal && !updateModal ? (
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
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <div className="page-content">
        {addModal ? (
          <AddPayrol />
        ) : updateModal ? (
          <UpdatePayrol />
        ) : (
          <Table
            tableData={tableData}
            columns={columns}
            endPoint="/api/payrol"
            isView={true}
            fileName="Payrol-data"
          />
          // <></>
        )}
      </div>
    </div>
  );
};

export default Payrol;
