import { useEffect, useState } from "react";
import axios from "axios";

import { MRT_ColumnDef } from "material-react-table";
import { Add } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

import UpdateOffice from "../components/office-comp/UpdateOffice";
import AddOffice from "../components/office-comp/AddOffice";
import Table from "../components/Table";
import { useDispatch, useSelector } from "react-redux";
import {
  addAlertDetails,
  addModalTogal,
  setTableLoader
} from "../redux/features/StatusVar";

interface officeI {
  name: string;
  location: string;
}

const Office = () => {
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
          "https://gg85fw-3000.csb.app/api/office"
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
  const columns: MRT_ColumnDef<officeI>[] = [
    {
      header: "Name",
      accessorKey: "name"
    },
    {
      header: "Location",
      accessorKey: "location"
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h3>Offices</h3>
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
          endPoint="/api/office"
          fileName="Office-data"
        />
      </div>

      <UpdateOffice />
      <AddOffice />
      {/* <Notifications /> */}
    </div>
  );
};

export default Office;
