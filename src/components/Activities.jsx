import React, { useEffect, useState } from 'react';

function Activities({ city }) {
  const [results, setResults] = useState([]);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [activities, setActivities] = useState([])
  useEffect(() => {
    fetch(
      `https://api.opentripmap.com/0.1/en/places/geoname?name=${city}&apikey=5ae2e3f221c38a28845f05b62b5700dd2802ad73fe34149cccbc6838`
    )
      .then((res) => res.json())
      .then((data) => {
        setLatitude(data.lat);
        setLongitude(data.lon);
      });
  }, [city]);

  useEffect(() => {
    console.log('useefect long lat');
    fetch(
      `https://api.opentripmap.com/0.1/en/places/radius?radius=10000&lon=${longitude}&lat=${latitude}&apikey=5ae2e3f221c38a28845f05b62b5700dd2802ad73fe34149cccbc6838`
    )
      .then((res) => res.json())
      .then((data) => setResults(data));
  }, [latitude, longitude]);

  useEffect(() => {
    const features = results?.features;

    const filteredArray = features?.filter((result) =>
      result?.properties?.kinds.includes('adult')
    );
    console.log(filteredArray);
    let xIdArray = [];
    for (let i = 0; i < filteredArray?.length; i++) {
      xIdArray.push(filteredArray[i].properties?.xid);
    }

    const requetes = xIdArray.map((xid) =>
      fetch(
        `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=5ae2e3f221c38a28845f05b62b5700dd2802ad73fe34149cccbc6838`
      )
    );

    Promise.all(requetes)
      .then((responses) =>
        Promise.all(responses.map((response) => response.json()))
      )
      .then((data) => setActivities(data))
      .catch((error) => console.error(error));
  }, [results]);

  return (
    <div className='activity-container'>
      {
        activities.map(activity => (
            <div key={activity.xid} className='activity-item'>
                <h2> {activity.name} </h2>
                <img src={activity.preview?.source} alt="" />
            </div>
        )) 
      }
    </div>
  );
}

export default Activities;
