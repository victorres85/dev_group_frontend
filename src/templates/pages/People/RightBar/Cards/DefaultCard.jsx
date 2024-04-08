
import capitalize from "../../../../../utils/capitalize";
import { RemoveButton } from "../../../../subComponents/Buttons";
import DropDownObjects from "../Components/DropDown";

const DefaultCard = ({handleFieldBlur, field, title, setEditableFields, objList, canEdit}) => {
    const key = title.toLowerCase().split(' ')[0]+'s';
        
    const handleAdd = (value) => {
      setEditableFields(prevFields => ({
        ...prevFields,
        softwares: [...prevFields.softwares, value]
      }));

    };

  const handleRemove = (indexToRemove) => {
  try {
      setEditableFields(prevFields => ({
      ...prevFields,
      [key]: prevFields[key].filter((st) => !(st.uid === indexToRemove))
      }));
  }
  catch (error) {
      console.log(error);
  }
  };
    return (    
        <div className="mb-0">
          <div className="card-header d-flex flex-row justify-content-between align-items-center mb-2">
            <h4 className="mb-0">{title}</h4>
          </div>  
          <div className="card-body">  
          <ul className="list-unstyled">
            {field && field.map((software) => (
              <li key={software.uid} className='d-flex flex-row justify-content-start align-items-center mb-2'>
                {canEdit ? <RemoveButton onClick={() => handleRemove(software.uid)} />: <div className="ms-3"></div>}
                <strong id={software.uid}>{capitalize(software.name)}</strong>
              </li>
            ))}
          </ul>
          {canEdit && objList && objList.length > 0 &&
          <DropDownObjects
                      objList={objList} 
                      handleFieldBlur={handleFieldBlur} 
                      field={field} 
                      handleAction={handleAdd} 
                      useAddBtn={true}
                    />
          }
          </div>      
        </div>
      );
};
  
export default DefaultCard;