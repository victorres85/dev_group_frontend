import "./rightbar.css";
import { useState, useRef, useEffect } from "react";
import { SearchButton } from "../../../../subComponents/Buttons";
import baseUrl from "../../../../baseUrl";
import Modal from 'react-modal';
import SearchModal from "../../comments/CommentsModal";

export default function SearchRightBar(setMessage, setSearchedPosts) {
  const [users, setUsers] = useState(null);
  const [companies, setCompanies] = useState(null);
  const [softwares, setSoftwares] = useState(null);
  const [stacks, setStacks] = useState(null);
  const [posts, setPosts] = useState(null);
  const usersInput = useRef(null);
  const companiesInput = useRef(null);
  const softwaresInput = useRef(null);
  const stacksInput = useRef(null);

  const bUrl = baseUrl()
  const jwt_token = localStorage.getItem('jwt_token'); 
  const url = '/api/search?on=post';
  let endpoint = url;

  const handleSearch = async (event) =>{
    console.log('starting handleSearch')
    document.body.style.cursor = 'wait'; 
    event.preventDefault();
    if (users){
        endpoint = endpoint + '&users=' + users;
    }
    if (companies){
        endpoint = endpoint + '&companies=' + companies;
    }
    if (softwares){
        endpoint = endpoint + '&softwares=' + softwares;
    }
    if (stacks){
        endpoint = endpoint + '&stacks=' + stacks;
    }
    console.log('endpoint: ', endpoint)
        fetch(bUrl + endpoint, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${jwt_token}`,
        },
        }).then(response => {
          console.log('response from handleSearch: ', response.status)
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
          console.log(' data from search: ')
          console.log(data)
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
        usersInput.current.focus();

    }
    if (field === 'companies'){
        setCompanies(value)
    }
    if (field === 'softwares'){
        setSoftwares(value)
    }
    if (field === 'stacks'){
        setStacks(value)
    }
    }

    useEffect(() => {
      console.log('posts SEARCHRIGHTBAR: ', posts)
    },[posts]);

    return (
      <>
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
                ref={companiesInput}
                value={companies || ''}
                onChange={(event) => {handleInput(event, event.target.value, 'companies')}}
                placeholder='Companies'/>
            </div>
            <div className='input-group input-group-sm mb-2' style={{maxWidth:220}}>
              <input type="text" className='form-control'
                ref={softwaresInput}
                value={softwares || ''}
                onChange={(event) => {handleInput(event, event.target.value, 'softwares')}}
                placeholder='Softwares'/>
            </div>
            <div className='input-group input-group-sm mb-2' style={{maxWidth:220}}>
              <input type="text" className='form-control'
                ref={stacksInput}
                value={stacks || ''}
                onChange={(event) => {handleInput(event, event.target.value, 'stacks')}}
                placeholder='Stacks'/>
            </div>
            
            <div className="d-flex flex-row justify-content-end align-items-center ">
              <SearchButton onClick={(event)=>{handleSearch(event)}}/>
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
        </div>
      </>
    );
  }

