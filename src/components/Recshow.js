import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Button } from "react-bootstrap";
import firebase, { db } from "../firebase";
const auth = firebase.auth();

const Recshow = ({ record }) => {
  const handledelete = async () => {
    const uid = firebase.auth().currentUser.uid;
    const data = await db.collection("users").doc(uid).get();
    let fav = await data.data().fav;
    const filteredfav = fav.filter((value) => {
      return (value.obj.Speed !== record.obj.Speed && value.obj.Accuracy !== record.obj.Accuracy) ;
    });
    db.collection("users").doc(uid).set({ fav: filteredfav });
    alert("removed successfully ,refresh the page");
  };

  return (
    <div style={{ color: "white", marginTop: "2rem",marginBottom:"4rem",marginLeft: "29rem" }}>
      <Card style={{ width: "20rem", height: "8rem" }}>
        <div className="text-center" style={{ marginBottom: "20px" }}>
          <Card.Title>Speed : {record.obj.Speed}</Card.Title>
          <Card.Title>Accuracy : {record.obj.Accuracy}</Card.Title>
        </div>
        <Button variant="primary" onClick={() => handledelete()}>
          Delete from Records
        </Button>
      </Card>
    </div>
  );
};

export default Recshow;
