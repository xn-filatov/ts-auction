import axios from "axios";
import { useEffect, useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { useCookies } from "react-cookie";
import DepositModal from "./Modal/DepositModal";

import { useStore } from "effector-react";
import $userStore, { updateBalanceFx } from "../Stores/userStore";

function Navbar() {
  const [cookies, , removeCookie] = useCookies(["token"]);
  const userStore = useStore($userStore);

  const [showDepositModal, setShowDepositModal] = useState(false);

  useEffect(() => {
    updateBalanceFx(cookies.token);
  }, []);

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
          <b style={{ color: "green" }}>Balance: {userStore.balance}</b>
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

      <DepositModal show={showDepositModal} onHide={handleCloseDepositModal} />
    </>
  );
}

export default Navbar;
