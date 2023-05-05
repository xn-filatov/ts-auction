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
    <div className="container">
      <div className="row">
        <div className="col-3">{bidItemData.name}</div>
        <div className="col-3"> {bidItemData.startPrice}</div>
        <div className="col-3">{bidItemData.duration}</div>
        <div className="col-3">
          <Button onClick={() => handleBid(bidItemData)}>Bid</Button>
        </div>
      </div>
    </div>
  );
}
