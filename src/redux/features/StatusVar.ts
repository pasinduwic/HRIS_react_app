import { createSlice } from "@reduxjs/toolkit";

interface sessionUserI {
  name: string;
  email: string;
  imagePath: string;
}
interface alertShowDetailsI {
  status: boolean;
  type: string;
  message: string;
}
interface StatusVarI {
  sidebarOpen: boolean;
  sessionUser: any;
  alertShowDetails: alertShowDetailsI;
  addModal: boolean;
  updateModal: boolean;
  deleteModal: boolean;
  tableLoader: boolean;
  screenSize: number;
  refreshData: boolean;
}

const StatusVar: StatusVarI = {
  sidebarOpen: true,
  sessionUser: undefined,
  alertShowDetails: {
    status: false,
    type: "",
    message: ""
  },
  addModal: false,
  updateModal: false,
  deleteModal: false,
  tableLoader: true,
  screenSize: 900,
  refreshData: false
};

export const StatesVarSlice = createSlice({
  name: "statesVar",
  initialState: { value: StatusVar },
  reducers: {
    addSidebarOpen: (state, action) => {
      // console.log("action.payload");
      // console.log(action.payload);

      state.value.sidebarOpen = action.payload;
      // console.log(state.value.cartOpen);
    },

    addSessionUser: (state, action) => {
      console.log(action);
      if (action.payload.type === "add") {
        // console.log(action.payload);

        state.value.sessionUser = action.payload.payload;
        // console.log(state.value.sessionUser);
      } else {
        state.value.sessionUser = undefined;
      }
    },

    addAlertDetails: (state, action) => {
      // console.log(action.payload);

      state.value.alertShowDetails = action.payload;
    },
    addModalTogal: (state, action) => {
      state.value.addModal = action.payload;
    },
    updateModalTogal: (state, action) => {
      state.value.updateModal = action.payload;
    },
    deleteModalTogal: (state, action) => {
      state.value.deleteModal = action.payload;
    },
    setTableLoader: (state, action) => {
      state.value.tableLoader = action.payload;
    },
    setScreenSize: (state, action) => {
      state.value.screenSize = action.payload;
    },
    setRefresh: (state, action) => {
      state.value.refreshData = action.payload;
    }
  }
});

export const {
  addSidebarOpen,
  addSessionUser,
  addAlertDetails,
  addModalTogal,
  updateModalTogal,
  deleteModalTogal,
  setTableLoader,
  setScreenSize,
  setRefresh
} = StatesVarSlice.actions;
export default StatesVarSlice.reducer;
