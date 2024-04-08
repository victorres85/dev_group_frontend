
import Post from '../post/Post';
import './comments.css';
import Commments from './Comments';
import CommmentInput from './CommentInput';
import { useEffect, useState } from "react";
import Loading from '../../../pages/Loading';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from '../../../../utils/fetchData';

const CommmentsModal = ({post, setModal, commentHandler}) => {
  const [postData, setPostData] = useState(post);
  const localPosts = JSON.parse(localStorage.getItem('posts'));
  const [isLoading, setIsLoading] = useState(true);
  const { data, status, error } = useQuery({
    queryKey: ['fetch-full-post'],
    queryFn: () => fetchData('/api/post/'+post.uid),
  });

  useEffect(() => {
    if (status === 'success' && 
        JSON.stringify(data) !==  JSON.stringify(postData)){
      setPostData(data)
      setIsLoading(false);
      const newPosts = localPosts.filter(p => p.uid !== data.uid);
      newPosts.push(data);
      localStorage.setItem('posts', JSON.stringify(newPosts));
    }else if (status === 'error'){
      console.log('error: ', error);
    }
  }), [data, status, error];


  useEffect(() => {
    if (post){
      setPostData(post)
      setIsLoading(false);
    }
  },[post]);
  useEffect(() => {
    // postData.comments.map((comment) => (
      // console.log(comment)
      console.log('Array.isArray(postData.comments : \n', Array.isArray(postData.comments))
      // console.log(Array.isArray(postData.comments))
    // ))
  },[postData]);
  return (
    <>
    {
      isLoading ? 
      <Loading/> 
      :
    <div className='d-flex flex-column w-100 gap-0 justify-content-center align-items-center border-0 pt-5 pb-5'
        style={{height: '100vh', backgroundColor:'#191b1e', overflow: 'auto', position:'relative'}}>
    <div className="mb-5" style={{position: 'absolute', top:'30px', height: '100vh', width:'85%'}}>
    <Post key={postData.uid} post={postData} inner={true} setModal={setModal} />
    {Array.isArray(postData.comments) && postData.comments.map((comment) => (
      <Commments key={comment.uid} comment={comment} inner={true} innerCount={0} setModal={setModal} commentHandler={commentHandler}
      style={{width: '100%'}} />))
    }
    <CommmentInput inner={true} commentOn={'post'} parentUid={post.uid} placeholder={'Write a comment...'} commentHandler={commentHandler}/>
    </div>
    </div>
    }
    </>
  );
};

export default CommmentsModal;