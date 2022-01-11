import React, { useState, useEffect, useRef } from "react";
import img from "./img.jpg";
import randomwords from "random-words";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import firebase, { db } from "./firebase";
const auth = firebase.auth();

const Home = () => {
  const [userin] = useAuthState(auth);
  const handleadd = async () => {
    const uid = firebase.auth().currentUser.uid;
    if (uid === "") {
      return;
    }
    const obj = {
      Speed: 2 * correct_words,
      Accuracy: Math.round((correct_words / (correct_words + incorrect)) * 100),
    };

    const data = await db.collection("users").doc(uid).get();
    if (data) {
      if (data.data()) {
        let fav = await data.data().fav;
        let flag = true;
        fav?.map((value) => {
          if (
            value.obj.Speed === obj.Speed &&
            value.obj.Accuracy === obj.Accuracy
          ) {
            flag = false;
          }
        });
        if (flag === true) {
          fav.push({ obj });
          db.collection("users").doc(uid).set({ fav }, { merge: true });
          alert("added to Records");
        } else {
          alert("already in Records");
        }
      } else {
        let fav = [{ obj }];
        db.collection("users").doc(uid).set({ fav });
        alert("added to Records");
      }
    }
  };

  const googlelogin = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const out = () => {
    firebase
      .auth()
      .signOut()
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
    if (status === "waiting") {
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
  function restart() {
    setStatus("waiting");
    setWords(generatewords());
    setCorrect(0);
    setIncorrect(0);
    setCurrentwordindex(0);
    setCharindex(-1);
    setCharatindex("");
  }
  function handleKeydown({ keyCode, key }) {
    start();
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
    if (doesmatch) {
      const letter = words[currwordindex].length;
      setCorrect(correct + letter);
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
  function check(i, j, ch) {
    if (currwordindex > i && status !== "finished") {
      return "white";
    }
    if (
      currwordindex === i &&
      charindex > j &&
      charatindex &&
      status !== "finished"
    ) {
      return "white";
    }
    if (
      currwordindex === i &&
      charindex === j &&
      charatindex &&
      status !== "finished"
    ) {
      if (charatindex === ch) {
        return "white";
      } else {
        return "";
      }
    } else {
      return "";
    }
  }
  const correct_words = Math.round(correct / 4);

  return (
    <div
      style={{
        backgroundImage: `url(${img})`,
        backgroundPosition: "center",
        height: "38rem",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div style={{ display: "flex" }}>
        <h1 style={{ marginLeft: "5em", color: "wheat", fontWeight: "bolder" }}>
          Speedy
        </h1>
        {userin ? (
          <>
            <Link
              to="/Records"
              style={{ color: "white", textDecoration: "none" }}
            >
              <h1
                style={{
                  marginLeft: "5em",
                  color: "wheat",
                  fontWeight: "bolder",
                }}
              >
                Records
              </h1>
            </Link>
            <h1
              style={{
                marginLeft: "5em",
                color: "wheat",
                fontWeight: "bolder",
              }}
              onClick={() => out()}
            >
              Logout
            </h1>
          </>
        ) : (
          <h1
            style={{ marginLeft: "13em", color: "wheat", fontWeight: "bolder" }}
            onClick={() => googlelogin()}
          >
            Login
          </h1>
        )}
      </div>
      <div
        className="mt-2"
        style={{ color: "grey", marginLeft: "12vh", marginRight: "12vh" }}
      >
        {words.map((word, i) => (
          <span>
            <span key={i}>
              {word.split("").map((ch, j) => (
                <span
                  className={getColor(i, j, ch)}
                  key={j}
                  style={{ fontSize: "7mm", color: check(i, j, ch) }}
                >
                  {ch}
                </span>
              ))}
            </span>
            <span> </span>
          </span>
        ))}
      </div>
      <h2 style={{ color: "wheat", marginTop: "2vh", marginLeft: "12vh" }}>
        {countdown}
      </h2>
      <textarea
        ref={textinput}
        style={{ width: "190vh", marginLeft: "12vh", marginTop: "3vh" }}
        disabled={status === "finished"}
        className="form-control mb-2"
        placeholder="Start typing..."
        onKeyDown={handleKeydown}
        value={currInput}
        onChange={(e) => {
          setCurrInput(e.target.value);
        }}
        rows={3}
      />
      {userin ? (
        <>
          <div style={{ display: "flex" }}>
            {status === "finished" && (
              <Button
                variant="outline-primary"
                className="mt-3"
                style={{
                  fontSize: "4vh",
                  marginLeft: "20em",
                }}
                onClick={restart}
              >
                Restart
              </Button>
            )}

            {status === "finished" && (
              <Button
                variant="outline-primary"
                className="mt-3"
                style={{
                  fontSize: "4vh",
                  marginLeft: "10vh",
                }}
                onClick={() => handleadd()}
              >
                Add to Records
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          {status === "finished" && (
            <Button
              variant="outline-primary"
              className="mt-3"
              style={{
                fontSize: "4vh",
                marginLeft: "25em",
              }}
              onClick={restart}
            >
              Restart
            </Button>
          )}
        </>
      )}
      {status === "finished" && (
        <div className="columns" style={{ color: "grey" }}>
          <div className="column has-text-centered">
            <p className="is-size-5">Words Per Minute :</p>
            <p className="is-size-1" style={{ color: "wheat" }}>
              {2 * correct_words}
            </p>
          </div>
          <div className="column has-text-centered">
            <p className="is-size-5">Accuracy :</p>
            <p className="is-size-1" style={{ color: "wheat" }}>
              {Math.round((correct_words / (correct_words + incorrect)) * 100)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
