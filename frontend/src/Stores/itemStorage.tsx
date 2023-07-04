/* eslint-disable */
import axios from "axios";
import { createEffect, createEvent, createStore } from "effector";
import { BidItemData } from "../Components/BidItem";
import { CreationValues } from "../Components/Modal/CreateItemModal";

export const updateItemsFx = createEffect(async (token: string) => {
  const req = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/bidItems`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return req.data;
});

type CreateItemParams = {
  token: string;
  values: CreationValues;
};

export const createItemFx = createEffect(
  async ({ token, values }: CreateItemParams) => {
    await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/bidItems/create`,
      {
        name: values.name,
        startPrice: values.startPrice,
        duration: values.duration,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
);

createItemFx.done.watch((params) => {
  updateItemsFx(params.params.token);
});

createItemFx.fail.watch((params) => {
  console.log("Item creation has Failed");
});

export default createStore<BidItemData[]>([]).on(
  updateItemsFx.doneData,
  (_, newState) => newState
);
