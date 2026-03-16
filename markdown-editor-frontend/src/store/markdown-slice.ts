import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MarkdownState {
  content: string;
}

const initialState: MarkdownState = {
  content: '# Hello, Collaborative Markdown!',
};

const markdownSlice = createSlice({
  name: "markdown",
  initialState,
  reducers: {
    updateMarkdown: (state: MarkdownState, action: PayloadAction<string>) => {
      state.content = action.payload;
    },
    resetMarkdown: () => initialState,
    insertMarkdown: (state: MarkdownState, action: PayloadAction<string>) => {
      state.content += action.payload;
    }
  }
});

export const { updateMarkdown, resetMarkdown, insertMarkdown } = markdownSlice.actions;
export default markdownSlice.reducer;
