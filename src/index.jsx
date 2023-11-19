import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
//import "./index.css";
import Auth from "./pages/Auth";
import Account from "./components/Account";
import StockReceiving from "./scanning";
import { auth } from "./firebaseClient";
import NavbarDisplay from "./components/Nav";
import "./frontcss.css";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false); // Update loading state once auth check is done
    });

    return () => unsubscribe();
  }, []);

  //class="loader"

  if (isLoading) {
    return <div></div>;
  }

  return (
    <div className="">
      {!user ? (
        <Auth />
      ) : (
        <div>
          <NavbarDisplay user={user} />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Account user={user} />} />
              <Route path="/scan" element={<StockReceiving />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
