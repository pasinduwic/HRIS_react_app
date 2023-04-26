import { Offcanvas } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addSidebarOpen } from "../redux/features/StatusVar";
import ManuItems from "./ManuItems";
import {
  FaChartBar,
  FaUsers,
  FaUser,
  FaClipboardCheck,
  FaBed,
  FaCoins,
  FaWrench,
  FaBuilding
} from "react-icons/fa";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import profileImg from "../images/profile.png";
import { Tooltip } from "@mui/material";

const Sidebar = () => {
  const isSidebarOpen = useSelector(
    (state: any) => state.statusVar.value.sidebarOpen
  );
  const dispatch = useDispatch();

  const handeClose = () => {
    dispatch(addSidebarOpen(false));
  };
  const sessionUser = useSelector(
    (state: any) => state.statusVar.value.sessionUser
  );
  const screenSize = useSelector(
    (state: any) => state.statusVar.value.screenSize
  );
  return (
    <div className="sidebar">
      <div
        className="user-info"
        style={{
          padding: "10px",
          display: "flex",
          margin: "10px 20px 20px 10px",
          // gap: "40px",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 .5rem 1rem rgba(0,0,0,.45)"
        }}
      >
        <img
          src={sessionUser ? sessionUser.imagePath : profileImg}
          alt=""
          style={{ width: "40px", borderRadius: "50%", height: "40px" }}
        />
        <p style={{ fontSize: "0.6rem", margin: "0" }}>
          | C O M P A N Y |{sessionUser?.displayName}
        </p>
      </div>

      <div
        className="manus"
        style={{
          padding: "10px 4px 10px 10px",
          height: "88%",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
          // marginBottom: "20px",
          // gap: "40px",
          // justifyContent: "space-between",
          // alignItems: "center",
          // boxShadow: "0 .5rem 1rem rgba(0,0,0,.15)"
        }}
      >
        <ManuItems
          icon={<FaChartBar />}
          title="Dashboard"
          toLink="/home/dashboard"
        />
        <ManuItems
          icon={<FaUsers />}
          title="Employee"
          toLink="/home/employee"
        />
        <ManuItems
          icon={<FaBuilding />}
          title="Organization"
          toLink={null}
          isSubManu={true}
          subManus={[
            {
              name: "Departments",
              to: "/home/department"
            },
            {
              name: "Offices",
              to: "/home/office"
            },
            {
              name: "Designations",
              to: "/home/designation"
            }
          ]}
        />
        <ManuItems
          icon={<FaClipboardCheck />}
          title="Attendance"
          toLink="/home/attendance"
        />
        <ManuItems icon={<FaBed />} title="Leaves" toLink="/home/leaves" />
        <ManuItems icon={<FaCoins />} title="Payrol" toLink="/home/payrol" />
        {/* <ManuItems icon={<FaUser />} title="Users" toLink="/home/user" />
        <ManuItems
          icon={<FaWrench />}
          title="Settings"
          toLink="/home/settings"
        /> */}
      </div>
      <div className="collaps-btn">
        <Tooltip title="collapse" placement="right">
          <button
            onClick={() => dispatch(addSidebarOpen(!isSidebarOpen))}
            style={{ background: "none", border: "none", color: "white" }}
          >
            <TbLayoutSidebarLeftCollapse />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Sidebar;
