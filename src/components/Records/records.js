import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase, { db } from "../Firebase/firebase";
import Recshow from "../Recshow/Recshow";
import "./styles.css";

const Records = () => {
  const uid = firebase.auth().currentUser.uid;
  const [fav, setFav] = useState([]);
  useEffect(() => {
    async function fetchf() {
      db.collection("users")
        .doc(uid)
        .get()
        .then((data) => {
          if (data.data()) {
            setFav(data.data().fav);
          }
        });
    }
    fetchf();
  }, []);
  
  return (
    <div className="body">
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>
        <h1 className="heading">Speedy</h1>
      </Link>

      {fav.length === 0 ? (
        <div className="text-center">No Records</div>
      ) : (
        fav?.map((record) => (
          <div className="d-inline-flex p-5">
            {" "}
            <Recshow record={record} />
          </div>
        ))
      )}
    </div>
  );
};

export default Records;
