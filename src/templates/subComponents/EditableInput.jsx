import capitalize from "../../utils/capitalize";
import XIcon from '@mui/icons-material/X';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useEffect, useRef } from "react";

const EditableInput = ({canEdit, editableField, editingField, setEditingFields, handleFieldBlur, handleFieldEdit, field, placeholder, classes, Tag}) => {
    var Icon = '';
    var updatedField = field;
    switch (field) {
        case 'twitter':
            Icon = XIcon;
            break;
        case 'github':
          Icon = GitHubIcon;
            break;
        case 'linkedin':
          Icon = LinkedInIcon;
            break;
        case 'company':
          updatedField = 'comapany.name';
          break;
        default:
          Icon = '';
        }
        const inputRef = useRef(null);
        function handleClickOutside(event) {
          if (!canEdit) {
          if (inputRef.current && !inputRef.current.contains(event.target)) {
              inputRef.current.blur();
              setEditingFields(prevFields => ({
                ...Object.keys(prevFields).reduce((obj, key) => ({ ...obj, [key]: false }), {}),
                [updatedField]: false,
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
      <input ref={inputRef}  type="text"
      defaultValue={editableField}
      onBlur={(event) => {
        handleFieldBlur(updatedField , event.target.value)}} 
      onKeyDown={(event) => {
        if(event.key === 'Enter' || event.key === 'Tab'){
          event.preventDefault();
          event.stopPropagation();
          handleEnterTab();
        }}}
      placeholder={placeholder}/>
    ) : (
      Tag === 'i' ? 
        <i className={`${classes} p-2 pt-1`} style={{color:'white'}} onClick={() => handleFieldEdit(field)}><Icon className="p-0 m-0" style={{color:"white", height:20, width:'auto'}}/></i> :
        <Tag className={classes} onClick={() => handleFieldEdit(field)}>
            {capitalize(editableField)}
        </Tag>
    )
  );
};

export default EditableInput;