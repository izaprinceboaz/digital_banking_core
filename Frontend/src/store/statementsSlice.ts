import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMyStatements } from "../services/accountService";
import type { StatementRow } from "../services/accountService";
import { getApiErrorMessage } from "../services/api";

export const loadStatements = createAsyncThunk<
  StatementRow[],
  string,
  { rejectValue: string }
>("statements/load", async (accountNumber, { rejectWithValue }) => {
  try {
    return await getMyStatements(accountNumber);
  } catch (err) {
    return rejectWithValue(getApiErrorMessage(err, "Couldn't load statements."));
  }
});

interface StatementsState {
  rows: StatementRow[];
  loading: boolean;
  error: string | null;
  loadedFor: string | null;
}

const initialState: StatementsState = {
  rows: [],
  loading: false,
  error: null,
  loadedFor: null,
};

const statementsSlice = createSlice({
  name: "statements",
  initialState,
  reducers: {
    clearStatements: (state) => {
      state.rows = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadStatements.pending, (state,action) => {
        state.loading = true;
        state.error = null;
        state.loadedFor = action.meta.arg;
      })
      .addCase(loadStatements.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload;
      })
      .addCase(loadStatements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Couldn't load statements.";
      });
  },
});

export const { clearStatements } = statementsSlice.actions;
export default statementsSlice.reducer;
