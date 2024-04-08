import { useState, useEffect, useRef } from 'react';
import { DisplayImage } from '../../../subComponents/DisplayImage';
import Modal from 'react-modal';
import PasswordChange from './modal/PasswordChange';
import UserBio from './Bio';
import EditableInput from '../../../subComponents/EditableInput';
import './profile.css';
import { handleLocalStorage } from '../../../../utils/fetchData';
import EditableDropDown from '../../../subComponents/EditableDropDown';

function Profile({editingFields, setEditingFields, editableFields, setEditableFields, saveChanges}) {
    const [imageKey, setImageKey] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [companies, setCompanies] = useState();
    var companyList;
    try{
      companyList = JSON.parse(localStorage.getItem('companyList'));
    }catch (error){
        console.log(error);
    }
    const myRef = useRef();


  useEffect(() => {
    if (!companyList){
      handleLocalStorage({ setObject: setCompanies, data:companyList, storageName: 'companyList', endpoint: '/api/company/list'});
    }else{
      setCompanies(companyList);
    }
  }, []);

  
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
      setEditingFields(prevState => ({ ...prevState, field: true })); 
      }
    };
  
    const handleFieldEdit = (field) => {
      setEditingFields(prevFields => ({
        ...Object.keys(prevFields).reduce((obj, key) => ({ ...obj, [key]: false }), {}),
        [field]: true,
      }));
      const element = document.getElementById(field);
      if (element) element.focus();
    };

    const handleImageChange = (newPictureUrl) => {
      setEditableFields(prevFields => ({
        ...prevFields,
        picture: newPictureUrl
      }));
    };


    const handleFieldBlur = (field, value) => {
      try{
        if (field.includes('.')) {
          const [parentField, childField] = field.split('.');
          if (Array.isArray(editableFields[parentField][childField])) {
            setEditableFields(prevFields => ({
              ...prevFields,
              [parentField]: {
                ...prevFields[parentField],
                [childField]: [...prevFields[parentField][childField], value]
              },
            }));
          }else{
            setEditableFields(prevFields => ({
              ...prevFields,
              [parentField]: {
                ...prevFields[parentField],
                [childField]: value,
              },
            }));
          }
          setEditingFields(prevState => ({ ...prevState[parentField],
            [childField]: true }));
          } else {
              if (Array.isArray(editableFields[field])) {
                setEditableFields(prevFields => ({
                  ...prevFields,
                  [field]: [...prevFields[field], value]
                }));
              } else {
                setEditableFields(prevFields => ({
                  ...prevFields,
                  [field]: value,
                }));
              }
          }
      } catch (error){
        console.log('error', error);
      }
    };

    return (
        <div ref={myRef} style={{maxWidth:'680px'}} > 
        <div className="card overflow-hidden">
          <div className="profileCover bg-dark position-relative mb-4 mt-0" style={{maxHeight:'200px'}}>
            <DisplayImage key={imageKey} url={editableFields.picture} altTxt={editableFields.name} directory='users' setImageKey={setImageKey} onImageChange={handleImageChange}/>
          </div>
          <div className="card-body">
            <div className="mt-5 d-flex align-items-start justify-content-between">
              <div>
                <div className='EditUserName'>
                  <EditableInput  editableField={editableFields.name}
                                  editingField={editingFields.name}
                                  setEditingFields={setEditingFields}
                                  handleFieldBlur={handleFieldBlur}
                                  handleFieldEdit={handleFieldEdit}
                                  field='name'
                                  placeholder='Your Name'
                                  classes='mb-'
                                  Tag='h3'/>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-start">
                    <EditableInput editableField={editableFields.role} 
                                   editingField={editingFields.role} 
                                   setEditingFields={setEditingFields}
                                   handleFieldBlur={handleFieldBlur} 
                                   handleFieldEdit={handleFieldEdit} 
                                   field='role' 
                                   placeholder='My role is...' 
                                   classes='mb-1' 
                                   Tag='p'/>
                  <p className='ms-1 me-1'><strong>|</strong></p> 
                    <EditableDropDown
                        objList={companies}
                        editingField={editingFields.company}
                        editableFields={editableFields}
                        setEditableFields={setEditableFields}
                        handleFieldBlur={handleFieldBlur}
                        fieldToEdit='company'
                        field={editableFields.company} 
                        displayValue={editableFields.company?.name}
                        handleFieldEdit={handleFieldEdit}
                      />
                </div>
                <div className="EditUserJoined">
                  <p className='me-2'>Since</p>
                  <EditableInput editableField={editableFields.joined} 
                                 editingField={editingFields.joined} 
                                 setEditingFields={setEditingFields}
                                 handleFieldBlur={handleFieldBlur} 
                                 handleFieldEdit={handleFieldEdit} 
                                 field='joined' 
                                 placeholder='MM/YYYY' 
                                 classes='mb-3' 
                                 Tag='p'/>
                </div>
              </div>
              <div className='d-flex flex-column justify-content-end'>
                <div className="d-flex justify-content-end">
                  <button className="btn btn-outline-primary"  onClick={saveChanges}>Save Changes</button>
                </div>
                <div className="d-flex flex-row flex-wrap justify-content-end mt-2">
                  <div className='EditUsersTwitter'>
                    <EditableInput editableField={editableFields.twitter} 
                                   editingField={editingFields.twitter} 
                                   setEditingFields={setEditingFields}
                                   handleFieldBlur={handleFieldBlur} 
                                   handleFieldEdit={handleFieldEdit} 
                                   field='twitter' 
                                   placeholder='My X link is...' 
                                   classes='btn btn-outline-primary ms-2' 
                                   Tag='i'/>
                  </div>
                  <div className='EditUsersLinkedin'>
                  <EditableInput editableField={editableFields.linkedin} 
                                 editingField={editingFields.linkedin} 
                                 setEditingFields={setEditingFields}
                                 handleFieldChange={handleFieldChange} 
                                 handleFieldBlur={handleFieldBlur} 
                                 handleFieldEdit={handleFieldEdit} 
                                 field='linkedin' 
                                 placeholder='My Linkedin link is...' 
                                 classes='btn btn-outline-primary ms-2' 
                                 Tag='i'/>
                  </div>
                  <div className='EditUsersGithub'>
                    <EditableInput editableField={editableFields.github} 
                                   editingField={editingFields.github} 
                                   setEditingFields={setEditingFields}
                                   handleFieldBlur={handleFieldBlur} 
                                   handleFieldEdit={handleFieldEdit} 
                                   field='github' 
                                   placeholder='My Github link is...' 
                                   classes='btn btn-outline-primary ms-2' 
                                   Tag='i'/>
                  </div>
                </div>
                <div className="d-flex flex-row flex-wrap justify-content-end mt-2">
                <button onClick={() => setModalIsOpen(true)} className="btn btn-secondary btn-sm">Change Password</button>
                <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}
                  className='d-flex flex-column justify-content-center align-items-center'
                  style={{
                    content: {
                      width: '350px',
                      height: '350px',
                      margin: 'auto',
                      marginTop:'100px',
                      position:'relative'
                    }
                  }}>
                      <button onClick={() => setModalIsOpen(false)} className='btn btn-outline-secondary'
                        style={{position:'absolute', top:'50px', right:'5px', padding:'0px 5px 0px 5px'}}><strong>X</strong></button>
                      <PasswordChange key={modalIsOpen} setModalIsOpen={setModalIsOpen}/>
                </Modal>
                </div>

              </div>
            </div>
          </div>
        </div>
        <UserBio  editableFields={editableFields} 
              editingFields={editingFields} 
              setEditingFields={setEditingFields}
              handleFieldChange={handleFieldChange} 
              handleFieldBlur={handleFieldBlur} 
              handleFieldEdit={handleFieldEdit}
        />
      </div>
    );
    }

export default Profile;