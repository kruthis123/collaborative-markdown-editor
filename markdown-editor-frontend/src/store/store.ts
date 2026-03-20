import { configureStore } from "@reduxjs/toolkit";
import markdownReducer from "./markdown-slice";
import themeReducer from "./theme-slice";
import panelViewReducer from "./panel-view-slice";
import presenceReducer from "./presence-slice";
import userReducer from "./user-slice";

export const store = configureStore({
  reducer: {
    markdown: markdownReducer,
    theme: themeReducer,
    panelView: panelViewReducer,
    presence: presenceReducer,
    user: userReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;