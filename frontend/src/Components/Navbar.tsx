import { useCookies } from "react-cookie";

function Navbar() {
  const [, , removeCookie] = useCookies(["token"]);

  const handleLogout = () => {
    removeCookie("token", { path: "/" });
  };

  return (
    <div className="row bg-light px-2 py-3" style={{ width: "100% " }}>
      <div className="col-6">
        <h3>Jitera Auction</h3>
      </div>
      <div className="col-6">
        <button
          className="btn btn-outline-success my-2 my-sm-0"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
