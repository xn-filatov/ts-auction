import axios from "axios";
import { useEffect, useState } from "react";
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
      <div className="row bg-light px-2 py-3" style={{ width: "100% " }}>
        <div className="col-6">
          <h3>Jitera Auction</h3>
        </div>
        <div className="col-6">
          <p>Balance: {balance}</p>
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            onClick={handleShowDepositModal}
          >
            Deposit
          </button>
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            onClick={handleLogout}
          >
            Logout
          </button>
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
