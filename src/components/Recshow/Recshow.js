import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import firebase, { db } from "../Firebase/firebase";
import "./styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Recshow = ({ record }) => {
  const auth = firebase.auth();

  const handledelete = async () => {
    const uid = firebase.auth().currentUser.uid;
    const data = await db.collection("users").doc(uid).get();
    let fav = await data.data().fav;
    const filteredfav = fav.filter((value) => {
      return (
        value.obj.Speed !== record.obj.Speed &&
        value.obj.Accuracy !== record.obj.Accuracy
      );
    });
    db.collection("users").doc(uid).set({ fav: filteredfav });
    toast.success("Removed successfully!", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  return (
    <div className="card">
      <div className="card-body">
        <ul className="lists">
          <li>
            <span className="list-items">Speed: </span>
            {record.obj.Speed}
          </li>
          <li>
            {" "}
            <span className="list-items">Accuracy: </span>
            {record.obj.Accuracy}
          </li>
        </ul>
      </div>
      <button className="btns" onClick={handledelete}>
        Remove
      </button>
      <ToastContainer />
    </div>
  );
};

export default Recshow;
