import Post from "../post/Post";
import Share from '../share/Share';
import "./feed.css";
import { useState, useEffect, useRef } from "react";
import Loading from "../../Loading";
import Rightbar from "../rightbar/Rightbar";
import { fetchPosts } from "../../../../utils/fetchData";

export default function Feed() {
  const localPosts = JSON.parse(localStorage.getItem('posts'));
  const [posts, setPosts] = useState(localPosts);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [message, setMessage] = useState('');
  const [searchedPosts, setSearchedPosts] = useState(null);
  const [skip, setSkip] = useState(20);
  const [limit, setLimit] = useState(23);
  const [showLoadingMessage, setShowLoadingMessage] = useState(true);
  const addMorePosts = useRef(null);

  useEffect(() => {
    console.log('Posts: ', localPosts);
  }, []);

  function updateLocalPosts(data){
    console.log('initiating updateLocalPosts');
    console.log('Data: ', data);
    let newPosts = data;
    let existingUids = posts.map(post => post.uid);
    let filteredData = data.filter(dt => dt.uid && !existingUids.includes(dt.uid));
    console.log('Filtered Data: ', filteredData);
    let newData = [...posts, ...filteredData];

    newPosts = newData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    localStorage.setItem('posts', JSON.stringify(newPosts));
    setPosts(newPosts);

    updateSkipLimit(newPosts);
    setIsLoadingData(false);
    console.log('Endin updateLocalPosts');
    console.log('New Posts: ', newPosts);
  }
  
  const updateSkipLimit = (data) => {
    const newSkip = data.length;
    const newLimit = data.length + 3;
    setSkip(newSkip);
    setLimit(newLimit);
    localStorage.setItem('skip', newSkip);
    localStorage.setItem('limit', newLimit); 
  }

  const observer = new IntersectionObserver(
    async ([entry]) => {
      if (entry.isIntersecting && posts && posts.length > 0) {
        if (!isLoadingData){
          handleFetchPosts();
        }
      }
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0
    }
  );

  const handleFetchPosts = async () => {
    setIsLoadingData(true);
    fetchPosts(skip, limit).then((data) => {
      updateLocalPosts(data);
    }).catch((error) => {
      setShowLoadingMessage(false);
      console.log('Error: ', error);
      setMessage('Error: on retrieving data.');
      setIsLoadingData(false);
    });
  }


  useEffect(() => {
    const handlePosts = () => {
      const uids = new Set(posts.map(item => item.uid));
      const filteredPosts = searchedPosts.filter(item => !uids.has(item.uid));
      const result = [...posts, ...filteredPosts];
      setPosts(result)
    }
    if (Array.isArray(searchedPosts) && Array.isArray(posts)){
      handlePosts();
    }
  },[searchedPosts]);

  useEffect(() => {
    if (!isLoadingData){
      if (addMorePosts.current) {
        observer.observe(addMorePosts.current);
      }
      return () => {
        if (addMorePosts.current) {
          observer.unobserve(addMorePosts.current);
        }
      };
    } 
  }, [addMorePosts, skip]);


  // clean message after 5 seconds
  useEffect(() => { if (message){ setTimeout(() => { setMessage(''); }, 5000);} },[message]);
  useEffect(() => { if (Array.isArray(posts)){ setIsLoading(false); }},[posts]);


  useEffect(() => {
    if (Array.isArray(posts) && posts.length > 0){
      setIsLoading(false);
    }
  },[posts]);

  return (
    <div className="d-flex w-100">
      <div className="feed">
        <div className="feedWrapper">
          {message && <p>{message}</p>}
          {!isLoading && <Share canEdit={false} updateLocalPosts={updateLocalPosts}/>}
          {Array.isArray(searchedPosts) && searchedPosts.map((p) => (
            <Post key={p.uid} post={p} inner={false}/>
          ))
          }
          {isLoading ? <Loading/> :
          Array.isArray(posts) && posts.length > 0 &&
          posts.map((p) => {
            return <Post key={p.uid} post={p} inner={false} updateLocalPosts={updateLocalPosts}/>
          })}
          <div ref={addMorePosts}></div>
        </div>
        {isLoadingData && !isLoading && 
          showLoadingMessage &&
          <div style={{height:'50px', transform:'scale(.5)'}}><Loading/></div>
        }
        {isLoadingData && !isLoading && 
          !showLoadingMessage &&
          <p>No more messages to be Loaded</p>}
      </div>
      <Rightbar setSearchedPosts={setSearchedPosts}/>
    </div>
  );
}