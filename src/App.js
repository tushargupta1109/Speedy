import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import img from "./a.jpg";
import randomwords from "random-words";

function App() {
  const time = 30;
  const number_of_words = 50;
  const [countdown, setCountdown] = useState(time);
  const [currInput, setCurrInput] = useState("");
  const [words, setWords] = useState([]);
  const [charindex, setCharindex] = useState(-1);
  const [charatindex, setCharatindex] = useState("");
  const [currwordindex, setCurrentwordindex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState("waiting");
  const textinput = useRef(null);

  useEffect(() => {
    if (status === "started") {
      textinput.current.focus();
    }
  }, [status]);

  useEffect(() => {
    setWords(generatewords());
  }, []);

  function generatewords() {
    return new Array(number_of_words).fill(null).map(() => randomwords());
  }
  function start() {
    if (status === "finished") {
      setWords(generatewords());
      setCorrect(0);
      setIncorrect(0);
      setCurrentwordindex(0);
      setCharindex(-1);
      setCharatindex("");
    }
    if (status !== "started") {
      setStatus("started");
      let interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 0) {
            clearInterval(interval);
            setStatus("finished");
            setCurrInput("");
            return time;
          } else {
            return prev - 1;
          }
        });
      }, 1000);
    }
  }

  function handleKeydown({ keyCode, key }) {
    if (keyCode === 32) {
      checkmatch();
      setCurrInput("");
      setCurrentwordindex(currwordindex + 1);
      setCharindex(-1);
    } else if (keyCode === 8) {
      setCharindex(charindex - 1);
      setIncorrect(incorrect + 1);
      setCharatindex("");
    } else {
      setCharindex(charindex + 1);
      setCharatindex(key);
    }
  }

  function checkmatch() {
    const wordtocompare = words[currwordindex];
    const doesmatch = wordtocompare === currInput.trim();
    console.log(doesmatch);
    if (doesmatch) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
  }

  function getColor(i, j, ch) {
    if (
      currwordindex === i &&
      charindex === j &&
      charatindex &&
      status !== "finished"
    ) {
      if (charatindex === ch) {
        return "has-background-success";
      } else {
        return "has-background-danger";
      }
    } else if (
      currwordindex === i &&
      charindex >= words[currwordindex].length
    ) {
      return "has-background-danger";
    } else {
      return "";
    }
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
      <div
        className="mt-3"
        style={{ color: "white", marginLeft: "12vh", marginRight: "12vh" }}
      >
        {words.map((word, i) => (
          <span>
            <span key={i}>
              {word.split("").map((ch, j) => (
                <span
                  className={getColor(i, j, ch)}
                  key={j}
                  style={{ fontSize: "4vh" }}
                >
                  {ch}
                </span>
              ))}
            </span>
            <span> </span>
          </span>
        ))}
      </div>
      <h2 style={{ color: "gold", marginTop: "3vh", marginLeft: "12vh" }}>
        {countdown}
      </h2>
      <textarea
        ref={textinput}
        style={{ width: "190vh", marginLeft: "12vh", marginTop: "3vh" }}
        disabled={status !== "started"}
        className="form-control mb-2"
        placeholder="Press Start and Start typing..."
        onKeyDown={handleKeydown}
        value={currInput}
        onChange={(e) => {
          setCurrInput(e.target.value);
        }}
        rows={3}
      />
      <button
        className="mt-3"
        style={{
          fontSize: "4vh",
          marginLeft: "100vh",
        }}
        onClick={start}
      >
        START
      </button>
      {status === "finished" && (
        <div className="columns" style={{ color: "grey" }}>
          <div className="column has-text-centered">
            <p className="is-size-5">Words Per Minutes :</p>
            <p className="is-size-1" style={{ color: "gold" }}>
              {2 * correct}
            </p>
          </div>
          <div className="column has-text-centered">
            <p className="is-size-5">Accuracy :</p>
            <p className="is-size-1" style={{ color: "gold" }}>
              {Math.round((correct / (correct + incorrect)) * 100)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
