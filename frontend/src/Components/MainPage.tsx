import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Navbar from "./Navbar";
import { BidItem, BidItemData } from "./BidItem";
import CreateItemModal from "./Modal/CreateItemModal";
import { Button, Form } from "react-bootstrap";
import BidModal from "./Modal/BidModal";
import $bidsData, { updateItemsFx } from "../Stores/itemStorage";
import { useStore } from "effector-react";

function MainPage() {
  const [cookies] = useCookies(["token"]);
  const bidsData = useStore($bidsData);
  const [selectedItem, setSelectedItem] = useState<BidItemData | null>(null);
  const [isFilterOngoing, setIsFilterOngoing] = useState(false);

  const [showCreateItemModal, setShowCreateItemModal] = useState(false);
  const handleCloseCreateItemModal = () => setShowCreateItemModal(false);
  const handleShowCreateItemModal = () => setShowCreateItemModal(true);

  const [showBidModal, setShowBidModal] = useState(false);
  const handleCloseBidModal = () => setShowBidModal(false);
  const handleShowBidModal = () => setShowBidModal(true);

  useEffect(() => {
    updateItemsFx(cookies.token);
  }, []);

  const handleBid = (item: BidItemData) => {
    setShowBidModal(true);
    setSelectedItem(item);
    handleShowBidModal();
  };

  return (
    <>
      <Navbar />
      <div className="container mt-2">
        <Button onClick={handleShowCreateItemModal} variant="outline-info">
          Create Item
        </Button>

        <Form.Check
          type={"checkbox"}
          label={`Filter ongoing`}
          className="mt-3"
          defaultChecked={isFilterOngoing}
          onChange={() => setIsFilterOngoing(!isFilterOngoing)}
        />

        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Current Price</th>
              <th scope="col">Duration</th>
              <th scope="col" className="text-center">
                Bid
              </th>
            </tr>
          </thead>
          <tbody>
            {bidsData
              ?.filter((x: BidItemData) => {
                if (!isFilterOngoing) return x;
                else {
                  const bidExpirationTime =
                    new Date(x.createdAt).getTime() + x.duration;
                  if (Date.now() <= bidExpirationTime) return x;
                }
              })
              .map((x: BidItemData, i: number) => {
                return (
                  <BidItem key={i} bidItemData={x} handleBid={handleBid} />
                );
              })}
          </tbody>
        </table>
      </div>
      <CreateItemModal
        show={showCreateItemModal}
        onHide={handleCloseCreateItemModal}
      />
      {selectedItem && (
        <BidModal
          itemId={selectedItem.id}
          itemName={selectedItem.name}
          show={showBidModal}
          onHide={handleCloseBidModal}
        />
      )}
    </>
  );
}

export default MainPage;
