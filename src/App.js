import React from "react";
import Home from "./components/Home";
import Records from "./components/Records";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import firebase from "./components/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
const auth = firebase.auth();

const App = () => {
  const [userin] = useAuthState(auth);
  return (
    <div>
      <Router>
        <div>
          <Routes>
            <Route exact path="/" element={<Home/>} />
            {userin ? <Route path="/Records" element={<Records/>} /> : ""}
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
