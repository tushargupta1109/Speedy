import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import firebase, { db } from "../Firebase/firebase";
import "./styles.css";
import { Button } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Recshow = ({ record }) => {
  const handledelete = async () => {
    const uid = firebase.auth().currentUser.uid;
    const data = await db.collection("users").doc(uid).get();
    let fav = await data.data().fav;
    const filteredfav = fav.filter((value) => {
      return (
        value.obj.Speed !== record.obj.Speed ||
        value.obj.Accuracy !== record.obj.Accuracy
      );
    });
    db.collection("users").doc(uid).set({ fav: filteredfav });
    toast.success("Removed Successfully!", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  return (
    <div className="card">
      <div className="card-body px-2 py-2">
        <div className="row">
          <div className="list1 text-center col-6">Speed:</div>
          <div className="list2 text-center col-6">{record.obj.Speed}</div>
        </div>
        <div className="row">
          <div className="list1 text-center col-6">Accuracy:</div>
          <div className="list2 text-center col-6">{record.obj.Accuracy}</div>
        </div>
      </div>
      <div className="text-center py-2">
        <Button className="btn" onClick={handledelete}>
          Remove
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Recshow;
