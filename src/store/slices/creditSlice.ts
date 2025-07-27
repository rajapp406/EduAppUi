import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CreditState {
  totalCredits: number;
  usedCredits: number;
  transactions: {
    id: string;
    type: 'earned' | 'spent';
    amount: number;
    description: string;
    date: string;
  }[];
}

const initialState: CreditState = {
  totalCredits: 100,
  usedCredits: 0,
  transactions: [
    {
      id: '1',
      type: 'earned',
      amount: 100,
      description: 'Welcome bonus',
      date: new Date().toISOString(),
    },
  ],
};

const creditSlice = createSlice({
  name: 'credits',
  initialState,
  reducers: {
    spendCredits: (state, action: PayloadAction<{ amount: number; description: string }>) => {
      state.usedCredits += action.payload.amount;
      state.transactions.push({
        id: Date.now().toString(),
        type: 'spent',
        amount: action.payload.amount,
        description: action.payload.description,
        date: new Date().toISOString(),
      });
    },
    earnCredits: (state, action: PayloadAction<{ amount: number; description: string }>) => {
      state.totalCredits += action.payload.amount;
      state.transactions.push({
        id: Date.now().toString(),
        type: 'earned',
        amount: action.payload.amount,
        description: action.payload.description,
        date: new Date().toISOString(),
      });
    },
  },
});

export const { spendCredits, earnCredits } = creditSlice.actions;
export default creditSlice.reducer;