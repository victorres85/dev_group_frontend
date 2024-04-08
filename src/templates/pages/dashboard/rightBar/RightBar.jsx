import "./rightbar.css";
import { useRef, useState } from "react";

import { SearchButton } from "../../../subComponents/Buttons";
import baseUrl from "../../../baseUrl";
import TechTalks from "./TechTalks";
import Modal from 'react-modal';
import SearchModal from "./searchRightBar/modal/SearchModal";

export default function Rightbar({setSearchedPosts, setMessage}) {
  const [users, setUsers] = useState(null);
  const [queries, setQueries] = useState(null);
  const [posts, setPosts] = useState(null);
  const usersInput = useRef(null);
  const queriesInput = useRef(null);
  


const handleSearch = async (event) =>{
  document.body.style.cursor = 'wait'; 
  event.preventDefault();
  const bUrl = baseUrl()
  const jwt_token = localStorage.getItem('jwt_token'); 
  const url = '/api/post/search?';
  let endpoint = url;
  if (users){
    endpoint = endpoint + '&users=' + users;
  }
  if (queries){
    endpoint = endpoint + '&queries=' + queries;
  }
  fetch(bUrl + endpoint, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${jwt_token}`,
    },
  }).then(response => {
    if (response.status === 401){
      document.body.style.cursor = 'default'; 
      window.location.href = '/logout';    
    }else if (response.status === 200) {
      document.body.style.cursor = 'default'; 
      return response.json();
    }else if (!response.ok) {
      document.body.style.cursor = 'default';
      setMessage('No Posts Have Been Found');
    }}).
    then(data => {
      // setSearchedPosts(data);
      setPosts(data);
    }).catch(error => {
      console.error('There was an error!', error)
    } );
}
const handleInput = (event, value, field) => {
  event.preventDefault();
  event.stopPropagation();
  if (field === 'users'){
    setUsers(value)
    usersInput.current.focus()
  }
  if (field === 'queries'){
    setQueries(value)
    queriesInput.current.focus()
  }
}

  return (
    <>
    <div className="rightbar">
      <div className="rightbarWrapper">
        <div className="card locationList">
          <div className="card-header">
            <h4 className="mb-0">Search:</h4>
          </div> 
          <div  className="card-body ms-3">
            <div className='input-group input-group-sm mb-2' style={{maxWidth:220}}>
              <input type="text" className='form-control'
                ref={usersInput}
                defaultValue={users || ''}
                onChange={(event) => {handleInput(event, event.target.value, 'users')}}
                placeholder='From'/>
            </div>
            <div className='input-group input-group-sm mb-2' style={{maxWidth:220}}>
              <input type="text" className='form-control'
                ref={queriesInput}
                value={queries || ''}
                onChange={(event) => {handleInput(event, event.target.value, 'queries')}}
                />
            </div>
            <div className="d-flex flex-row justify-content-end align-items-center ">
              <SearchButton onClick={(event)=>{handleSearch(event)}}/>
            </div>
          </div>
        </div>
      <TechTalks />
      </div>
    </div>
    {posts && Array.isArray(posts) && 
      <Modal isOpen={true} onRequestClose={() => setPosts(null)}
        className='d-flex flex-column justify-content-center align-items-center z-index-1000 border-0'
        style={{
          zIndex: '10',
          content: {
            width: '50%',
            maxHeight: '95vh',
            height: 'fit-content',
            margin: 'auto',
            marginTop:'10px',
            position:'relative',
          }
        }}>
            <SearchModal posts={posts} setModal={setPosts}/>
      </Modal> 
      }
      </>
  );
}