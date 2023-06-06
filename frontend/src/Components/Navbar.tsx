import axios from "axios";
import { useEffect, useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { useCookies } from "react-cookie";
import DepositModal from "./Modal/DepositModal";

function Navbar() {
  const [cookies, , removeCookie] = useCookies(["token"]);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    updateBalance();
  }, []);

  const updateBalance = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/users/balance`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      })
      .then((res) => {
        setBalance(res.data.balance);
      })
      .catch(console.log);
  };

  const handleCloseDepositModal = () => setShowDepositModal(false);
  const handleShowDepositModal = () => setShowDepositModal(true);

  const handleLogout = () => {
    removeCookie("token", { path: "/" });
  };

  return (
    <>
      <div className=" row bg-light px-5 py-3">
        <div className="col-6">
          <h3>Auction</h3>
        </div>
        <div className="col-1 d-flex align-items-center">
          <b style={{ color: "green" }}>Balance: {balance}</b>
        </div>
        <div className="col-5 d-flex justify-content-end">
          <ButtonGroup>
            <Button variant="success" onClick={handleShowDepositModal}>
              Deposit
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <DepositModal
        show={showDepositModal}
        onHide={handleCloseDepositModal}
        setBalance={setBalance}
      />
    </>
  );
}

export default Navbar;
