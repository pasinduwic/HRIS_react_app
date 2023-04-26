import DashboardCards from "../components/DashboardCards";
import employeeImg from "../images/emp1.png";
import deptImg from "../images/dept1.jpg";
import presenceImg from "../images/present1.jpg";
import absentImg from "../images/absent2.jpg";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { addAlertDetails } from "../redux/features/StatusVar";
import { useDispatch } from "react-redux";
import moment from "moment";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [employeeData, setEmployeeData] = useState([]);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);
  const [deptCount, setDeptCount] = useState(0);

  //fetching table data
  useEffect(() => {
    const getData = async () => {
      try {
        const responce = await axios.get(
          "https://gg85fw-3000.csb.app/api/employee"
        );
        if (responce.data.error) {
          dispatch(
            addAlertDetails({
              status: true,
              type: "error",
              message: "failed to load employee data!"
            })
          );
        } else {
          setEmployeeData(responce.data);

          // const Blist = responce.data.filter((emp: any) => (

          // ))
        }

        const responceDept = await axios.get(
          "https://gg85fw-3000.csb.app/api/department"
        );

        const responceAttendance = await axios.get(
          "https://gg85fw-3000.csb.app/api/attendance"
        );
        const responceLeave = await axios.get(
          "https://gg85fw-3000.csb.app/api/leave"
        );

        // console.log(responce);
        // console.log(responceDept);
        // console.log(responceAttendance);
        // console.log(responceLeave);
        if (responceDept.data.error) {
          dispatch(
            addAlertDetails({
              status: true,
              type: "error",
              message: "failed to load departments!"
            })
          );
        } else {
          setDeptCount(responceDept.data.length);
        }
        if (responceAttendance.data.error) {
          dispatch(
            addAlertDetails({
              status: true,
              type: "error",
              message: "failed to load attendance!"
            })
          );
        } else {
          let attCount = 0;

          responceAttendance.data.map((att: any) => {
            console.log(moment(att.date).format("YYYY-MM-DD"));
            if (
              moment(att.date).format("YYYY-MM-DD") ===
              moment(new Date()).format("YYYY-MM-DD")
            ) {
              attCount += 1;
            }
          });
          // console.log(moment(new Date()).format("YYYY-MM-DD"));
          setAttendanceCount(attCount);
        }
        if (responceLeave.data.error) {
          dispatch(
            addAlertDetails({
              status: true,
              type: "error",
              message: "failed to load leave!"
            })
          );
        } else {
          let lvCount = 0;

          responceLeave.data.map((leave: any) => {
            if (
              moment(leave.startDate).format("YYYY-MM-DD") ===
              moment(new Date()).format("YYYY-MM-DD")
            ) {
              lvCount += 1;
            } else if (
              moment(new Date()).isBetween(
                moment(leave.startDate).format("YYYY-MM-DD"),
                moment(leave.endDate).format("YYYY-MM-DD")
              )
            ) {
              lvCount += 1;
            }
          });
          setLeaveCount(lvCount);
        }
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
  return (
    <div className="dashboard page-container">
      <div className="page-header">
        <h3>Dasboard</h3>
      </div>

      <div className="page-content">
        <div className="cards">
          <DashboardCards
            value={employeeData?.length}
            name={"Total Employees"}
            image={employeeImg}
          />
          <DashboardCards
            value={deptCount}
            name={"Total Departments"}
            image={deptImg}
          />
          <DashboardCards
            value={attendanceCount}
            name={"Presence Today"}
            image={presenceImg}
          />
          <DashboardCards
            value={leaveCount}
            name={"On Leaves Today"}
            image={absentImg}
          />
        </div>
        <div className="cards"></div>

        <div className="dashboard-lower">
          <div className="shortcut-container">
            <Card className="short-cuts">
              <CardHeader title="Shortcuts" />
              <CardContent>
                <Box className="shortcut-box">
                  <Paper elevation={3} className="shortcut-paper">
                    <IconButton
                      onClick={() => navigate("/home/employee")}
                      // variant="contained"
                      sx={{ border: "1px solid gray" }}
                      size="medium"
                    >
                      {" "}
                      <Add />
                    </IconButton>
                    <Typography variant="subtitle2">Add Employee</Typography>
                  </Paper>
                  <Paper elevation={3} className="shortcut-paper">
                    <IconButton
                      onClick={() => navigate("/home/employee")}
                      // variant="contained"
                      sx={{ border: "1px solid gray" }}
                      size="medium"
                    >
                      {" "}
                      <Add />
                    </IconButton>
                    <Typography variant="subtitle2">Add Leave</Typography>
                  </Paper>
                  <Paper elevation={3} className="shortcut-paper">
                    <IconButton
                      onClick={() => navigate("/home/employee")}
                      // variant="contained"
                      sx={{ border: "1px solid gray" }}
                      size="medium"
                    >
                      {" "}
                      <Add />
                    </IconButton>
                    <Typography variant="subtitle2">Add Attendance</Typography>
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          </div>
          <div className="updates">
            <Card>
              <CardHeader title="Updates" />
              <CardContent>
                <Box className="box">
                  <List>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src={employeeImg} />
                      </ListItemAvatar>
                      <ListItemText
                        primary="EMployee Name"
                        secondary="bday date"
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </List>
                </Box>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
