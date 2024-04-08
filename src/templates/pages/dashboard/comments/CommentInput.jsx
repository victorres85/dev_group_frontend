import './comments.css';
import TextareaAutosize from 'react-textarea-autosize';
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState } from 'react';
import { handleSubmitV2 } from '../../../../utils/fetchData';

const CommmentInput = ({commentOn, parentUid, placeholder, inner, commentHandler}) => {
    const user = JSON.parse(localStorage.getItem('user_data'));
    const fetchUrl = '/api/comment/add';
    const fetchMethod = 'POST';
    const [editableFields, setEditableFields] = useState({
        obj: commentOn,
        object_uid: '',
        comment: '',
      });

    useEffect(() => {
        if (parentUid){
            setEditableFields({...editableFields, object_uid: parentUid})
        }
    }, [parentUid]);

    const handleChange = (event) => {
        setEditableFields({...editableFields, comment: event.target.value})
    }

    async function handleSubmitComment(event){
        await handleSubmitV2(event, editableFields, fetchUrl, fetchMethod);
        commentHandler('add');
    }

  return (
    <div className={`card d-flex flex-row w-100 gap-2 p-3 rounded-top-0 mb-0 ${inner === true && 'border-top-0'}`}
            style={{border:commentOn === 'comment' && 0}}> 
            <img
            className="postProfileImg"
            src={user.picture}
            alt=""
            />
            <TextareaAutosize minRows={1}
                            placeholder={placeholder}
                            className='pe-5 w-100 form-control'
                            style={{position:'relative'}}
                            onChange={(event)=>handleChange(event)}/>
            <SendIcon style={{position:'absolute', bottom:23, right:20}} 
                    className='sendIcon'
                    onClick={(event)=>handleSubmitComment(event)}/>
    </div>
  );
};

export default CommmentInput;