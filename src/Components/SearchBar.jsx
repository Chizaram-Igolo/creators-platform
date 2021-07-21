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
                inputRef.current.value = option.title;
              }}
              className="list-group-item list-group-item-action"
            >
              {option["title"]}
              <br />
              <small>{option["author"]}</small>
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

function App(props) {
  const [options] = useState(props.options ? props.options : []);
  const [filteredOptions, setFilteredOptions] = useState([]);

  const onInputChange = (event) => {
    let filteredOptions = options.filter((option) =>
      option["author"].includes(event.target.value)
    );

    setFilteredOptions(filteredOptions.slice(0, 4));
    // console.log(filteredOptions[(0, 5)]);
  };

  return (
    <div className="App container mt-2 mb-3">
      <SearchbarDropdown
        options={filteredOptions}
        onInputChange={onInputChange}
      />
    </div>
  );
}

export default App;
