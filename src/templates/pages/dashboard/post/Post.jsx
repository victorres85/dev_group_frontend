import { useEffect, useState, useRef } from "react";
import "./post.css";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import capitalize from "../../../../utils/capitalize";
import LinkCard from "../link_card/LinkCard";
import { Link } from "react-router-dom";
import baseUrl from "../../../baseUrl";
import Modal from 'react-modal';
import CommmentsModal from "../comments/CommentsModal";
import timeDifference from "../../../../utils/timeDifference";
import { deleteObject } from "../../../../utils/fetchData";
import Share from "../share/Share";


export default function Post({ post, inner , setModal, updateLocalPosts}) {
  const [like, setLike] = useState(post.likes_count);
  const [comment, setComment] = useState(post.comment_count);
  const [isLiked, setIsLiked] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [hasBeenDeleted, setHasBeenDeleted] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [openInFull, setOpenInFull] = useState(false);  
  const user = JSON.parse(localStorage.getItem('user_data'))
  console.log('post: ', post)


  const optionsRef = useRef(null);

  const likeHandler = () => {
    setLike(isLiked ? like-1 : like+1);
    setIsLiked(!isLiked);
    submitLike();
  }

  const commentHandler = (action) => {
    if (action === 'add'){
    setComment(prev => parseInt(prev)+1);
    } else if (action === 'delete'){
      setComment(prev => parseInt(prev)-1);
    }
  }
    

  function editHandler(){
    setCanEdit(true);
    setShowOptions(false);
  }
  

  async function deleteHandler(uid){
    setModalIsOpen(false)
    const endpoint = '/api/post/delete/'+uid;
    const deletePost = await deleteObject(endpoint);
    if (deletePost.error){
      console.log(deletePost.error)
    }
    else{
      setShowOptions(false)
      setHasBeenDeleted(true)
    }

  }

  const submitLike = () => {
    const bUrl = baseUrl()
    const jwt_token = localStorage.getItem('jwt_token'); 
    const formData = new FormData();
    formData.append('post_uid', post.uid);
    formData.append('like', !isLiked);
    formData.append('user_uid', post.created_by.uid)
    fetch(bUrl+'/api/post/like', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt_token}`,
        'Accept': 'application/json'
      },
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.error){
        console.log('error')
        console.log(data.error)
      }
      else{
        console.log('success')
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }


  useEffect(() => {
    const checkVisibility = () => {
      if (optionsRef.current) {
        const rect = optionsRef.current.getBoundingClientRect();
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
          setShowOptions(false);
        }
      }
    };
  
    window.addEventListener('scroll', checkVisibility);
    return () => window.removeEventListener('scroll', checkVisibility);
  }, []);
  return (
    <div>
      { 
        hasBeenDeleted
        // !post.created_by
        ? 
        (
        <div className="card">
          Post has been deleted!
        </div> 
      )
      :(
      <div className={`card ${inner === true && 'w-100 mb-0 rounded-bottom-0 border-bottom-0'}`}  style={{position:'relative'}}>
        <div className="postWrapper card-body">
          <div className="postTop">
            <div className="postTopLeft">
              <img
                className="postProfileImg"
                src={post.created_by.picture}
                alt=""
              />
              <span className="postUsername">
                {capitalize(post.created_by.name)}
              </span>
              <span className="postDate">{(timeDifference(post.created_at))}</span>
            </div>
            <div className="postTopRight" style={{position:'relative'}}>
              { inner === false ? post.created_by.name === user.name ?
              <MoreVertIcon style={{cursor:'pointer'}} onClick={() => setShowOptions(!showOptions)} /> : '' :
              <span onClick={() => setModal(false)} className="btn btn-sm btn-outline-success"> X </span>
              }
              {showOptions && (
                <div ref={optionsRef} className="card d-flex flex-column justify-content-around align-items-start p-0" 
                  style={{position: 'absolute', top: '30px', left:'-100px', width:'120px', height:'80px', boxShadow:'0 2px 4px 0 rgba(255,255,255,0.2), 0 1px 2px 0 rgba(255,255,255,0.1)', 
                  overflow:'hidden', zIndex:1}}>
                  <div className="border border-top-0 border-start-0 border-end-0 moreVertbtn" 
                  onClick={() => {editHandler()}}>Edit</div>
                  <div onClick={() => {deleteHandler(post.uid)}}
                  className="moreVertbtn" 
                  style={{height:'50%', cursor:'pointer'}}>Delete</div>
                </div>
              )}
            </div>
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <img 
            className="postImg" 
            src={post.image} alt="" 
            style={{maxHeight:300, maxWidth:300}}/>
            <div className="w-100" style={{fontSize:'110%', maxWidth:'500px'}}>
              <div style={{maxWidth:'500px', maxHeight: openInFull ? '100%' : '200px', overflow: openInFull ? 'auto' : 'hidden', marginBottom: openInFull ? '0' : '20px'}}>
                {canEdit ? 
                <Share post={post} canEdit={true} updateLocalPosts={updateLocalPosts}/>
                :
                <ReactMarkdown rehypePlugins={[rehypeRaw]}
                className={`${!openInFull && 'gradient-text'}`}
                style={{maxWidth:'500px', maxHeight: openInFull ? 'auto' : '200px',
                }}>{post.text}</ReactMarkdown>
                }
              </div>
              <div>
                {!openInFull ? 
                  <div>
                    <OpenInFullIcon 
                        className={`openCloseIcon ${inner && 'innerPost'}`} 
                        onClick={() => setOpenInFull(true)}/>
                  </div>
                  :
                  <div>
                    <CloseFullscreenIcon 
                      className={`openCloseIcon ${inner && 'innerPost'}`} onClick={() => setOpenInFull(false)}/>
                  </div>
                }
              </div>
              {post.link_title &&
                (
                  <Link to={post.link} target="_blank" className="w-100 pb-0">
                  <LinkCard title={post.link_title}
                            description={post.link_description}
                            site_name={post.link_site_name}
                            image={post.link_image}/>
                  </Link>
                )
              }
            </div>
            <div className="d-flex flex-row justify-content-center align-items-center ps-4 pe-4 border-end-0 w-100 gap-5">
              <div onClick={()=>likeHandler()} className='d-flex flex-row justify-content-center align-items-center'>
                <div className="btn btn-sm btn-outline-success likeCommentBtn"
                style={{width:150}}>

                  <ThumbUpOffAltIcon className="likeIcon"/>
                  { like && like > 0 ?
                    <span className="postLikeCounter ms-2">{like} Like{like>1 && 's'}</span> 
                    :
                    <span className="postLikeCounter ms-2">Like</span>
                  }
                </div>
              </div>
              <div className='d-flex flex-row justify-content-center align-items-center'>
                <div className="btn btn-sm btn-outline-success likeCommentBtn"
                  onClick={() => {if (inner === false) {setModalIsOpen(post)}}}>   
                  <ModeCommentOutlinedIcon className="likeIcon"/>
                  { comment && comment > 0 ?
                    <span className="postCommentText ms-2">{comment} Comment{comment>1 && 's'}</span> 
                    :
                    <span className="postCommentText ms-2">Comment</span>
                  }
                </div>
              </div>
            </div>
          </div>
          {modalIsOpen && modalIsOpen.uid === post.uid && 
          <Modal isOpen={true} onRequestClose={() => setModalIsOpen(null)}
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
                <CommmentsModal key={post.uid} post={post} inner={false} innerCount={0} setModal={setModalIsOpen} commentHandler={commentHandler}/>
          </Modal> 
          }
        </div>
      </div>
      )
  }
  </div>
  );
}