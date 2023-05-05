import axios from "axios";
import { useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useCookies } from "react-cookie";

type Props = {
  show: boolean;
  onHide: () => void;
  updateItems: () => void;
};

function CreateItemModal(props: Props) {
  const { show, onHide, updateItems } = props;
  const [cookies] = useCookies(["token"]);
  const [isCreationSuccess, setIsCreationSuccess] = useState(false);

  const [name, setName] = useState("");
  const [startPrice, setStartPrice] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleCreateItem = () => {
    if (canCreate)
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/bidItems/create`,
          {
            name,
            startPrice,
            duration,
          },
          { headers: { Authorization: `Bearer ${cookies.token}` } }
        )
        .then((res: any) => {
          setIsCreationSuccess(true);
          updateItems();
        })
        .catch(console.log);
  };

  const handleSetName = (e: any) => {
    setName(e.target.value);
  };
  const handleStartPrice = (e: any) => {
    setStartPrice(parseInt(e.target.value));
  };
  const handleSetDuration = (e: any) => {
    setDuration(parseInt(e.target.value));
  };

  const canCreate: boolean = name?.length > 0 && startPrice > 0 && duration > 0;

  const handleOnHide = () => {
    onHide();
    setName("");
    setStartPrice(0);
    setDuration(0);
    setIsCreationSuccess(false);
  };

  return (
    <Modal show={show} onHide={handleOnHide} centered={true}>
      <Modal.Header closeButton>
        <Modal.Title>Deposit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {(!isCreationSuccess && (
          <div>
            <input
              type="text"
              onChange={handleSetName}
              placeholder="Input new item's name"
            />
            <input
              type="number"
              onChange={handleStartPrice}
              placeholder="Input new item's start price"
            />
            <input
              type="number"
              onChange={handleSetDuration}
              placeholder="Input new item's bidding duration"
            />
          </div>
        )) || <p>New Item created!</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleOnHide}>
          Close
        </Button>
        {!isCreationSuccess && (
          <Button
            variant="primary"
            onClick={handleCreateItem}
            disabled={!canCreate}
          >
            Create
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default CreateItemModal;
