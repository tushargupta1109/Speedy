import React from "react";
import First from "./First";
import Records from "./components/Records";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import firebase from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
const auth = firebase.auth();

const App = () => {
  const [userin] = useAuthState(auth);
  return (
    <div>
      <Router>
        <div>
          <Switch>
            <Route path="/" exact component={First} />
            {userin ? <Route path="/Records" component={Records} /> : ""}
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default App;
