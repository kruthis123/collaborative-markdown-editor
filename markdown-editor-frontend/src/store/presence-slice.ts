import {createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PresenceState {
  [userId: string]: {
    selection: {
      start: number,
      end: number
    },
    color: string,
    userName: string
  }
}

const initialState: PresenceState = {};

const presenceSlice = createSlice({
  name: 'presence',
  initialState,
  reducers: {
    updatePresence: (state: PresenceState, action: PayloadAction<{ userId: string, selection: { start: number, end: number }, color: string, userName: string }>) => {
      state[action.payload.userId] = action.payload;
    }
  }
});

export const { updatePresence } = presenceSlice.actions;
export default presenceSlice.reducer;
