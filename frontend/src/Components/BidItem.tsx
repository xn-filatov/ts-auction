import { Button } from "react-bootstrap";

export type BidItemData = {
  id: number;
  name: string;
  startPrice: number;
  createdAt: Date;
  duration: number;
};

type Props = {
  bidItemData: BidItemData;
  handleBid: (item: BidItemData) => void;
};

export function BidItem(props: Props) {
  const { bidItemData, handleBid } = props;
  return (
    <tr>
      <td>{bidItemData.name}</td>
      <td> {bidItemData.startPrice}</td>
      <td>{bidItemData.duration / 60 / 60 / 1000} h</td>
      <td className="d-flex justify-content-center">
        <Button className="px-4" onClick={() => handleBid(bidItemData)}>
          Bid
        </Button>
      </td>
    </tr>
  );
}
