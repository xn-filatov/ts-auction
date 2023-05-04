export type Bid = {
  id: number;
  name: string;
  startPrice: number;
  createdAt: Date;
  duration: number;
};

export function BidItem(props: Bid) {
  const { id, name, startPrice, createdAt, duration } = props;
  return (
    <div className="container">
      <div className="row">
        <div className="col-3">{name}</div>
        <div className="col-3"> {startPrice}</div>
        <div className="col-3">{duration}</div>
        <div className="col-3">
          <button>Bid</button>
        </div>
      </div>
    </div>
  );
}
