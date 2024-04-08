import './rightbar.css';
import DefaultCard from './Cards/DefaultCard';
import StacksCard from './Cards/StacksCard';


const UserRightBar = ({ editableFields, setEditableFields,
                        editingFields,  setEditingFields, objList}) => {

    const handleFieldChange = (field, value) => {
        if (field.includes('.')) {
          const [parentField, childField] = field.split('.');
          setEditableFields(prevFields => ({
            ...prevFields,
            [parentField]: {
              ...prevFields[parentField],
              [childField]: value,
            },
          }));
          setEditingFields(prevState => ({ ...prevState[parentField],
            [childField]: true }));
        } else {
          setEditableFields(prevFields => ({
            ...prevFields,
            [field]: value,
          })); 
          
        // Set editingFields.twitter to true
        setEditingFields(prevState => ({ ...prevState, field: true })); 
        }
    
      };
    
      const handleFieldBlur = (field) => {
        setEditingFields({
          ...editingFields,
          [field]: false,
        });
      };
    
      const getCardDetails = (title) => {
        switch (title) {
          case 'Softwares':
            return { defaultOption: 'Software Name', fieldToChange: 'software.name', fieldBlur: 'software' };
          case 'Stacks':
            return { defaultOption: 'Stack Name', fieldToChange: 'stack.name', fieldBlur: 'stack' };
          case 'Companies':
            return { defaultOption: 'Company Name', fieldToChange: 'company.name', fieldBlur: 'company' };
          default:
            return { defaultOption: '', fieldToChange: '', fieldBlur: '' };
        }
    };
  
  return (
    <div>
      <div className="card UserRightBar">
        <StacksCard setEditableFields={setEditableFields} 
                    field={editableFields.stacks}  
                    handleFieldBlur={handleFieldBlur} 
                    cardDetails={getCardDetails('Stack Name')} 
                    handleFieldChange={handleFieldChange} 
                    title='Stack Name' Tag={'h3'}
                    canEdit={true}/>
      </div>
      <div className="card softwares">
        <DefaultCard setEditableFields={setEditableFields} 
                     field={editableFields.softwares}  
                     handleFieldBlur={handleFieldBlur} 
                     cardDetails={getCardDetails('Software Name')} 
                     handleFieldChange={handleFieldChange}  
                     title='Software Name'
                     objList={objList}/>
      </div>
    </div>
  );
};

export default UserRightBar;