import { useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import SuggestionsList from './suggestionsDropDown';
import capitalize  from '../../../../../utils/capitalize';

const PostTextArea = ({ editableFields, setEditableFields, userList, user }) => {
  
    const textareaRef = useRef(null);
    const suggesionsListRef = useRef();
    const [suggestions, setSuggestions] = useState(null);
    const [textAreaHeight, setTextAreaHeight] = useState(75);
    const [canEdit, setCanEdit] = useState(false);

    
    const handleTextAreaChange = (event, field, value) => {
    try{
      event.stopPropagation();
      if (field === 'text') {
        setEditableFields({...editableFields, text:value})
        const match = value.match(/@(\w{1,})$/);
        if (match) {
          const search = match[1].toLowerCase();
          const newUserList = [...userList, {uid: "all", name: "all"}]
          const suggestedUsers = newUserList.filter(
              user => user.name.toLowerCase().startsWith(search) );
              setCanEdit(true);
              setSuggestions(suggestedUsers);
        } else {
          setCanEdit(false);  
          setSuggestions(null);
        }
      }
  
    } catch (error){
        console.error(error)
    }
  };

  return (
    <>
    <TextareaAutosize 
      minRows={3}
      ref={textareaRef}
      value={editableFields.text}
      className="form-control form-control-sm me-4 w-100 parentDropDownName rounded"
      style={{ maxWidth: 600, resize:'vertical', overflow:'auto', position:'relative'}}
      aria-describedby="inputGroup-sizing-sm"
      onChange={(event) => {handleTextAreaChange(event, 'text', event.target.value)
      const height = parseInt(event.target.style.height.split('px')[0]);
      setTextAreaHeight(height);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Tab' && suggesionsListRef.current) {
          suggesionsListRef.current.focus();
          event.preventDefault();
        }
      }}
      placeholder={`What's in your mind ${capitalize(user.name.split(' ')[0])}?`}
    />
    {canEdit  &&
    <div className="dropdown-menu show dropDownNames"
    style={{top:textAreaHeight}}
    ref={suggesionsListRef}>
        <SuggestionsList 
        suggestions={suggestions} 
        editableFields={editableFields}
        setEditableFields={setEditableFields}
        setSuggestions={setSuggestions}
        userList={userList}
        textRef={textareaRef}
        />
    </div>
}
  </>
  );
};

export default PostTextArea;