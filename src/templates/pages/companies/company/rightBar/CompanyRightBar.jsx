import './companyRightBar.css';
// import{ useState } from 'react';
import LocationCard from './Cards/LocationCard';
import DefaultCard from '../../../People/RightBar/Cards/DefaultCard';
import StacksCard from '../../../People/RightBar/Cards/StacksCard';

export default function CompanyRightBar({canEdit, setMessage, setEditableFields, editableFields, softwares, handleFieldBlur}) {
  console.log('editableFields', editableFields)
  // const [selectedStack, setSelectedStack] = useState(null);
  // const [selectedSoftware, setSelectedSoftware] = useState(null);
  // const [selectedOption, setSelectedOption] = useState("");

 


  // const handleRemove = (indexToRemove, type) => {
  //   switch (type) {
  //     case "stack":
  //       setEditableFields(prevFields => ({
  //         ...prevFields,
  //         stacks: prevFields.stacks.filter((stack) => !(stack.uid === indexToRemove))
  //       }));
  //       // setSelectedStack(null)
  //       break;
  //     case "software":
  //       setEditableFields(prevFields => ({
  //         ...prevFields,
  //         softwares: prevFields.softwares.filter((software) => !(software.uid === indexToRemove))
  //       }));
  //       // setSelectedSoftware(null)
  //       break;
  //     case "people":
  //       setEditableFields(prevFields => ({
  //         ...prevFields,
  //         users: prevFields.users.filter((user) => !(user.uid === indexToRemove))
  //       }));
  //       // setSelectedSoftware(null)
  //       break;
  //     default:
  //       break;
  //   }
    
  // };

  // const handleAddSoftware = (software) => {
  //   setEditableFields(prevFields => {
  //     const softwareList = prevFields.softwares || [];
  //     return {
  //       ...prevFields,
  //       softwares: [...softwareList, software]
  //     };
  //   });
  //   // setSelectedPerson(null)
  //   // setSelectedOption("");
  // };

    return (
      <div className='company-info pt-0' style={{ width:240, maxHeight: '100%', overflow: 'auto'}}>
        <div className="card Location">
          <div className="card-header">
            <h4 className="mb-0">Where to find:</h4>
          </div>
          <div>  
            <LocationCard canEdit={canEdit} setMessage={setMessage} setEditableFields={setEditableFields} editableFields={editableFields}/>
          </div>
        </div>
        <div className="card softwares">
          <DefaultCard setEditableFields={setEditableFields} 
                       field={editableFields.softwares}  
                       handleFieldBlur={handleFieldBlur} 
                       title='Software Name'
                       canEdit={canEdit}
                       objList={softwares.filter((st) => !editableFields.softwares?.some(ef => ef?.uid === st.uid))}/>
        </div>
        <div className="card stacks">
          <StacksCard setEditableFields={setEditableFields} 
                    field={editableFields.stacks}  
                    handleFieldBlur={handleFieldBlur} 
                    title='Stack Name' 
                    Tag={'h3'}
                    canEdit={false}
                    />
                  
        </div>
            
        </div>
    );
  }