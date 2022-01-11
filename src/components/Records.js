import React, { useState, useEffect } from "react";
import img from "../b.jpg";
import { Link } from "react-router-dom";
import firebase, { db } from "../firebase";
import Recshow from "./Recshow";

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
    <div
      style={{
        backgroundImage: `url(${img})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Link
        to="/"
        className="text-center"
        style={{ color: "white", textDecoration: "none" }}
      >
        <h1 style={{ color: "wheat", fontWeight: "bolder" }}>Speedy</h1>
      </Link>

      {fav.length === 0 ? (
        <div
          className="text-center"
          style={{
            color: "white",
            paddingTop: 80,
            fontWeight: "bolder",
            fontSize: "5em",
          }}
        >
          No Records
        </div>
      ) : (
        fav?.map((record) =>
        <div className="d-inline-flex p-2"> <Recshow record={record} /></div>)
      )}
    </div>
  );
};

export default Records;
