import React, {useState, useEffect} from "react";
import axios from 'axios';

function App() {
  const[eventData, setEventData]  = useState([]);
  const[loading, setLoading]  = useState(false);

  const[name, setName] = useState("");
  const[message, setMessage] = useState("");

  useEffect(() =>{
    const fetchEvents = async () => {
      setLoading(true);

      const res = await fetch('https://eonet.sci.gsfc.nasa.gov/api/v2.1/events');
      const { events } = await res.json();

      console.log(events);

      setEventData(events)
      setLoading(false)

    }

    fetchEvents()

  }, []) 

  var createPerson = (event) => {
    event.preventDefault();
    axios.post( '/api', { person: { name: "Hey", message: "You" }})
    .then( response => { console.log(response) })
  }

  var loadPeople = () => {
    axios.get('/api').then( response => console.log(response.people) )
  }
  
  return (
    <div>
      {/* { loading ? <Loader /> : <Map eventData={eventData} /> } */}


      <form onSubmit={createPerson}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"/>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message"/>
          <input type="submit" value="Submit"/>
      </form>

    </div>
  );
}

export default App;
