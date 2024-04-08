import BackgroundImage from '../../../../public/assets/profile-bg.jpg';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
// import baseUrl from '../baseUrl';
import React, { useState, useEffect } from 'react';
import Loading from '../../Loading';
import capitalize from '../../../../utils/capitalize';
import { getIconClass } from '../../../../utils/getIconClass';
import { fetchData, handleSubmit } from '../../../../utils/fetchData';
import DisplayImage from '../../../subComponents/DisplayImage';
import { AddButton, RemoveButton } from '../../../subComponents/Buttons';
import { handleLocalStorage } from '../../../../utils/fetchData';
import { useQuery } from '@tanstack/react-query';



const CompanyTemplate = () => {
  console.log('CompanyTemplate')
  const { companyUid } = useParams();
  const [company, setCompany] = useState()
  const [canEdit, setCanEdit] = useState(false)
  const [superuser, setSuperuser] = useState(false) 
  const [isLoading, setIsLoading] = useState(true); 
  const [message, setMessage] = useState('');
  const [mouseDownTime, setMouseDownTime] = useState(null);
  const [selectedStack, setSelectedStack] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedSoftware, setSelectedSoftware] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isTemplateAdd, setIsTemplateAdd] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [imageKey, setImageKey] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [softwares, setSoftwares] = useState(null)
  const [users, setUsers] = useState(null)
  const user = JSON.parse(localStorage.getItem('user_data'))
  var userList;
  try{
    userList = JSON.parse(localStorage.getItem('userList'))
  }catch{
    userList = null;
  }var softwareList;
  try{
    softwareList = JSON.parse(localStorage.getItem('softwareList'))
  }catch{
    softwareList = null;
  }
  const { data, status } = useQuery({
    queryKey: ['fetch-company'],
    queryFn: fetchData("/api/company/"+companyUid),
  });

  useEffect(() => {
    console.log('useEffect - useQueryData: ', data)
    console.log('useEffect - useQueryStatus: ', status)
    if (status === 'success') {
        setCompany(data);
        setIsLoading(false);
    }
  }, [data, status]);

  useEffect(() => {
    if (softwareList === null){
    handleLocalStorage({ setObject: setSoftwares, data: softwareList, storageName: 'softwareList', endpoint: '/api/software/list'});
    }else{
      setSoftwares(softwareList);
    }
    if (userList  === null){
      handleLocalStorage({ setObject: setUsers, data: userList, storageName: 'userList', endpoint: '/api/user/list'});
    }else{
      setUsers(userList);
    }
  }, []);
  
  useEffect(() =>{
    setTimeout(() => {
      const uploadedImage =  JSON.parse(localStorage.getItem('uploadedImage'))
      setImageUrl(uploadedImage)
      if (uploadedImage){
        setShowImage(true)
      }
  }, 750)
 }, [imageKey])

  useEffect(()=>{
  if (companyUid === undefined ){
    setIsTemplateAdd(true)
    setCanEdit(true)
  }else{
    setIsTemplateAdd(false)
  }
  }, [])

  useEffect(() => {
    if (user.is_superuser){
      setSuperuser(true)
    }
  }, [user.is_superuser]);


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

  const [editingFields, setEditingFields] = useState({
    name: false,
    logo: false,
    description: false,
    users: false,
    locations: false,
    softwares: false,
    stacks: false,
  });

  const [editableFields, setEditableFields] = useState({
    uid: '',
    name: '',
    logo: imageUrl ? imageUrl : '',
    description: '',
    users: [],
    softwares: [],
    locations: [],
    stacks: [],
  });

  const [newAddress, setNewAddress] = useState({
    country:'',
    city:'',
    address:'',
  })

  useEffect(() => {
      editableFields.uid= company ? company.uid : '',
      editableFields.name= company ? company.name : '',
      editableFields.logo= company ? company.logo : '',
      editableFields.description= company ? company.description : '',
      editableFields.users= company && Array.isArray(company.users) ? company.users : [],
      editableFields.softwares= company && Array.isArray(company.softwares) ? company.softwares : [],
      editableFields.locations= company && Array.isArray(company.locations) ? company.locations : [],
      editableFields.stacks= company && Array.isArray(company.stacks) ? company.stacks : []
  }, [company, imageUrl]);

  if (isLoading) {
    return <Loading />
  }

  if (!isTemplateAdd && !company) {
    return <p>Company not found</p>;
  }


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
    const fieldsAreDifferent = Object.keys(editableFields).some(key => {
      return editableFields[key] !== company[key];
    });
    if (fieldsAreDifferent) {
      setCanEdit(true);
    }
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

  const handleRemove = (indexToRemove, type) => {
    switch (type) {
      case "stack":
        setEditableFields(prevFields => ({
          ...prevFields,
          stacks: prevFields.stacks.filter((stack) => !(stack.uid === indexToRemove))
        }));
        setSelectedStack(null)
        break;
      case "software":
        setEditableFields(prevFields => ({
          ...prevFields,
          softwares: prevFields.softwares.filter((software) => !(software.uid === indexToRemove))
        }));
        setSelectedSoftware(null)
        break;
      case "people":
        setEditableFields(prevFields => ({
          ...prevFields,
          users: prevFields.users.filter((user) => !(user.uid === indexToRemove))
        }));
        setSelectedSoftware(null)
        break;
        case "location":
          setEditableFields(prevFields => ({
            ...prevFields,
            locations: prevFields.locations.filter((location) => !(location.address === indexToRemove))
          }));
          setSelectedSoftware(null)
          break;
      default:
        break;
    }
    
  };

  const handleAddPerson = (user) => {
    setEditableFields(prevFields => {
      const userList = prevFields.users || [];
      return {
        ...prevFields,
        users: [...userList, user]
      };
    });
    setSelectedPerson(null)
    setSelectedOption("");
  };


  const handleAddSoftware = (software) => {
    setEditableFields(prevFields => {
      const softwareList = prevFields.softwares || [];
      return {
        ...prevFields,
        softwares: [...softwareList, software]
      };
    });
    setSelectedPerson(null)
    setSelectedOption("");
  };

  const handleAddLocation = (location) => {
    if (location.country && location.city && location.address){
    setEditableFields(prevFields => {
      const locationLisrt = prevFields.locations || [];
      return {
        ...prevFields,
        locations: [...locationLisrt, location]
      };
    });
    setNewAddress(null)
    }else{
      setMessage('Address Incomplete')
    }
  };

  const handleCanEdit = (event) => {
    event.preventDefault();
    setCanEdit(!canEdit);
  } 


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

  const handleLogoChange = (newLogoUrl) => {
    setEditableFields(prevFields => ({
      ...prevFields,
      logo: newLogoUrl
    }));
  };

  useEffect(() => {
    if(company){
      setIsLoading(false);
    }
  },[company])
  return (
    <div>
      <div className="row" style={{ overflow: 'auto', maxHeight: '100%' }}>
        {message && <p>{message}</p>}
        <div className="col-12 col-lg-8 col-xl-8">
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
                  {(superuser && canEdit) ?
                    isTemplateAdd ?
                      <button className="btn btn-outline-success" onClick={(event) => { handleSubmit(event, editableFields, '/api/company/add', 'POST', companyUid, '/companies') }}> Add Company </button>
                      :
                      <button className="btn btn-outline-success" onClick={(event) => { const { stacks, ...newEditableFields } = editableFields; handleSubmit(event, newEditableFields, '/api/company/update', 'PATCH', '/companies/' + companyUid) }}> Save Changes </button>
                    :
                    <span className="btn btn-outline-success m-0 p-1 pt-0 pb-0" onClick={(event) => { handleCanEdit(event) }} ><i className="bi bi-pencil"></i></span>}
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
                  <div onClick={() => handleFieldEdit('description')}>
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{editableFields.description}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="card staff">
            <div className="card-header d-flex flex-row justify-content-between align-items-middle">
              <h4 className="mb-0 ms-1">People</h4>
              {canEdit &&
                <div className='d-flex flex-row justify-content-start align-items-center'>
                  <select className="form-select form-select-sm"
                    value={selectedOption}
                    style={{ maxWidth: 250 }}
                    onChange={(event) => {
                      const sPerson = users.find(us => us.name === event.target.value);
                      setSelectedOption(event.target.value);
                      setSelectedPerson(sPerson ? sPerson : null);
                    }}
                  >
                    <option value="">Add User</option>
                    {users
                      .filter((ul) => !editableFields.users.some(user => user?.uid === ul.uid))
                      .map((s) => (
                        <option key={s.uid} value={s.name}>{capitalize(s.name)}</option>
                      ))}
                  </select>
                  <div className="ms-3 mt-0">
                    <AddButton onClick={() => { handleAddPerson(selectedPerson) }}></AddButton>
                  </div>
                </div>
              }
            </div>
            <div className="card-body d-flex flex-column">
              <div className="d-flex flex-row flex-wrap justify-content-around align-items-center">
                {editableFields.users.map((employee) => (
                  <React.Fragment key={employee.uid}>
                    {!canEdit ?
                      <Link key={employee.uid} to={`/people/${employee.uid}`} style={{ width: '30%', minWidth: '180px', minHeight: '252px' }}>
                        <div className="card border-bottom border-0 border-4 shadow-sm border-primary" style={{ minHeight: '252px' }}>
                          <div className="card-body text-center" >
                            <div className="profile-img rounded-circle" style={{ height: 100 }}>
                              {employee.picture &&
                                <img src={employee.picture} className="rounded-circle p-1 bg-primary" style={{ width: 100, height: 100 }} alt={employee.name} />
                              }
                            </div>
                            <div className="mt-4">
                              <h5 className="mb-1">{employee.name}</h5>
                              <p className="mb-0">{employee.role}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                      :
                      <div key={employee.uid} className="unstyled" style={{ width: '30%', minWidth: '180px', minHeight: '252px' }}>
                        <div className="card border-bottom border-0 border-4 shadow-sm border-primary" style={{ minHeight: '252px' }}>
                          <RemoveButton onClick={() => { handleRemove(employee.uid, 'people') }} />
                          <div className="card-body text-center">
                            <div className="profile-img" style={{ width: 100, height: 100 }}>
                              <img src={employee.picture} className="rounded-circle p-1 bg-primary" style={{ width: 100, height: 100 }} alt={employee.name} />
                            </div>
                            <div className="mt-4">
                              <h5 className="mb-1">{employee.name}</h5>
                              <p className="mb-0">{employee.role}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    }

                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4 col-xl-4">
          <div className="card locationList">
            <div className="card-header">
              <h4 className="mb-0">Where to find:</h4>
            </div>
            {canEdit &&
              <div className='d-flex flex-row justify-content-start align-items-end'>
                <div className='d-flex flex-column justify-content-start gap-1 mt-3 mb-3 ms-3'>
                  <div className='input-group input-group' style={{ maxWidth: 250 }}>
                    <input type="text" className='form-control'
                      defaultValue=''
                      onChange={(event) => { setNewAddress(prevAddress => ({ ...prevAddress, country: event.target.value })) }}
                      placeholder='Country' />
                  </div>
                  <div className='input-group input-group' style={{ maxWidth: 250 }}>
                    <input type="text" className='form-control'
                      defaultValue=''
                      onChange={(event) => { setNewAddress(prevAddress => ({ ...prevAddress, city: event.target.value })) }}
                      placeholder='City' />
                  </div>
                  <div className="form-floating">
                    <textarea type="text"
                      defaultValue=''
                      onChange={(event) => { setNewAddress(prevAddress => ({ ...prevAddress, address: event.target.value })) }}
                      className="form-control" id="floatingTextarea2" style={{ height: 100, width: 250 }}
                      placeholder='Address' />
                  </div>
                </div>
                <div className="ms-3 mb-3">
                  <AddButton onClick={() => { handleAddLocation(newAddress) }}></AddButton>
                </div>
              </div>
            }
            <div className="card-body">
              <ul className="list-unstyled">
                {editableFields.locations.sort((a, b) => a.country.localeCompare(b.country)).map((location) => (
                  <li key={location.address} className='d-flex flex-row justify-content-start align-items-center p-0 mb-3'>
                    {canEdit ? <RemoveButton onClick={() => handleRemove(location.address, 'location')} />
                      :
                      <i className="bi bi-geo-alt-fill me-2"></i>
                    }
                    <div className='d-flex flex-column'>
                      <strong>{location.country}</strong>
                      {location.city}
                      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{location.address}</ReactMarkdown>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card softwares">
            <div className="card-header">
              <h4 className="mb-0">Softwares</h4>
            </div>
            <div className="card-body">
              <div className='d-flex flex-row justify-content-start align-items-center'>
                <select className="form-select form-select-sm ms-3 mb-4"
                  value={selectedOption}
                  style={{ maxWidth: 220 }}
                  onChange={(event) => {
                    const sSoftware = softwares.find(sl => sl.name === event.target.value);
                    setSelectedOption(event.target.value);
                    setSelectedSoftware(sSoftware ? sSoftware : null);
                  }}
                >
                  <option value="">Software Name</option>
                  {softwares
                    .filter((sl) => !editableFields.softwares.some(software => software?.uid === sl.uid))
                    .map((s) => (
                      <option key={s.uid} value={s.name}>{s.name}</option>
                    ))}
                </select>
                <div className="ms-3 mt-0 mb-4">
                  <AddButton onClick={() => { handleAddSoftware(selectedSoftware) }}></AddButton>
                </div>
              </div>
              <ul className="list-unstyled">
                {(editableFields.softwares || []).map((software) => (
                  <li key={software.uid} className='d-flex flex-row justify-content-start align-items-center mb-2'>
                    {canEdit ? <RemoveButton onClick={() => handleRemove(software.uid, 'software')} />
                      :
                      <i className="bi bi-terminal me-2"></i>
                    }
                    <strong>{capitalize(software.name)}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card stacks">
            <div className="card-header">
              <h4 className="mb-0">Stacks</h4>
            </div>
            {
              ["frontend", "backend", "database", "devops"].map(type => {
                const filteredStacks = (editableFields.stacks && editableFields.stacks.length ? editableFields.stacks : []).filter(stack => stack.type?.toLowerCase() === type.toLowerCase());
                return (
                  <div key={type} className="ms-3 mt-2">
                    <div className="d-flex flex-row justify-content-between align-items-center mb-2">
                      <h3>{capitalize(type)}</h3>
                    </div>
                    <ul className="list-unstyled">
                      {filteredStacks.map((stack) => (
                        <li key={stack.uid} className='d-flex flex-row justify-content-start align-items-center mb-2'>
                          <i className={getIconClass(type)}></i>
                          <strong id={stack.uid}>{capitalize(stack.name)}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div> 
  );
}

export default CompanyTemplate;
