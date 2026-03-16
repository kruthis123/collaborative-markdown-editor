import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
  isDarkTheme: boolean;
};

const initialState: ThemeState = {
  isDarkTheme: false
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeState['isDarkTheme']>) => {
      state.isDarkTheme = action.payload;
    }
  }
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;