import { configureStore } from "@reduxjs/toolkit";
import statements from "./statementsSlice";

export const store = configureStore({
  reducer: {
    statements,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
