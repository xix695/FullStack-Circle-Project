import { useState, useEffect } from 'react';
import Axios from 'axios';

export default function ThumbsupCount(props) {
  const [hover, setHover] = useState(false);
  const [data, setData] = useState([]);

  const state = props.commentState;

  console.log(state.commentid)

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  const fetchData = async () => {
    try {
      const response = await Axios.get(`http://localhost:8080/thumbs/oncomments/up/${state.commentid}`);
      if (response.status === 200) {
        setData(response.data);
      } else {
        console.log(`Load data error. Status: ${response.status}`);
        console.log(response);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const EventHandler = async (e) => {
    e.preventDefault();

    try {
      await Axios.post("http://localhost:8080/thumbs/oncomment", {
        commentid: state.commentid,
        username: state.username,
        author: state.author,
        up: 1,
        down: 0,
      });

      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
   
    fetchData();
  },);

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >

      <button id="ThumbsUp" onClick={EventHandler}>👍 {data.length}</button>
    </div>
  );
}
