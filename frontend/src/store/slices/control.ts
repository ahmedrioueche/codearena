import { createSlice } from "@reduxjs/toolkit";

interface ControlState {
  isProblemToggled: boolean;
  isControlsToggled: boolean;
}

const initialState: ControlState = {
  isProblemToggled: false,
  isControlsToggled: false,
};

export const controlSlice = createSlice({
  name: "problemControl",
  initialState,
  reducers: {
    toggleProblem: (state) => {
      state.isProblemToggled = !state.isProblemToggled;
    },
    toggleControls: (state) => {
      state.isControlsToggled = !state.isControlsToggled;
    },
  },
});
