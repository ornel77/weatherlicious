import { useEffect, useState } from "react";
import mapFlag from "./assets/map-flag.png";
import loupe from "./assets/loupe.svg";

// Hook
function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

function searchCharacters(city) {
  return fetch(
    `https://api.weatherapi.com/v1/current.json?key=af2a7d47095743febd975049231105&q=${city}&aqi=no`,
    {
      method: "GET",
    }
  )
    .then((r) => r.json())
    .then((data) => data)
    .catch((error) => {
      console.error(error);
      return [];
    });
}

function App() {
  const [city, setCity] = useState("");
  // API search results
  const [results, setResults] = useState([]);
  const debouncedSearchTerm = useDebounce(city, 900);

  // useEffect(() => {
  //   fetch(
  //     `https://api.weatherapi.com/v1/current.json?key=af2a7d47095743febd975049231105&q=${city}&aqi=no`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => setResults(data))
  //     .catch((err) => console.error(err));
  // }, [city]);

  // API search function

  const handleChange = (e) => {
    setCity(e.target.value);
  };

  // Searching status (whether there is pending API request)
  // const [isSearching, setIsSearching] = useState(false);
  // Debounce search term so that it only gives us latest value ...
  // ... if searchTerm has not been updated within last 500ms.
  // The goal is to only have the API call fire when user stops typing ...
  // ... so that we aren't hitting our API rapidly.
  // Effect for API call
  useEffect(
    () => {
      if (debouncedSearchTerm) {
        // setIsSearching(true);
        searchCharacters(debouncedSearchTerm).then((results) => {
          // setIsSearching(false);
          setResults(results);
        });
      } else {
        setResults([]);
        // setIsSearching(false);
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  );
  console.log(results);
  let time = results?.location?.localtime;
  let realTime = time?.split(" ") || "";
  return (
    <>
      <h1 id="app_title">Weatherlicious</h1>
      <div id="main_content_container">
        <div id="search_bar_container">
        <img src={loupe} alt="loupe-svg" id="loupe"/>
        <input
          id="search_bar"
          type="text"
          value={city}
          onChange={handleChange}
        />
        </div>
        {/* {isSearching && <div>Searching ...</div>} */}
        <div id="city_container" style={city === "" ? {opacity: "0"} : {opacity: 1}}>
          <img id="map_flag" src={mapFlag}></img>
          <h3 id="city_country_txt">
            {" "}
            {results?.location?.name}, {results?.location?.country}{" "}
          </h3>
        </div>
        <div id="condition_container">
          <h3 id="condition_txt"> {results?.current?.condition.text} </h3>
          <img src={results?.current?.condition.icon} alt="" />
        </div>
        <h1 id="degree" style={city === "" ? {opacity: "0"} : {opacity: 1}}>{`${results?.current?.temp_c}°C`}</h1>
        <h3 id="time"> {realTime[1]} </h3>
        <div id="map_container"></div>
      </div>
    </>
  );
}

export default App;
