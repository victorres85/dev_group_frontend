import capitalize from "../../utils/capitalize";
import { useState} from "react";
import baseUrl from '../baseUrl';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRef } from "react";

const StackCard = ({ stack }) => {
  const bUrl = baseUrl()
  const user = JSON.parse(localStorage.getItem('user_data'))
  const [canEdit, setCanEdit] = useState(false);
  const optionsRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [editingFields, setEditingFields] = useState({
    name: false,
    image: false,
    description: false,
    type: false,
  });

  const [editableFields, setEditableFields] = useState({
    uid: stack.uid ? stack.uid : '',
    name: stack.name ? stack.name : '',
    image:  stack.image ? stack.image : '',
    description: stack.description ? stack.description : '',
    type: stack.type ? stack.type : '',
  });


  const jwt_token = localStorage.getItem('jwt_token');  
  const saveChanges = async () => { 
    const formData = new FormData();
    formData.append("uid", editableFields.uid);
    formData.append("image", editableFields.image);
    await fetch(bUrl + '/api/stack/update', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${jwt_token}`
      },
      body: formData,
    });
    setEditingFields({
      name: false,
      image: false,
      description: false,
      type: false
    });
    setButtonEnabled(false)
  };


  function editHandler(){
    if (canEdit){
      setEditingFields({
        name: false,
        image: false,
        description: false,
        type: false
      });
    }
    setCanEdit(!canEdit);
    setShowOptions(false);
  }


  const handleFieldChange = (field, value) => {
    setEditableFields(prevFields => ({
        ...prevFields,
        [field]: value,
      })); 
    setEditingFields(prevState => ({ ...prevState, [field]: false }));
  };

  const handleFieldEdit = (field) => {
    if (!user.is_superuser) {
      return;
    }
    setEditingFields(prevFields => ({
      ...Object.keys(prevFields).reduce((obj, key) => ({ ...obj, [key]: false }), {}),
      [field]: true,
    }));
    const element = document.getElementById(field);
    if (element) element.focus();
    setButtonEnabled(true)
  };

  const handleFieldBlur = (field) => {
    setEditingFields({
      ...editingFields,
      [field]: false,
    });
  };
    return (
      <div key={editingFields.uid} className="d-flex align-items-stretch unstyled">
        <div className="card border-bottom border border-primary w-100 shadow-lg" style={{border:0.2 , position:'relative'}}>
        {user.is_superuser && <MoreVertIcon style={{cursor:'pointer', position:'absolute', top:0, right:0}} onClick={() => setShowOptions(!showOptions)} /> }
        {showOptions && (
                <div ref={optionsRef} className="card d-flex flex-column justify-content-around align-items-start p-0" 
                  style={{position: 'absolute', top: '24px', right:'8px', width:'72px', height:'28px', boxShadow:'0 2px 4px 0 rgba(255,255,255,0.2), 0 1px 2px 0 rgba(255,255,255,0.1)', 
                  overflow:'hidden', zIndex:1}}>
                  <div className="moreVertbtn" 
                  onClick={() => {editHandler()}}>Edit</div>
                </div>
              )}
          <div className="card-body text-center d-flex flex-column justify-content-between align-items-center" style={{width:"200px", height:"280px"}}>
            <div className="stack-img d-flex flex-column justify-content-center align-items-center" style={{height:'105px'}}>
            
            
              {
              editingFields.image  || editableFields.image === null ? 
              (
                <div id={editableFields.uid} className='input-group input-group-sm'>
                  <input id={'input'+editableFields.uid} type="text" className='form-control'
                    defaultValue={editableFields.image}
                    onChange={(e) => handleFieldChange(e.target.value)}
                    onBlur={(event) => {
                      handleFieldChange('image', event.target.value)
                      handleFieldBlur('image')}}
                    placeholder="paste stack image url"/>
                </div>)
              :
              (
                 <img src={editableFields.image} loading="lazy" className="rounded-circle p-1 bg-primary" 
                style={{width:100, height:100}} alt={editableFields.name} 
                onClick={() => {if (canEdit){handleFieldEdit('image')}}}  />
                )
              }
            </div>
            <div className="d-flex flex-column justify-content-start align-items-center">
              {editingFields.name || (editableFields.name === null)  ? (
                    <input type="text"
                    defaultValue={editableFields.name}
                    onBlur={(event) => {
                      handleFieldChange('name', event.target.value)
                      handleFieldBlur('name')}} 
                    placeholder='Stack Name'/>
                  ) : (
                    <h5 className="mb-2" onClick={() => {if (canEdit){handleFieldEdit('name')}}}>
                      {capitalize(editableFields.name)}
                    </h5>
                  )}
              {editingFields.description || (editableFields.description === null)  ? (
                <textarea type="text"
                defaultValue={editableFields.description}
                onBlur={(event) => {handleFieldChange('description', event.target.value); handleFieldBlur('bio')}}
                className="form-control mb-2" id="floatingTextarea2" style={{height: 80, fontSize:'90%'}}
                placeholder='Stack short description...' />
                  ) : (
                    <p className="mb-2" style={{fontSize:'90%'}} onClick={() => {if (canEdit){handleFieldEdit('description')}}}>
                      {capitalize(editableFields.description)}
                    </p>
                  )}
            </div>
            <div>
            {buttonEnabled && canEdit ? <button className="btn btn-sm btn-outline-success" onClick={() => saveChanges()}>Save Change</button> : <p></p>}
            </div>
          </div>
        </div>
      </div>
    );
  };

export default StackCard;