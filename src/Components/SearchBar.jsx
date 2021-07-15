import React, { useState, useRef, useEffect } from "react";
import "./styles/SearchBar.css";

const SearchbarDropdown = (props) => {
  const { options, onInputChange } = props;
  const ulRef = useRef();
  const inputRef = useRef();
  useEffect(() => {
    if (document.getElementById("results") !== null) {
      inputRef.current.addEventListener("click", (event) => {
        event.stopPropagation();
        // ulRef.current.style.display = "flex";
        document.getElementById("results").style.display = "flex";
        onInputChange(event);
      });
      document.addEventListener("click", (event) => {
        // ulRef.current.style.display = "none";
        document.getElementById("results").style.display = "none";
      });
    }
  }, [ulRef, onInputChange]);
  return (
    <div className="search-bar-dropdown">
      <input
        id="search-bar"
        type="text"
        className="form-control shadow-none"
        placeholder="Search and discover..."
        ref={inputRef}
        onChange={onInputChange}
        autoComplete="off"
        style={{ height: "30px" }}
      />
      <ul id="results" className="list-group" ref={ulRef}>
        {options.map((option, index) => {
          return (
            <button
              type="button"
              key={index}
              onClick={(e) => {
                inputRef.current.value = option;
              }}
              className="list-group-item list-group-item-action"
            >
              {option}
            </button>
          );
        })}
      </ul>
    </div>
  );
};

const defaultOptions = [];
for (let i = 0; i < 4; i++) {
  defaultOptions.push(`option ${i}`);
}

function App() {
  const [options, setOptions] = useState([]);
  const onInputChange = (event) => {
    setOptions(
      defaultOptions.filter((option) => option.includes(event.target.value))
    );
  };

  return (
    <div className="App container mt-2 mb-3">
      <SearchbarDropdown options={options} onInputChange={onInputChange} />
    </div>
  );
}

export default App;
