import CompanyInfo from './companyInfo/CompanyInfo';
import People from './people/People';


const CompanyProfile = ({canEdit, isTemplateAdd, setEditableFields, setEditingFields, companyUid, imageKey, editableFields, editingFields, handleFieldChange, setCanEdit, setImageKey, user, users}) => {
  return (
    <>
      <div className="">
        <CompanyInfo canEdit={canEdit} 
                         isTemplateAdd={isTemplateAdd} 
                         setEditableFields={setEditableFields} 
                         setEditingFields={setEditingFields} 
                         companyUid={companyUid} 
                         imageKey={imageKey} 
                         editableFields={editableFields} 
                         editingFields={editingFields} 
                         handleFieldChange={handleFieldChange} 
                         setCanEdit={setCanEdit} 
                         setImageKey={setImageKey} 
                         user={user}/>
      </div>    
      <div className="">
      <People canEdit={canEdit} 
              setEditableFields={setEditableFields} 
              editableFields={editableFields} 
              users={users} />
      </div>
    </> 
  );
}

export default CompanyProfile;