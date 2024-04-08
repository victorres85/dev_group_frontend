
import { useState, useEffect } from 'react';
import baseUrl from '../../../../../baseUrl';
import capitalize from '../../../../../../utils/capitalize';
import { DisplayImage } from '../../../../../subComponents/DisplayImage';

const addSoftware = () => {
  const user = JSON.parse(localStorage.getItem('user_data'))
  const stackList = JSON.parse(localStorage.getItem('stackList'))
  const companyList = JSON.parse(localStorage.getItem('companyList'))
  let softwareList = JSON.parse(localStorage.getItem('softwareList'))
  const [selectedStacks, setSelectedStacks] = useState({});  const [imageKey, setImageKey] = useState(0);
  const [imageUrl, setImageUrl] = useState('');


  useEffect(() => {
    try{
      const data = JSON.parse(sessionStorage.getItem('uploadedImage'));
      let sessionImage = data.url
      const now = Date.now();
      if (now - data.timestamp <= 3000){
        setImageUrl(sessionImage)
      }
    }catch{
      console.log('No image has been uploaded.')
    }
  }, []);
  


  const [editingFields, setEditingFields] = useState({
    name: false,
    image: false,
    type: false,
    client: false,
    problem: false,
    solution: false,
    comments: false,
    company: false,
    userUid: false,
    link: false,
    stacks: false,
  });

  const [editableFields, setEditableFields] = useState({
    name: '',
    image: imageUrl ? imageUrl : '',
    type: '',
    client: '',
    problem: '',
    solution: '',
    comments: '',
    company: '',
    link: '',
    stacks: [],
  });

  const [message, setMessage] = useState('');
  const bUrl = baseUrl()

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const data = new FormData();

    for (const key in editableFields) {
      data.append(key, editableFields[key]);
    }
    data.set('image', imageUrl);
    data.set('stacks', editableFields.stacks.map((stack) => stack.uid));

    const jwt_token = localStorage.getItem('jwt_token');   
    const response = await fetch(bUrl + '/api/software/add', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt_token}`,
      },
      body: data,
    });

    if (response.status === 200) {
      response.json().then(data => {
      softwareList.push({uid: data.uid, name: data.name});
      localStorage.removeItem('softwareList');
      localStorage.setItem('softwareList', JSON.stringify(softwareList));
      });
      setMessage('Software added successfully')
    } else {
      setMessage('Error adding Software')
    }
  };

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

  const handleRemoveStack = (type, indexToRemove) => {
    setEditableFields(prevFields => ({
      ...prevFields,
      stacks: prevFields.stacks.filter((stack) => !(stack.type === type && stack.uid === indexToRemove))
    }));
  };


  const handleAddStack = (type, stack) => {
    if (!editableFields.stacks) {
    editableFields.stacks = [];
    }
    setEditableFields(prevFields => ({
      ...prevFields,
      stacks: [...prevFields.stacks, stack]
    }));
  };

  const handleImageChange = (newLogoUrl) => {
    setEditableFields(prevFields => ({
      ...prevFields,
      logo: newLogoUrl
    }));
  };
  
  return (
    <div>
      {message ? <p>{message}</p> : ''}
    <form onSubmit={handleSubmit} className="row align-items-start" id='div1'>
      <div className="row">
        <div className="col-12 col-lg-9 col-xl-9">
          <div className="card overflow-hidden">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                {editingFields.name || (editableFields.name === '')  ? (
                <input type="text" style={{width:250}} className="form-control form-control-sm" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                  name="name" defaultValue={editableFields.name} onBlur={(event) => {handleFieldChange('name', event.target.value)}} 
                  placeholder='Software Name'/>
                ):(
                  <h3 className="mb-2" onClick={() => handleFieldEdit('name')}>
                    {capitalize(editableFields.name)}
                  </h3>
                )}
                <div className='d-flex flex-row mt-2 mb-2'>  
                {editingFields.type || (editableFields.type === '')  ? (
                  <select name="type" className='form-select form-select-sm' 
                    style={{width:120}} 
                    onChange={(event) => handleFieldChange('type', event.target.value)}
                    onBlur={() => handleFieldBlur('type')}>
                    <option value="">Select type</option>
                    <option value="competition">Competition</option>
                    <option value="experiential">Experiential</option>
                    <option value="microsite">Microsite</option>
                    <option value="quiz">Quiz</option>
                    <option value="vr">VR</option>
                    <option value="vr">AR</option>
                    <option value="web_apps">Web Apps</option>
                  </select> 
                ):(
                  editableFields.type ? <p className="mb-1" onClick={() => handleFieldEdit('type')}>{capitalize(editableFields.type)} </p> : ''
                )}
                  | 

                {editingFields.client || (editableFields.client === '')  ? (
                  <input type="text" style={{width:120}} className="form-control form-control-sm" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                    name="client" defaultValue={editableFields.client} 
                    onBlur={(event) => {handleFieldChange('client', event.target.value)}} 
                    placeholder='Client Name'/>
                ):(
                  editableFields.client ? <p className="mb-1" onClick={() => handleFieldEdit('client')}>{capitalize(editableFields.client)} </p> : ''
                )}
                  </div>
                </div>
              </div>
              <div className="mt-5 d-flex align-items-center justify-content-between gap-2">
                <div className="d-flex align-items-center">
                  <DisplayImage key={imageKey} url={editableFields.image} altTxt={editableFields.name} directory='softwares' setImageKey={setImageKey} onImageChange={handleImageChange}/>
                </div>
                <div className="d-flex flex-column align-items-start justify-content-between w-75" style={{maxWidth:320, minWidth:250}}>
                    <h4 className="mb-2">Problem</h4>
                    {editingFields.problem || (editableFields.problem === '')  ? (
                    <textarea name="problem" style={{maxWidth:400, minWidth:250, height:100}} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                      defaultValue={editableFields.problem} 
                      onBlur={(event) => {handleFieldChange('problem', event.target.value)}}  />
                    ):(
                      editableFields.problem ? <p className="mb-1" onClick={() => handleFieldEdit('problem')}>{editableFields.problem} </p> : ''
                    )}
                    <h4 className="mb-2">Solution</h4>
                    {editingFields.solution || (editableFields.solution === '')  ? (
                    <textarea name="solution" style={{maxWidth:400, minWidth:250, height:100}} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                      defaultValue={editableFields.solution} 
                      onBlur={(event) => {handleFieldChange('solution', event.target.value)}}  />
                    ):(
                      editableFields.solution ? <p className="mb-1" onClick={() => handleFieldEdit('solution')}>{editableFields.solution} </p> : ''
                    )}
                      <h4 className="mb-2">Comments</h4>
                    {editingFields.comments || (editableFields.comments === '')  ? (
                    <textarea name="comments" style={{maxWidth:400, minWidth:250, height:100}} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                      defaultValue={editableFields.comments} 
                      onBlur={(event) => {handleFieldChange('comments', event.target.value)}}  />
                    ):(
                      editableFields.comments ? <p className="mb-1" onClick={() => handleFieldEdit('comments')}>{editableFields.comments} </p> : ''
                    )}
                </div>
              </div>
            </div>
            <div className="mt-2 d-flex flex-column row-wrap align-items-around justify-content-center gap-3" style={{marginRight:10}}>
                <div className='d-flex flex-row align-items-center justify-content-end'>
                  <span className='pe-2'><i className="bi bi-globe2"></i></span>
                  <input type="text" style={{maxWidth:320, minWidth:250}} className="form-control ms-2 me-2" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                    name="link" defaultValue={editableFields.link} onBlur={(event) => {handleFieldChange('link', event.target.value)}}  placeholder='Website Url'/>
                </div>
                <div className=' me-2 d-flex flex-column align-items-end justify-content-center'>
                <div className="form-check">
                  <input
                    type="checkbox"
                    id={user.uid}
                    name="contributor"
                    defaultValue={user.uid}
                    className='form-check-input'
                    onChange={(event) => {handleFieldChange('contributor', event.target.value)}} 
                  />
                  <label className='mb-2 ms-2' htmlFor={user.uid}>Have you worked in this project?</label>
                  </div>
                  <button type="submit" className="btn btn-outline-primary mb-4" onClick={handleSubmit} >Add Software</button>
                </div>
              </div>
          </div>
        </div>
        <div className="col-12 col-lg-3 col-xl-3">
          <div className="card Company">
            <div className="card-header">
              <h6 className="mb-1">Produced by:</h6>
              <select name="company" className='form-select form-select-sm' style={{width:150}}
                value={editableFields.company} 
                onChange={(event) => handleFieldChange('company', event.target.value)}
                onBlur={() => handleFieldBlur('company')}>
                  <option value="">Select company</option>
                  {companyList.map((company, index) => (
                    <option key={index} value={company.uid}>{company.name}</option>
                  ))}
                </select>
            </div>
          </div>
            <div className="card stacks">
              <div className="card-header">
                <h4 className="mb-0">Stacks</h4>
              </div> 
               
              <div className="card-body">
              <div className="mt-2 d-flex align-items-start justify-content-between">
                <div className="d-flex flex-wrap">
            {
              ["frontend", "backend", "database", "devops"].map(type => {
              const filteredStacks = (editableFields.stacks || []).filter(stack => stack.type.toLowerCase() === type.toLowerCase());
              return (
                <div key={type}>
                  <div className="d-flex flex-row justify-content-between align-items-center mb-2">
                    <h3>{type}</h3> 
                  </div>
                  <div className="d-flex flex-row justify-content-center align-items-center mb-2"  id="addingNewStack">
                    <select className="form-select form-select-sm"
                      onChange={(event) => {
                        const selectedStack = stackList.find(st => st.name === event.target.value);
                        setSelectedStacks(prevStacks => ({
                          ...prevStacks,
                          [type]: selectedStack ? selectedStack : null
                        }));
                      }}
                      onBlur={() => handleFieldBlur('stack')}
                      >
                        <option value="">Stack Name</option>
                        {stackList.filter((st) => {
                          // Only include the stack if it's of the correct type and it's not already in filteredStacks
                          return st.type === type && !filteredStacks.find(fs => fs.name === st.name);
                        }).map((st) => (
                        <option key={st.uid} value={st.name}>{st.name}</option>
                      ))}
                    </select>
                    <div className="ms-1">
                      <div className="d-flex justify-content-end">
                        <span className='material-symbols-outlined d-flex justify-content-center align-items-center rounded-5' style={{width:19, height:19}} onClick={() => handleAddStack(type, selectedStacks[type])}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                        </span>
                      </div>
                    </div>  
                  </div>
                  <ul className="list-unstyled">
                    {filteredStacks.map((stack) => (
                      <li key={stack.uid} className='d-flex flex-row justify-content-start align-items-center mb-2'>
                        <div className="material-symbols-outlined me-2 d-flex justify-content-center align-items-center rounded-5" style={{width:19, height:19}} onClick={() => handleRemoveStack(type, stack.uid)}>
                          <svg height="17" viewBox="0 0 24 24" width="17"><path d="M0 0h24v24H0z" fill="none"/><path d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                        </div>
                        <strong id={stack.uid}>{capitalize(stack.name)}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
                ) 
              })
            }
          </div>
          </div>
          </div>
                </div>
            </div>
          </div>
    </form>
    </div>
  );
};

export default addSoftware;