import React, { useState, useEffect } from "react";
import randomwords from "random-words";

export const Text = (currentinput) => {
  const number_of_words = 70;
  const [words, setWords] = useState([]);

  useEffect(() => {
    setWords(generatewords());
  }, []);

  function generatewords() {
    return new Array(number_of_words).fill(null).map(() => randomwords());
  }
  let curr=currentinput.currentinput;
  console.log(currentinput);
  return (
    <div>
      <div className="section mt-3">
        <div className="card">
          <div className="card-content">
            <div className="content">
              {words.map((s, i) => {
                let color;
                s=(s==','?' ':s)
                if (i < currentinput.length) {
                  color = s === currentinput[i] ? "lightgreen" : "pink";
                }
                return (
                  <span key={i} style={{ backgroundColor: color }}>
                    {s}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Text;
