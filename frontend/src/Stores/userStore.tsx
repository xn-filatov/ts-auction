/* eslint-disable */
import axios from "axios";
import { createEffect, createEvent, createStore } from "effector";

type User = {
  balance: number;
};

export const updateBalanceFx = createEffect(async (token: string) => {
  const req = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/users/balance`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return req.data.balance;
});

export const updatedBalance = createEvent<number>();

export default createStore<User>({ balance: 0 })
  .on(updateBalanceFx.doneData, (state, newState) => ({
    ...state,
    balance: newState,
  }))
  .on(updatedBalance, (state, newState) => ({
    ...state,
    balance: newState,
  }));
