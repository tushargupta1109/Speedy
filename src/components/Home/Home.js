import React, { useState, useEffect, useRef } from "react";
import randomwords from "random-words";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import firebase, { db } from "../Firebase/firebase";
import "./styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const auth = firebase.auth();
  const [userin] = useAuthState(auth);

  const handleadd = async () => {
    const uid = firebase.auth().currentUser.uid;
    if (uid === "") {
      return;
    }
    const obj = {
      Speed: correct_words,
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
          toast.success("Added to records!", {
            position: "top-center",
            autoClose: 2000,
          });
        } else {
          toast.error("Already in records!", {
            position: "top-center",
            autoClose: 2000,
          });
        }
      } else {
        let fav = [{ obj }];
        db.collection("users").doc(uid).set({ fav });
        toast.success("Added to records!", {
          position: "top-center",
          autoClose: 2000,
        });
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
  const correct_words = Math.round((2 * correct) / 4);

  return (
    <div className="cover">
      <div style={{ display: "flex" }}>
        <h1 className="head">Speedy</h1>
        {userin ? (
          <>
            <Link
              to="/Records"
              style={{ color: "white", textDecoration: "none" }}
            >
              <h1 className="head">Records</h1>
            </Link>
            <button className="btn1" onClick={() => out()}>
              Logout
            </button>
          </>
        ) : (
          <button className="btn2" onClick={() => googlelogin()}>
            Login
          </button>
        )}
      </div>
      <div className="mt-2">
        {words.map((word, i) => (
          <span>
            <span key={i}>
              {word.split("").map((ch, j) => (
                <span
                  className={getColor(i, j, ch)}
                  key={j}
                  style={{ fontSize: "4.8vh", color: check(i, j, ch) }}
                >
                  {ch}
                </span>
              ))}
            </span>
            <span> </span>
          </span>
        ))}
      </div>
      <h2 className="countdown">{countdown}</h2>
      <textarea
        ref={textinput}
        disabled={status === "finished"}
        className="form-control"
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
                variant="outline-light"
                className="restart_btn1"
                onClick={restart}
              >
                Restart
              </Button>
            )}

            {status === "finished" && (
              <Button
                 variant="outline-light"
                className="add_btn"
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
              variant="outline-light"
              className="restart_btn2"
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
              {correct_words}
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
      <ToastContainer />
    </div>
  );
};

export default Home;
