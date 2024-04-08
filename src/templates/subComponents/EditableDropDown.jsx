import capitalize from "../../utils/capitalize";
import DropDownObjects from "../pages/People/RightBar/Components/DropDown";

const EditableDropDown = ({ objList, editingField, setEditableFields, fieldToEdit, field, handleFieldEdit, displayValue, tag, w}) => {
  let Tag = tag;
  if (!tag){
    Tag = 'p'
  }
  // const handleAdd = (obj) => {
  //   setEditableFields(prevFields => ({
  //     ...prevFields,
  //     [fieldToEdit]: [...prevFields.stacks, obj]
  //   }));
  // };

  const handleReplace = (obj) => {
    setEditableFields(prevFields => ({
      ...prevFields,
      [fieldToEdit]: obj
    }));
  };


  return (
    editingField || (field === null)  ? (
      <div style={{marginTop:'-8px', marginBottom:'-12px'}}>
      <DropDownObjects
      objList={objList} 
      handleAction={handleReplace}
      field={field} 
      useAddBtn={false}
      type={fieldToEdit}
      w={w}
      displayValue={displayValue}
    />
    </div>
    ) : (
        <Tag onClick={() => handleFieldEdit(fieldToEdit)}>
            {capitalize(displayValue)}
        </Tag>
    )
  );
};

export default EditableDropDown;