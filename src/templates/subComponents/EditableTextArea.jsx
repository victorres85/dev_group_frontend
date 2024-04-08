
import { useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const EditableInput = ({canEdit, editableField, editingField, setEditingFields, handleFieldBlur, handleFieldEdit, field}) => {
    // console.log('field', field);
    // console.log('editableField', editableField);
    var updatedField = field;
    const inputRef = useRef(null);
    if (field === 'company') {
      updatedField = 'comapany.name';
    }
        function handleClickOutside(event) {
          if (!canEdit){
          if (inputRef.current && !inputRef.current.contains(event.target)) {
              inputRef.current.blur();
              setEditingFields(prevFields => ({
                ...Object.keys(prevFields).reduce((obj, key) => ({ ...obj, [key]: false }), {}),
                [field]: false,
              }));

            }
        }
          }
          function handleEnterTab() {
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
    editingField || (editableField === null)  ? (
        <textarea ref={inputRef} 
            name={updatedField} style={{maxWidth:400, minWidth:250, height:100}} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
            defaultValue={editableField} 
            onBlur={(event) => {handleFieldBlur(updatedField , event.target.value)}}
            onKeyDown={(event) => {
                if(event.key === 'Enter' || event.key === 'Tab'){
                  event.preventDefault();
                  event.stopPropagation();
                  handleEnterTab();
                }}}
            />
    ) : (
      editableField &&
      (
        <div className="mb-1" onClick={() => handleFieldEdit(updatedField)}> 
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{editableField}</ReactMarkdown></div>
      )
    )
  );
};

export default EditableInput;