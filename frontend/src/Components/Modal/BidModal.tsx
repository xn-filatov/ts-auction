import axios from "axios";
import { useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useCookies } from "react-cookie";
import { updateItemsFx } from "../../Stores/itemStorage";

type Props = {
  itemId: number;
  itemName: string;
  show: boolean;
  onHide: () => void;
};

function BidModal(props: Props) {
  const { itemId, itemName, show, onHide } = props;
  const [cookies] = useCookies(["token"]);
  const [isBiddingSuccess, setIsBiddingSuccess] = useState(false);
  const [bidPrice, setBidPrice] = useState(0);

  const handleBid = () => {
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/bidItems/bid`,
        {
          id: itemId,
          amount: bidPrice,
        },
        { headers: { Authorization: `Bearer ${cookies.token}` } }
      )
      .then((res: any) => {
        setIsBiddingSuccess(true);
        updateItemsFx(cookies.token);
      })
      .catch((err: any) => {
        console.log(err);
        alert(err.response?.data);
      });
  };

  const handleSetBidPrice = (e: any) => {
    setBidPrice(parseFloat(e.target.value));
  };

  const handleOnHide = () => {
    onHide();
    setBidPrice(0);
    setIsBiddingSuccess(false);
  };

  return (
    <Modal show={show} onHide={handleOnHide} centered={true}>
      <Modal.Header closeButton>
        <Modal.Title>{itemName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {(!isBiddingSuccess && (
          <div>
            <input
              type="number"
              onChange={handleSetBidPrice}
              placeholder="Your bidding price"
            />
          </div>
        )) || <p>Bid success</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleOnHide}>
          Cancel
        </Button>
        {!isBiddingSuccess && (
          <Button
            variant="primary"
            onClick={handleBid}
            disabled={bidPrice <= 0}
          >
            Submit
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default BidModal;
