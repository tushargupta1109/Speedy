import "./App.css";
import React, { useState, useEffect } from "react";
import img from "./Components/black7.jpg";
import Text from "./Components/Text";

function App() {
  const time = 30;
  const [countdown, setCountdown] = useState(time);
  const [currInput, setCurrInput] = useState([]);
  function start() {
    let interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 0) {
          // clearInterval(interval);
          return prev;
        } else {
          return prev - 1;
        }
      });
    }, 1000);
  }
  return (
    <div
      style={{
        backgroundImage: `url(${img})`,
        height: "100vh",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <h1
        className="text-center"
        style={{ color: "gold", fontWeight: "bolder" }}
      >
        Speedy
      </h1>
      <Text currInput={currInput} />
      <h2 style={{ color: "gold", marginTop: "3vh" }}>{countdown}</h2>
      <textarea
        className="form-control mb-3 mt-3"
        placeholder="Press Start and Start typing..."
        onChange={(e) => {
          const str=e.target.value;
          setCurrInput([...currInput,str.charAt(str.length-1)]);
        }}
        rows={4}
      />
      <button className="ml-5 mt-4" style={{ fontSize: "4vh" }} onClick={start}>
        START
      </button>
    </div>
  );
}

export default App;
