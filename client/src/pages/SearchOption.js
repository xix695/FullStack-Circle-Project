import { useState, useEffect } from 'react';
import './css/Search.css';
import Cookies from 'js-cookie';
import Axios from 'axios';

export default function SearchOption() {
  let username = Cookies.get('username');
  const [search1, setSearch1] = useState(false)
  const [search2, setSearch2] = useState(false)
  const [search3, setSearch3] = useState(false)
  const [search4, setSearch4] = useState(false)

  const [filteredData, setFilteredData] = useState([]);
  const [filteredData2, setFilteredData2] = useState([]);
  const [stringEntered, setStringEntered] = useState("");
  const [filteredUser, setfilteredUser] = useState("");
  const [filteredUser2, setfilteredUser2] = useState("");


const HandleSearch1 = ()=>{

  setSearch1(true);
  setSearch2(false);
  setSearch3(false);
  setSearch4(false);

}

const HandleSearch2 = ()=>{

  setSearch1(false);
  setSearch2(true);
  setSearch3(false);
  setSearch4(false);

}

const HandleSearch3 = ()=>{

  setSearch1(false);
  setSearch2(false);
  setSearch3(true);
  setSearch4(false);

}

const HandleSearch4 = ()=>{

  setSearch1(false);
  setSearch2(false);
  setSearch3(false);
  setSearch4(true);

}

useEffect(() => {
  const fetchData = async () => {
    // get posts with specific string
    if(search1){
    try {
      const response = await Axios.get(`http://localhost:8080/posts/getAll/${stringEntered || 'empty'}`);
      if (response.status === 200) {
        setFilteredData(response.data.posts);
      } else {
        console.error(`Error loading posts data. Status: ${response.status}`);
        console.error(response);
      }
    } catch (error) {
      console.error("Error loading posts data:", error);
    }
    // get comments with specific string
    try {
      const response2 = await Axios.get(`http://localhost:8080/comments/getAll/${stringEntered || 'empty'}`);
      if (response2.status === 200) {
        setFilteredData2(response2.data.comments);
      } else {
        console.error(`Error loading comments data. Status: ${response2.status}`);
        console.error(response2);
      }
    } catch (error) {
      console.error("Error loading comments data:", error);
    }
  }

  else if(search2){

       // get posts with specific author
       try {
        const response = await Axios.get(`http://localhost:8080/posts/getAll/author/${stringEntered || 'empty'}`);
        if (response.status === 200) {
          setFilteredData(response.data.posts);
        } else {
          console.error(`Error loading posts data. Status: ${response.status}`);
          console.error(response);
        }
      } catch (error) {
        console.error("Error loading posts data:", error);
      }

        // get comments with specific author
    try {
      const response2 = await Axios.get(`http://localhost:8080/comments/getAll/author/${stringEntered || 'empty'}`);
      if (response2.status === 200) {
        setFilteredData2(response2.data.comments);
      } else {
        console.error(`Error loading comments data. Status: ${response2.status}`);
        console.error(response2);
      }
    } catch (error) {
      console.error("Error loading comments data:", error);
    }
  }

  else if(search3){

     // get user with most posts
     try {
      const response = await Axios.get("http://localhost:8080/posts/most");
      if (response.status === 200) {
        setfilteredUser(response.data.user.createBy);
        
      } else {
        console.error(`Error loading user data. Status: ${response.status}`);
        console.error(response);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }


    try {
      const response = await Axios.get("http://localhost:8080/posts/least");
      if (response.status === 200) {
        setfilteredUser2(response.data.user.createBy);
        console.log(response.data.user);
      } else {
        console.error(`Error loading user data. Status: ${response.status}`);
        console.error(response);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }

  }

  else if(search4){

    // get user with most posts
    try {
     const response = await Axios.get("http://localhost:8080/ranking/highest");
     if (response.status === 200) {
       setfilteredUser(response.data.user.author);
       
     } else {
       console.error(`Error loading user data. Status: ${response.status}`);
       console.error(response);
     }
   } catch (error) {
     console.error("Error loading user data:", error);
   }


   try {
     const response = await Axios.get("http://localhost:8080/ranking/lowest");
     if (response.status === 200) {
       setfilteredUser2(response.data.user.author);
       console.log(response.data.user);
     } else {
       console.error(`Error loading user data. Status: ${response.status}`);
       console.error(response);
     }
   } catch (error) {
     console.error("Error loading user data:", error);
   }

 }

  };

  fetchData();

}, [stringEntered, search1, search2, search3, search4]);


  return (
    <div className='Search'>


      <h2 style={{ color: "green"}} >Welcome {username}</h2>
      <br />
      
         <button className='searchbycontent' onClick={()=>{HandleSearch1()}}>Search content by contained string</button>
         <button className='searchbyuser' onClick={()=>{HandleSearch2()}} >Search content by specific user</button>
         <button className='searchbymostpost' onClick={()=>{HandleSearch3()}} >Search user with most/least posts</button>
         <button className='searchbyleastpost' onClick={()=>{HandleSearch4()}}>Search user with highest/lowest ranking</button>


         {search1 && <label className='search1'>
         Input key words to find relevant content 
          <input onChange={(event)=>{setStringEntered(event.target.value)}}/>
         
         </label>}

         {search2 && <label className='search2'>
           Input specific user to get all contents from the user
        <input onChange={(event) => { setStringEntered(event.target.value) }} />
        </label>}


         {search3 && <label className='search4'>
         These are the users who post the most/least posts
         </label>}

         {search4 && <label className='search6'>
         These are the users who got the with lowest ranking for his or her messages/replies
         </label>}
         
       <div className='searchinposts'>
          
          {

           (search1||search2) &&
            
            (filteredData.map((value, key)=>{

              return(
            

        <div className='datainPost'>
              
                            <p>content{value.postText}</p>
                            <p>author: {value.createBy}</p>
                            <p>create at: {value.created_at}</p>

          {value.screenshot && (
          <img
            src={`http://localhost:8080/images/${value.screenshot}`}
            alt=""
            style={{ width: "400px", height: "300px" }}
          />
        )}

              </div> 

              )

            })
  )
          }
       
       <div className='searchinComment'>
          
          {

           (search1||search2) &&
            
            (filteredData2.map((value, key)=>{

              return(
            

        <div className='dataincomment'>
              
                            <p>content:{value.comment}</p>
                            <p>author: {value.createBy}</p>
                            <p>create at: {value.created_at}</p>

          {value.screenshot && (
          <img
            src={`http://localhost:8080/images/${value.screenshot}`}
            alt=""
            style={{ width: "400px", height: "300px" }}
          />
        )}
              </div> 

              )

            })
  )
          }
       </div>

       {search3&&<p>The User with the most posts is {filteredUser}</p>}
       {search3&&<p>The User with the least posts is {filteredUser2}</p>}

       {search4&&<p>The User with the highest ranking is {filteredUser}</p>}
       {search4&&<p>The User with the lowest ranking is {filteredUser2}</p>}

       </div>
      
    </div>
  )
}



