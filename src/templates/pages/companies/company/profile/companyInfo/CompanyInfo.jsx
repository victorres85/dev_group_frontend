import BackgroundImage from '../../../../../../../public/assets/profile-bg.jpg';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';
import DisplayImage from '../../../../../subComponents/DisplayImage';
import capitalize from '../../../../../../utils/capitalize';
import rehypeRaw from 'rehype-raw';
import { handleSubmit } from '../../../../../../utils/fetchData';


const CompanyInfo = ({canEdit, setCanEdit, isTemplateAdd, setEditableFields, setEditingFields, companyUid, editableFields, editingFields, handleFieldChange, user}) => {
  const [mouseDownTime, setMouseDownTime] = useState(null);
  // const [showImage, setShowImage] = useState(false);
  const [imageKey, setImageKey] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  const handleLogoChange = (newLogoUrl) => {
    setEditableFields(prevFields => ({
      ...prevFields,
      logo: newLogoUrl
    }));
  };


  const handleMouseDown = () => {
    setMouseDownTime(Date.now());
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    const mouseUpTime = Date.now();
    if (mouseUpTime - mouseDownTime > 200) {
      e.preventDefault();
      window.open(editableFields.link, '_blank', 'noreferer');
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

  const handleFieldBlur = (field) => {
    setEditingFields({
      ...editingFields,
      [field]: false,
    });
  };

  useEffect(() =>{
    setTimeout(() => {
      if (imageUrl){
        setEditableFields(prevFields => ({
          ...prevFields,
          logo: imageUrl
        }));
        // setShowImage(true)
      }
  }, 750)
 }, [imageUrl])


 useEffect(() => {
   if (companyUid === undefined){
   try{
     var imageData = JSON.parse(sessionStorage.getItem('uploadedImage'));
     let sessionImage = imageData.url
     const now = Date.now();
     if (now - imageData.timestamp <= 3000){
       setImageUrl(sessionImage)
     }
   }catch{
     console.log('No image has been uploaded.')
   }
 }
 }, []);

  return (
    <div>
      <div className="card overflow-hidden">
            <div className="profile-cover bg-dark position-relative mb-4" style={{ backgroundImage: `url(${BackgroundImage})` }}>
              <div className="user-profile-avatar shadow position-absolute top-50 start-0 translate-middle-x">
                {canEdit ? (
                  <DisplayImage key={imageKey} url={editableFields.logo} altTxt={editableFields.name} directory='companies' setImageKey={setImageKey} onImageChange={handleLogoChange} />
                ) : (
                  <img src={editableFields.logo} alt={editableFields.logo} />
                )}
              </div>
            </div>
            <div className="card-body">
              <div className="mt-5 d-flex align-items-start justify-content-between">
                <div className="d-flex flex-row align-items-center  justify-content-between gap-4 mb-4 mt-4">
                  {canEdit && editingFields.name || editableFields.name === '' ?
                    (
                      <input type="text" style={{ width: 250 }} className="form-control form-control-sm" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                        name="name" defaultValue={editableFields.name} onBlur={(event) => { handleFieldChange('name', event.target.value) }}
                        placeholder='Company Name' />
                    ) : (
                      <h3 className="mb-2" onClick={() => handleFieldEdit('name')}>{capitalize(editableFields.name)}</h3>
                    )}
                  {(user.is_superuser && canEdit) ?
                    isTemplateAdd ?
                      <button className="btn btn-outline-success" onClick={(event) => { handleSubmit(event, editableFields, '/api/company/add', 'POST', companyUid, '/companies') }}> Add Company </button>
                      :
                      <button className="btn btn-outline-success" onClick={(event) => { handleSubmit(event, editableFields, '/api/company/update', 'PATCH', '/companies/' + companyUid) }}> Save Changes </button>
                    :
                    <span className="btn btn-outline-success m-0 p-1 pt-0 pb-0" onClick={() => { setCanEdit(true) }} ><i className="bi bi-pencil"></i></span>}
                </div>
                <div>
                  {canEdit && editingFields.website || editableFields.website === '' ? (
                    <input type="text" style={{ maxWidth: 320, minWidth: 250 }} className="form-control ms-2 me-2 mt-4" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                      name="website" defaultValue={editableFields.website}
                      onBlur={(event) => { handleFieldChange('website', event.target.value) }} placeholder='Website Url'
                    />
                  ) :
                    (
                      canEdit ?
                        <p className="btn btn-primary me-2 mt-4" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onClick={() => handleFieldEdit('website')}>Web Page</p> :
                        <a href='editableFields.webpage' target='_blank' rel='noreferer' className="btn btn-primary me-2">Web Page</a>
                    )}
                </div>
              </div>
              <div>
                {editingFields.description || editableFields.description === '' ? (
                  <div className="form-floating">
                    <textarea type="text"
                      defaultValue={editableFields.description}
                      onBlur={(event) => { handleFieldChange('description', event.target.value); handleFieldBlur('description') }}
                      className="form-control" id="floatingTextarea3" style={{ height: 400 }}
                    />
                  </div>
                ) : (
                  <div onClick={() => {if(canEdit){handleFieldEdit('description')}}}>
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{editableFields.description}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
    </div> 
  );
}

export default CompanyInfo;