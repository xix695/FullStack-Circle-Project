import axios from "axios";
import { useState } from 'react';
import Cookies from 'js-cookie';

const Init = () => {
    const [initState, setInitState] = useState(null);
   
    let username = Cookies.get('username');
    // if(!username) username = "amazing user";

    const EventHandler = () => {
        if (username) {
            axios.get(`http://localhost:8080/init`)
                .then(response => {
                    setInitState(response.data);
                    console.log(response.data);
                })
                .catch(error => {
                    setInitState({ error: error.message });
                    console.error(error);
                });
        } 
    }

    return (
        <div className="initx">
            <h1>This is a database Inilization Page</h1>
            {username && <h2 style={{color:'green'}}>Welcome {username}</h2>}

            {username==="admin"?(<div>

            <h3 className="warning">Warning: This Inilization will cause delete all existing entries in the table if your Database already exists. </h3>
            <button className="init" onClick={EventHandler}>
                Start Database Inilization
            </button>


            </div>):<h2>Sorry, only administrator can access the page</h2>}
            
         
           
            <br />
            {initState && (
                <div>
                    <h3>Response:</h3>
                    <pre>{JSON.stringify(initState, null, 2)}</pre>
                </div>
            )}
            <br/>
       
        </div>
    );
}

export default Init;

