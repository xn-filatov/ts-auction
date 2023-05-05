import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Auth from "./Components/Auth";
import MainPage from "./Components/MainPage";

function App() {
  const [hasToken, setHasToken] = useState(false);
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    if (cookies.token)
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/users/checkToken`, {
          headers: { Authorization: `Bearer ${cookies.token}` },
        })
        .then(() => {
          setHasToken(true);
        })
        .catch(console.log);
    else setHasToken(false);
  }, [cookies.token]);

  return (
    <div className="App">
      {(!hasToken && <Auth setHasToken={setHasToken} />) || <MainPage />}
    </div>
  );
}

export default App;
