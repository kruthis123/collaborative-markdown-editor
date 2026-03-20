import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userName: string,
  userId: string,
  color: string
}

function getColor(userId: string) {
  const colors = ['#FF6B6B', '#4ECDC4', '#BB8FCE', '#FFA07A', '#98D8C8', '#F7DC6F', '#45B7D1', '#85C1E2'];
  return colors[userId.charCodeAt(0) % colors.length];
}

const initialState: UserState = {
  userName: '',
  userId: '',
  color: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state: UserState, action: PayloadAction<{ userName: string, userId: string }>) => {
      const { userName, userId } = action.payload;
      state.userName = userName;
      state.userId = userId;
      state.color = getColor(userId);
    }
  }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
