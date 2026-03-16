import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { editor } from "monaco-editor";

interface MonacoState {
  editor: editor.IEditor | null;
}

const initialState: MonacoState = {
  editor: null
};

const monacoSlice = createSlice({
  name: "monaco",
  initialState,
  reducers: {
    setEditor: (state, action: PayloadAction<editor.IEditor | null>) => {
      state.editor = action.payload;
    }
  }
});

export const { setEditor } = monacoSlice.actions;
export default monacoSlice.reducer;