import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase, { db } from "../Firebase/firebase";
import Recshow from "../Recshow/Recshow";
import "./styles.css";
import { Space, Spin } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const Records = () => {
  const uid = firebase.auth().currentUser.uid;
  const [fav, setFav] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchf = async () => {
    setIsLoading(true);

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
    fetchf();
  }, []);

  return (
    <div className="body">
      <div className="py-2 records">
        <span className="heading">My Records</span>
        <Link
          to="/"
          style={{
            color: "wheat",
            textDecoration: "none",
          }}
        >
          <span className="icon px-4">
            <HomeOutlined />
          </span>
        </Link>
      </div>
      {isLoading ? (
        <div className="mt-5 text-center">
          <Space size="middle">
            <Spin size="large" style={{ color: "white" }} />
          </Space>
        </div>
      ) : fav.length === 0 ? (
        <div className=" mt-5 noRecords text-center">No Records</div>
      ) : (
        <div className="row">
          {fav?.map((record) => (
            <div className="col-md-3 p-3">
              <Recshow fetchf={fetchf} record={record} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Records;
