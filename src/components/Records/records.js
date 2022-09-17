import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase, { db } from "../Firebase/firebase";
import Recshow from "../Recshow/Recshow";
import "./styles.css";
import { Space, Spin } from "antd";

const Records = () => {
  const uid = firebase.auth().currentUser.uid;
  const [fav, setFav] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchf = async () => {
    db.collection("users")
      .doc(uid)
      .get()
      .then((data) => {
        if (data.data()) {
          setFav(data.data().fav);
        }
      });

    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchf();
  }, [fav]);

  return (
    <div className="body">
      <div className="py-2 text-center">
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          <span className="heading">Speedy</span>
        </Link>
      </div>
      {isLoading ? (
        <div className="mt-5 text-center">
          <Space size="middle">
            <Spin size="large" />
          </Space>
        </div>
      ) : fav.length === 0 ? (
        <div className=" mt-5 noRecords text-center">No Records</div>
      ) : (
        <div className="row">
          {fav?.map((record) => (
            <div className="col-md-3 p-3">
              <Recshow record={record} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Records;
