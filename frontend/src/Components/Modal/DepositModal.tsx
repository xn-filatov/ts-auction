import axios from "axios";
import { useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useCookies } from "react-cookie";
import { updatedBalance } from "../../Stores/userStore";

type Props = {
  show: boolean;
  onHide: () => void;
};

function DepositModal(props: Props) {
  const { show, onHide } = props;
  const [cookies] = useCookies(["token"]);
  const [amount, setAmount] = useState(0);
  const [isDepositSuccess, setIsDepositSuccess] = useState(false);

  const handleDeposit = () => {
    if (amount)
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/users/deposit`,
          {
            amount: amount,
          },
          { headers: { Authorization: `Bearer ${cookies.token}` } }
        )
        .then((res: any) => {
          setIsDepositSuccess(true);
          updatedBalance(res.data.balance);
        })
        .catch(console.log);
  };

  const handleChangeAmount = (e: any) => {
    setAmount(parseFloat(e.target.value));
  };

  const handleOnHide = () => {
    onHide();
    setAmount(0);
    setIsDepositSuccess(false);
  };

  return (
    <Modal show={show} onHide={handleOnHide} centered={true}>
      <Modal.Header closeButton>
        <Modal.Title>Deposit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {(!isDepositSuccess && (
          <input
            type="number"
            onChange={handleChangeAmount}
            placeholder="Amount to deposit"
          />
        )) || <p>Deposit confirmed!</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleOnHide}>
          Close
        </Button>
        {!isDepositSuccess && (
          <Button
            variant="primary"
            onClick={handleDeposit}
            disabled={!amount || amount <= 0}
          >
            Deposit
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default DepositModal;
