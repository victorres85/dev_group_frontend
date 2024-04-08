import './comments.css';
import capitalize from "../../../../utils/capitalize";
import timeDifference from "../../../../utils/timeDifference";
import { useEffect, useState, useRef } from "react";
import baseUrl from "../../../baseUrl";
import CommmentInput from "./CommentInput";
import { fetchData } from '../../../../utils/fetchData';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { deleteObject } from '../../../../utils/fetchData';
import TextareaAutosize from 'react-textarea-autosize';
import SendIcon from '@mui/icons-material/Send';
import { handleSubmit } from '../../../../utils/fetchData';


const Commments = ({comment, inner, innerCount, setModal, commentHandler}) => {
  console.log('commentData on Comments: ', comment)
    const [like, setLike] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [canComment, setCanComment] = useState(false);
    const [viewReplies, setViewReplies] = useState(false);
    const [commentData, setCommentData] = useState();
    const [showOptions, setShowOptions] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [hasBeenDeleted, setHasBeenDeleted] = useState(false);
    const optionsRef = useRef(null);
    const user = JSON.parse(localStorage.getItem('user_data'))
    
    const [editableFields, setEditableFields] = useState({
        commentUid: '',
        comment: '',
      });

    useEffect(() => {
      if (commentData){
        setEditableFields({...editableFields, commentUid: commentData.uid, comment: commentData.comment})
      }
    }, [commentData]);

    useEffect(() => {
        if (!comment.created_by){
            fetchData('/api/comment/'+comment.uid)
            .then(data => {
                setCommentData(data);
                setLike(data.likes_count);
            })
        }
        else if (!comment.c_comments){
            fetchData('/api/comment/'+comment.uid)
            .then(data => {
                setCommentData(data);
                setLike(data.likes_count);
            })
        }
        else{
            setCommentData(comment);
            setLike(comment.likes_count);
        }
    }, []);

    
    function editHandler(){
        setCanEdit(true);
        setShowOptions(false);
      }
    
      async function deleteHandler(uid){
        setModal(false)
        const endpoint = '/api/comment/delete/'+uid;
        const deleteComment = await deleteObject(endpoint);
        if (deleteComment.error){
          console.log('error')
          console.log(deleteComment.error)
        }
        else{
          setShowOptions(false)
          setHasBeenDeleted(true)
          console.log(hasBeenDeleted)
          commentHandler('delete');
        }
    
      }

    const likeHandler = () => {
        setLike(isLiked ? like-1 : like+1);
        setIsLiked(!isLiked);
        submitLike();
      }
    
      const handleChange = (event) => {
        setEditableFields({...editableFields, comment: event.target.value})
    }

      const submitLike = () => {
        const bUrl = baseUrl()
        const jwt_token = localStorage.getItem('jwt_token'); 
        const formData = new FormData();
        formData.append('comment_uid', commentData.uid);
        formData.append('like', !isLiked);
        formData.append('user_uid', commentData.created_by.uid)
        fetch(bUrl+'/api/comment/like', {
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
          }
          else{
            console.log('success')
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }

  if (!commentData) {
    return ;
  }
  return (
    <div className={`card d-flex flex-column mt-0 mb-0 rounded-0 ${!inner ? '': 'border border-top-0 border-bottom-0'}`}
        style={{width:!inner ? '100%':'auto', backgroundColor:'#191b1e', position:'relative'}}>
            {commentData && commentData.created_by.name === user.name ?
            <MoreVertIcon style={{cursor:'pointer', position:'absolute', top:0, right:0, zIndex:10}} onClick={() => setShowOptions(!showOptions)} /> : ''
            }
            {showOptions && (
              <div ref={optionsRef} className="card d-flex flex-column justify-content-around align-items-start p-0" style={{position: 'absolute', top: '30px', right:'10px', width:'120px', height:'80px', boxShadow:'0 2px 4px 0 rgba(255,255,255,0.2), 0 1px 2px 0 rgba(255,255,255,0.1)', overflow:'hidden', zIndex:1}}>
              <div className="border border-top-0 border-start-0 border-end-0 moreVertbtn" 
              onClick={() => {editHandler()}}>Edit</div>
              <div onClick={() => {deleteHandler(commentData.uid)}}
              className="moreVertbtn" 
              style={{height:'50%', cursor:'pointer'}}>Delete</div>
              </div>
            )}
        <div className={`card d-flex flex-row justify-content-center align-items-start m-0 border-0 border-bottom-0 rounded-bottom-0 rounded-top-0 ${inner && 'innerComment'}`}>
            <img
            className={`postProfileImg ms-3 mb-0 ${inner ? 'innerImg' : 'mt-4'}`}
            src={commentData.created_by.picture}
            alt=""
            />
            <div className={`card-body ${inner && 'innerCard'}`}>
                <div className="d-flex flex-column justify-content-start align-items-start p-0 m-0">
                    <div>
                        <span className="postUsername p-0 ms-2"
                         style={{fontSize:'90%', color:'rgba(255, 255, 255, .5)'}}>
                        {capitalize(commentData.created_by.name)}
                        </span>
                    </div>
                    {!canEdit ?
                    <div className="m-0 p-0 ms-2 ">{commentData.comment}</div>
                    :
                    <div className='d-flex flex-row w-100 rounded-top-0 mb-0'> 
                        <TextareaAutosize minRows={1}
                                        defaultValue={commentData.comment}
                                        className='pe-5 w-100 form-control'
                                        style={{position:'relative'}}
                                        onChange={(event)=>handleChange(event)}/>
                        <SendIcon style={{position:'absolute', bottom:15, right:6}} 
                                className='sendIcon'
                                onClick={(event)=>handleSubmit(event, editableFields, '/api/comment/update', 'PATCH', 'dashboard')}/>
                </div>
                }
                </div>
            </div>

        </div>
        <div className="card d-flex flex-row gap-2 justify-content-start align-items-center m-0 pb-2 ps-5 border-0 rounded-bottom-0 rounded-top-0"
            style={{fontSize:'75%', color:'rgba(255, 255, 255, .5)'}}>
            <span className="ms-4 me-2">{(timeDifference(commentData.created_at))}</span >
            <span className="comment_btn me-2" onClick={()=>likeHandler()}>{like && like > 0 ? like : ''} Like{like && like >1 ? 's' : ''}</span>
            <span className="comment_btn me-2" onClick={()=>{setCanComment(!canComment)}}>Reply</span>
            {commentData.comment_count > 0 && innerCount <= 1 &&
                <span onClick={()=>{setViewReplies(!viewReplies)}} className="comment_btn">View replies
                </span>
            }
        </div>
        <div style={{backgroundColor:'#212529'}}>
        { viewReplies && commentData.comment_count > 0 && commentData.c_comments.map((c) => (
                 <Commments key={c.uid} comment={c} inner={true} innerCount={innerCount+1} commentHandler={commentHandler}/>
                 ))
            }
        </div>
        <div className='card d-flex flex-row gap-2 justify-content-start align-items-center m-0 pb-2 ps-5 border-0 rounded-bottom-0 rounded-top-0'>
        {canComment && 
            <CommmentInput 
                commentOn={'comment'}
                parentUid={commentData.uid}
                placeholder={'Write a reply...'}
                className='ms-5'
                commentHandler={commentHandler}
                />
        }
        </div>
    </div>
  );
};

export default Commments;