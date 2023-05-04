import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Navbar from "./Navbar";
import { BidItem, Bid } from "./BidItem";
import axios from "axios";

function MainPage() {
  const [cookies] = useCookies(["token"]);
  const [bidsData, setBidsData] = useState<Bid[] | null>(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/bidItems`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      })
      .then((res) => {
        setBidsData(res.data);
      })
      .catch(console.log);
  }, []);

  return (
    <div className="container">
      <Navbar />
      <table className="table" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Current Price</th>
            <th>Duration</th>
            <th>Bid</th>
          </tr>
        </thead>
      </table>

      {bidsData &&
        bidsData.map((x: Bid) => {
          return (
            <BidItem
              name={x.name}
              id={x.id}
              startPrice={x.startPrice}
              createdAt={x.createdAt}
              duration={x.duration}
            />
          );
        })}
    </div>
  );
}

export default MainPage;
