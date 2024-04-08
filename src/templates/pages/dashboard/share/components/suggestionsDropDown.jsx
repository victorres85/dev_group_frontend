
import capitalize  from '../../../../../utils/capitalize';

const SuggestionsList = ({ suggestions, editableFields, setEditableFields, userList, textRef, setSuggestions }) => {
  
  const handleSuggestionClick = (event, user) => {
    event.preventDefault();
    try{
      event.preventDefault();

      if(user === 'all'){
        const previousTxt = editableFields.text;
        const newTxt = previousTxt.replace(/@(\w{1,})/,  `@all`);
        setEditableFields({
          ...editableFields, 
          text: newTxt,
          tagged_users: userList.map(user => user.uid),});
      }else if ( user !== 'none'){
        const previousTxt = editableFields.text;
        const newTxt = previousTxt.replace(/@(\w{1,})/,  `${capitalize(user.name)}`);

        setEditableFields({
          ...editableFields,
          text: newTxt,
          tagged_users: [...editableFields.tagged_users, user.uid],
        });
      }
      textRef.current.focus();
      const length = textRef.current.value.length;
      textRef.current.selectionStart = length;
      textRef.current.selectionEnd = length;
      setSuggestions([]);
    } catch (error){
        console.error(error)
    }
    }
  if (suggestions.length === 0) {
    return null;
  }
  return (
    <>
      {suggestions.map((user, index) => (
        <div 
          key={user.uid} 
          id={`suggestion-${index}`}
          className="dropdown-item w-100 h-100 btn-outline-primary dropDownNames-item"
          onClick={(event) => handleSuggestionClick(event, user)}
          >
          {user.name}
        </div>
      ))}
    </>
  );
};

export default SuggestionsList;