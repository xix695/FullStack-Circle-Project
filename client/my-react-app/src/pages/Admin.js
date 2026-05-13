import '../App.css';
import { useState} from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';

function Admin() {
  let username = Cookies.get('username');
  const [result, setResult] = useState("");
  const [color, setColor] = useState("");
  let privilege = 0;
  const [contents, setContents] = useState("");
  const [ticket, setTickets] = useState([]);
  const [x, setX] = useState(-1);
  const [comment, setComment] = useState("");
  const [closedTickets, setClosedTickets] = useState("");


  const EventHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post("http://localhost:8080/tickets/create", {
        username: username,
        contents: contents,
      });

      if (response.data) {
        setColor("green");
        setResult("Ticket was created successfully.");
        setContents('');
      } else {
        setResult("An error occurred while posting data.");
        setColor("red");
      }
    } catch (error) {
      console.error("Error posting data:", error);
      setResult("An error occurred while posting data.");
      setColor("red");
    }
  };

  const Finduser = async (user) => {
    try {
      const response = await Axios.get(`http://localhost:8080/user/${user}`);

      if (response.status === 200) {
        console.log(response.data[0])
        privilege = response.data[0].privilege;
        console.log(privilege);
        setX(privilege);
      } else {
        console.error(`Error getting user information. Status: ${response.status}`);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error get user information", error.message);
    }
  };

  const HandleDegrade = async (user) => {
    try {
      await Finduser(user).then(async () => {
        const response = await Axios.put(`http://localhost:8080/privilege/update/${user}`, {
          privilege: privilege > 0 ? privilege - 1 : 0,
        });
  
        if (response.status === 200 || response.status === 201) {
          // Handle successful response if needed
          console.log("Privilege updated successfully");
        } else {
          console.error(`Error updating privilege. Status: ${response.status}`);
        }
      });
    } catch (error) {
      console.error("Error updating privilege:", error);
    }
  };

  const HandleUpgrade = async (user) => {
    privilege = privilege + 1;
    try {
      await Finduser(user).then(async () => {
        const response = await Axios.put(`http://localhost:8080/privilege/update/${user}`, {
          privilege: privilege >= 0 ? privilege + 1 : 0,
        });
  
        if (response.status === 200 || response.status === 201) {
          // Handle successful response if needed
          console.log("Privilege updated successfully");
        } else {
          console.error(`Error updating privilege. Status: ${response.status}`);
        }
      });
    } catch (error) {
      console.error("Error updating privilege:", error);
    }
  };

  // close ticket
  const CloseTicket = async (id) => {
    try {
      const response = await Axios.put(`http://localhost:8080/tickets/close/${id}`, {
        comment: comment,
      });
  
      if (response.status === 200 || response.status === 201) {
     
        console.log("Ticket closed successfully");
      } else {
        console.error(`Error closing ticket. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error closing ticket:", error);
    }
  };
  
    const fetchTicket = async () => {
      try {
        const response = await Axios.get("http://localhost:8080/tickets/getAll");
        if (response.status === 200) {
          setTickets(response.data.tickets);
        } else {
          console.log(`Load data error. Status: ${response.status}`);
          console.log(response);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    const fetchClosedTicket = async () => {
      try {
        const response = await Axios.get(`http://localhost:8080/tickets/getAll2/${username}`);
        if (response.status === 200) {
          setClosedTickets(response.data.tickets);
        } else {
          console.log(`Load data error. Status: ${response.status}`);
          console.log(response);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

 

  const refresh = () => window.location.reload(true);

  return (
    <div className="Admin">
      {username && <h2 style={{ color: 'green' }}>Welcome {username}</h2>}

      {username !== "admin" && (
        <div className="tickets">
          <label>Ticket:</label>
          <textarea type="text" value={contents} onChange={(event) => setContents(event.target.value)} />
          <button type="submit" className="submit-button" onClick={EventHandler}>
            Submit
          </button>
          <button className="reset" onClick={refresh}>
            Reset
          </button>
          <h3 style={{ color: color }}>{result}</h3>
        </div>
      )}
      <br />

      {username === "admin" && <button className="ticketBtn" onClick={fetchTicket}>
        Find tickets
      </button>}

      {username !== "admin" && <button className="ticketBtn" onClick={fetchClosedTicket}>
        Find processed tickets
      </button>}

      <br />

      {username === "admin" && (

        <div className="tickets">
          {ticket.length > 0 &&
            ticket.map((value, key) => (
              <div className="eachticket" key={key}>
                <h3>{value.contents}</h3>
                <h2>Created By {value.username}</h2>
                <button className="upgrsde" onClick={() => {HandleUpgrade(value.username)}}>Upgrade</button>
                <button className="degrade" onClick={() => HandleDegrade(value.username)}>Degrade</button>
                <button className='getprivilege' onClick={()=>{Finduser(value.username)}}>user privilege</button>
                {x>=0 && <p>current privilege is {x}</p>}
                <input className="closeInput" type="text" placeholder='input comments here before close the ticket...'
                  onChange={(e)=>{setComment(e.target.value)}}
                />
                <button className='closeBtn' onClick={()=>{CloseTicket(value.id); fetchTicket()}}> Close Ticket</button>

              </div>
            ))}
            {username === "admin" && ticket.length === 0 && <p>No available tickets</p>}
        </div>
      )}

      <br />

      {username !== "admin" && (
        <div className="tickets">
          {closedTickets.length > 0 &&
            closedTickets.map((value, key) => (
              <div className="eachticket" key={key}>
                <h4>original request: {value.contents}</h4>
                <p>Comment: {value.comment}</p>
              </div>
            ))}
            {username !== "admin" && closedTickets.length === 0 && <p>No available processed tickets</p>}
        </div>
      )}
    </div>
  );
}

export default Admin;

