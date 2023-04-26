import { useEffect, useState } from "react";
import axios from "axios";
import { ExportToCsv } from "export-to-csv";

import { Modal, Spinner } from "react-bootstrap";
import MaterialReactTable from "material-react-table";
import { Delete, Edit, Download, Visibility } from "@mui/icons-material";
import { IconButton, Tooltip, Button } from "@mui/material";
import { Box } from "@mui/material";

import Notifications from "../components/Notification";
import { useDispatch, useSelector } from "react-redux";
import {
  addAlertDetails,
  deleteModalTogal,
  setRefresh,
  updateModalTogal
} from "../redux/features/StatusVar";
import { addUpdateData } from "../redux/features/GlobalData";
import { CSVLink } from "react-csv";

const Table = ({
  tableData,
  columns = [],
  endPoint,
  isView = false,
  fileName
}: any) => {
  const deleteModal = useSelector(
    (state: any) => state.statusVar.value.deleteModal
  );
  const [deleteId, setDeleteId] = useState("");
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [exportHeaders, setExportHeaders] = useState([]);
  const tableLoader = useSelector(
    (state: any) => state.statusVar.value.tableLoader
  );
  const refreshData = useSelector(
    (state: any) => state.statusVar.value.refreshData
  );

  useEffect(() => {
    const downloadData = columns.map((col: any) => ({
      label: col.header,
      key: col.accessorKey
    }));

    setExportHeaders(downloadData);
    console.log(exportHeaders);
  }, []);

  //edit
  const handeledit = (row: any) => {
    dispatch(addUpdateData(row.original));
    dispatch(updateModalTogal(true));
  };

  //delete
  const handelDelete = (row: any) => {
    dispatch(deleteModalTogal(true));
    setDeleteId(row.original._id);
  };

  const deleteItem = async () => {
    setLoader(true);
    try {
      const responce = await axios.delete(
        "https://gg85fw-3000.csb.app" + endPoint + deleteId
      );

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
          message: "Item deleted successfully!"
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
      dispatch(deleteModalTogal(false));
      setLoader(false);
    }
  };

  return (
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
        data={tableData ?? []}
        state={{ showSkeletons: tableLoader }}
        enableEditing
        // renderTopToolbarCustomActions={({ table }) => (
        //   <Box>
        //     <CSVLink
        //       data={tableData}
        //       headers={exportHeaders}
        //       filename={fileName + ".csv"}
        //       target="_blank"
        //     >
        //       <Tooltip title="Download">
        //         <IconButton>
        //           <Download />
        //         </IconButton>
        //       </Tooltip>
        //     </CSVLink>
        //   </Box>
        // )}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <IconButton onClick={() => handeledit(row)}>
              {isView ? <Visibility /> : <Edit />}
            </IconButton>
            <IconButton onClick={() => handelDelete(row)} color="error">
              <Delete />
            </IconButton>
          </Box>
        )}
      />

      {/* Delete modal */}
      <Modal
        show={deleteModal}
        onHide={() => dispatch(deleteModalTogal(false))}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Are you sure you want to delete this?</h4>
          <span>Deleteing will remove data permanently...</span>
        </Modal.Body>
        <Modal.Footer>
          <Button
            // variant="secondary"
            onClick={() => dispatch(deleteModalTogal(false))}
          >
            Close
          </Button>
          <Button
            // variant="danger"
            type="submit"
            onClick={deleteItem}
          >
            {loader ? <Spinner animation="border" size="sm" /> : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Notifications />
    </div>
  );
};

export default Table;
