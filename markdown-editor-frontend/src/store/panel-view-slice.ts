import { createSlice } from "@reduxjs/toolkit";

interface PanelViewState {
  editorPanelEnlarged: boolean;
  previewPanelEnlarged: boolean;
}

const initialState: PanelViewState = {
  editorPanelEnlarged: false,
  previewPanelEnlarged: false
};

const panelViewSlice = createSlice({
  name: "panelView",
  initialState,
  reducers: {
    enlargeEditorPanel: (state) => {
      if (state.previewPanelEnlarged) {
        state.previewPanelEnlarged = false;
      }
      state.editorPanelEnlarged = true;
    },
    enlargePreviewPanel: (state) => {
      if (state.editorPanelEnlarged) {
        state.editorPanelEnlarged = false;
      }
      state.previewPanelEnlarged = true;
    },
    shrinkEditorPanel: (state) => {
      state.editorPanelEnlarged = false;
    },
    shrinkPreviewPanel: (state) => {
      state.previewPanelEnlarged = false;
    }
  }
});

export const { enlargeEditorPanel, enlargePreviewPanel, shrinkEditorPanel, shrinkPreviewPanel } = panelViewSlice.actions;
export default panelViewSlice.reducer;
