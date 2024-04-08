import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useEffect, useRef } from 'react';

const UserBio = ({ editableFields, editingFields, handleFieldBlur, handleFieldEdit, setEditingFields, updatedField }) => {
    const inputRef = useRef(null);
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
          inputRef.current.blur();
          setEditingFields(prevFields => ({
            ...Object.keys(prevFields).reduce((obj, key) => ({ ...obj, [key]: false }), {}),
            [updatedField]: false,
          }));

        }
      }
      function handleTab() {
        if (inputRef.current) {
            inputRef.current.blur();
            setEditingFields(prevFields => ({
                ...Object.keys(prevFields).reduce((obj, key) => ({ ...obj, [key]: false }), {}),
                [updatedField]: false,
            }));
        }
    }

    useEffect(() => {
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [inputRef]);
  
    return (
    <div className="EditUserBio">
      {editableFields.bio && (
        <div className="card">
          <div className="card-body">
            <h4 className="mb-2">About Me</h4>
            {editingFields.bio || editableFields === "" ? (
              <div className="form-floating">
                <textarea type="text"
                ref={inputRef}
                defaultValue={editableFields.bio}
                onBlur={(event) => {handleFieldBlur('bio', event.target.value)}}
                onKeyDown={(event) => {
                    if(event.key === 'Tab'){
                      event.preventDefault();
                      event.stopPropagation();
                      handleTab();
                    }}}
                className="form-control" id="floatingTextarea2" style={{height: 400}}
                placeholder='Here is a short description about myself...' />
            </div>
              ) : (
              <div className="mb-1" onClick={() => handleFieldEdit('bio')}> 
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>{editableFields.bio}</ReactMarkdown></div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBio;