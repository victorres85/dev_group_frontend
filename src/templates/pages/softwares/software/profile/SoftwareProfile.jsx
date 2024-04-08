import DisplayImage from "../../../../subComponents/DisplayImage";
import EditableDropDown from "../../../../subComponents/EditableDropDown";
import EditableInput from "../../../../subComponents/EditableInput";
import EditableTextArea from "../../../../subComponents/EditableTextArea";
import { newHandleSubmit } from "../../../../../utils/fetchData";
import { useState, useEffect} from "react";
export default function SoftwareProfile({softwareUid, addNew, canEdit, setCanEdit, setEditingFields, setEditableFields, editableFields, editingFields, handleFieldChange, handleFieldBlur, handleFieldEdit, handleMouseDown, handleMouseUp}) {
    const [imageKey, setImageKey] = useState(0);
    const [showImage, setShowImage] = useState(false);

    useEffect(() =>{
      setTimeout(() => {
        setShowImage(true)
    }, 750)
    })


    const user = JSON.parse(localStorage.getItem('user_data'));
    const handleAction = (fetchUrl, fetchMethod, redirect) => {
        const formData = new FormData();
        formData.append('uid',softwareUid);
        for (const key in editableFields) {
          if (typeof editableFields[key] === 'object' && editableFields[key] !== null) {
            if (!Array.isArray(editableFields[key])) {
              formData.append(key, editableFields[key].uid);
            } else {
              let newValue = '';
              editableFields[key].forEach((obj) => {
                newValue += obj.uid + ',';
              });
              formData.append(key, newValue);
            }
          } else {
            formData.append(key, editableFields[key]);
          }
        }

        newHandleSubmit(formData, fetchUrl, fetchMethod, redirect);
      }


    return (
    <div className="card overflow-hidden">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                <div className="d-flex align-items-center justify-content-between gap-2">
                    <EditableInput  editableField={editableFields.name}
                                    editingField={editingFields.name}
                                    setEditingFields={setEditingFields}
                                    handleFieldBlur={handleFieldBlur}
                                    handleFieldEdit={handleFieldEdit}
                                    canEdit={canEdit}
                                    addNew
                                    field='name'
                                    placeholder='Your Name'
                                    classes='mb-'
                                    Tag='h3'/>
                    { user.is_superuser && 
                        (!canEdit ? 
                            <span className="btn btn-outline-success m-0 p-1 pt-0 pb-0" onClick={() => {setCanEdit(!canEdit)}} ><i className="bi bi-pencil"></i></span> 
                            : 
                            (
                             addNew ?
                                <button type="submit" className="btn btn-outline-primary mb-4" onClick={() =>{handleAction(handleAction('/api/software/add', 'POST', '/softwares/'+softwareUid))}} >Add Software</button>
                                :
                                <button className="btn btn-outline-success"  onClick={() =>{handleAction('/api/software/update', 'PATCH', '/softwares/'+softwareUid)}}>Save Changes</button>
                            )    
                            )
                            }
                </div>  
                <div className='d-flex flex-row mt-2 mb-2'>  
                  <EditableDropDown
                        objList={[{'name':'Competition', 'uid':'competition'}, {'name':'Experiential', 'uid':'experiential'}, {'name':'Microsite', 'uid':'microsite'}, {'name':'Quiz', 'uid':'quiz'}, {'name':'VR', 'uid':'vr'}, {'name':'AR', 'uid':'ar'}, {'name':'Web Apps', 'uid':'web_apps'}]}
                        editingField={editingFields.project_type}
                        editableFields={editableFields}
                        setEditableFields={setEditableFields}
                        handleFieldBlur={handleFieldBlur}
                        fieldToEdit='project_type'
                        field={editableFields.project_type} 
                        displayValue={editableFields.project_type}
                        handleFieldEdit={handleFieldEdit}
                        canEdit={canEdit}
                        addNew={addNew}
                      />
                      | 
                    <EditableInput  editableField={editableFields.client}
                                    editingField={editingFields.client}
                                    setEditingFields={setEditingFields}
                                    handleFieldBlur={handleFieldBlur}
                                    handleFieldEdit={handleFieldEdit}
                                    canEdit={canEdit}
                                    addNew
                                    field='client'
                                    placeholder='Client Name'
                                    classes='mb-'
                                    Tag='p'/>

                </div>
                </div>
                <div className="mt-2 d-flex flex-column row-wrap align-items-around justify-content-center gap-3" style={{marginRight:10}}>
                <div className='d-flex flex-row align-items-center justify-content-end'>
                  <span className='pe-2'><i className="bi bi-globe2"></i></span>
                  {canEdit && editingFields.link || (editableFields.link === '')  ? (
                  <input type="text" style={{maxWidth:320, minWidth:250}} className="form-control ms-2 me-2" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                    name="link" defaultValue={editableFields.link} 
                    onBlur={(event) => {handleFieldChange('link', event.target.value)}}  placeholder='Website Url'
                    /> 
                  ):
                  (
                    canEdit ?
                    <p className="btn btn-primary mb-0 me-2" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onClick={() => handleFieldEdit('link')}>Web Page</p> :
                    <a href='editableFields.link' target='_blank' rel='noreferer' className="btn btn-primary mb-0 me-2">Web Page</a>
                  )
                  }
                </div>
                {addNew ? (
                <div className=' me-2 d-flex flex-column align-items-end justify-content-center'>
                  <div className="form-check">
                    <input type="checkbox" id={user.uid}
                    name="contributor" defaultValue={user.uid}
                    className='form-check-input'
                    onChange={(event) => {handleFieldChange('contributor', event.target.value)}} 
                    />
                    <label className='mb-0 ms-2' htmlFor={user.uid}>Have you worked in this project?</label>
                  </div>
                  </div>
                ):
                (
                  ''
                )
                }
              </div>
            </div>
              <div className="mt-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                 {showImage && <DisplayImage key={imageKey} setImageKey={setImageKey} url={editableFields.image} altTxt={editableFields.name} directory={'softwares'}/>}
                </div>
                <div className="d-flex flex-column align-items-start justify-content-between w-75 mb-4" style={{maxWidth:320, minWidth:250}}>
                    <h4 className="mb-2">Problem</h4>
                    <EditableTextArea  editableField={editableFields.problem}
                                        editingField={editingFields.problem}
                                        setEditingFields={setEditingFields}
                                        handleFieldBlur={handleFieldBlur}
                                        handleFieldEdit={handleFieldEdit}
                                        canEdit={canEdit}
                                        addNew
                                        field='problem'
                                        placeholder='Problem'
                                        classes='mb-'
                                        Tag='p'/>
                   
                    <h4 className="mb-2 mt-4">Solution</h4>
                    <EditableTextArea  editableField={editableFields.solution}
                                        editingField={editingFields.solution}
                                        setEditingFields={setEditingFields}
                                        handleFieldBlur={handleFieldBlur}
                                        handleFieldEdit={handleFieldEdit}
                                        canEdit={canEdit}
                                        addNew
                                        field='solution'
                                        placeholder='Solution'
                                        classes='mb-'
                                        Tag='p'/>

                      <h4 className="mb-2 mt-4">Comments</h4>
                    <EditableTextArea   editableField={editableFields.comments}
                                        editingField={editingFields.comments}
                                        setEditingFields={setEditingFields}
                                        handleFieldBlur={handleFieldBlur}
                                        handleFieldEdit={handleFieldEdit}
                                        canEdit={canEdit}
                                        addNew
                                        field='comments'
                                        />

                </div>
              </div>
            </div>
          </div>
  );
}