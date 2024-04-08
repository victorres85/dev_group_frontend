import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loading from '../../Loading';
import { fetchData } from '../../../../utils/fetchData';
import { handleLocalStorage } from '../../../../utils/fetchData';
import { useQuery } from '@tanstack/react-query';
import CompanyRightBar from './rightBar/CompanyRightBar';
import CompanyProfile from './profile/CompanyProfile';



const CompanyTemplate = () => {
  const { companyUid } = useParams();
  const companyList = JSON.parse(localStorage.getItem('companyList'))
  const [softwares, setSoftwares] = useState(null)
  const [users, setUsers] = useState('')
  const [user , setUser] = useState('')
  const [company, setCompany] = useState(null)
  const [canEdit, setCanEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(true); 
  const [message, setMessage] = useState(null);
  const [isTemplateAdd, setIsTemplateAdd] = useState(false);
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
    logo: '',
    description: '',
    users: [],
    softwares: [],
    locations: [],
    stacks: [],
  });

useEffect(() => {
  var userData = null;
  try{
    userData = JSON.parse(localStorage.getItem('user_data'))
    setUser(userData)
  }catch{
    console.log('No user data found')
    window.location.href = '/logout'
  }

  var userList;
  try{
    userList = JSON.parse(localStorage.getItem('userList'))
    if (Array.isArray(userList)){
      setUsers(userList)
    }
  }catch{
    userList = null;
    handleLocalStorage({ setObject: setUsers, data: userList, storageName: 'userList', endpoint: '/api/user/list'});

  }

  var softwareList;
  try{
    softwareList = JSON.parse(localStorage.getItem('softwareList'))
    if (Array.isArray(softwareList)){
      setSoftwares(softwareList)
    }
  }catch{
    softwareList = null;
    handleLocalStorage({ setObject: setSoftwares, data: softwareList, storageName: 'softwareList', endpoint: '/api/software/list'});
  }
}, []);

  useEffect(() => {
    const data = companyList.find(company => company.uid === companyUid)
    setCompany(data)
    setIsLoading(false)
  }, []);

  useEffect(() => {
    editableFields.uid= company ? company.uid : '',
    editableFields.name= company ? company.name : '',
    editableFields.logo= company ? company.logo : '',
    editableFields.description= company ? company.description : '',
    editableFields.users= company && Array.isArray(company.users) ? company.users : [],
    editableFields.softwares= company && Array.isArray(company.softwares) ? company.softwares : [],
    editableFields.locations= company && Array.isArray(company.locations) ? company.locations : []
}, [company]);

  const { data, status, error } = useQuery({
    queryKey: ['fetch-company'],
    queryFn: () => fetchData("/api/company/"+companyUid),
  });

  useEffect(() => {
    if (status === 'success') {
      if (JSON.stringify(company) !== JSON.stringify(data)){
        setCompany(data);
      }
      setIsLoading(false);
    }
  }, [data, status, error]);

  const { data: cStacks, status: sStacks, error: eStacks} = useQuery({
    queryKey: ['fetch-companyStacks'],
    queryFn: () => fetchData("/api/company/"+companyUid+"/stacks"),
  });

  useEffect(() => {
    if (sStacks === 'success') {
        setEditableFields(prevFields => ({
          ...prevFields,
          stacks: cStacks
        }));
      }
      else{
        console.log('error', eStacks)
      }
  }, [cStacks, sStacks, eStacks]); 



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


  // useEffect(() => {
  //   if (status === 'success') {
  //     if (JSON.stringify(company) !== JSON.stringify(data)){
  //       setCompany(data);
  //     }
  //     setIsLoading(false);
  //   }
  // }, [data, status, error]);

  useEffect(()=>{
  if (companyUid === undefined ){
    setIsTemplateAdd(true)
    setCanEdit(true)
  }else{
    setIsTemplateAdd(false)
  }
  }, [])




  if (isLoading) {
    return <Loading />
  }

  if (!isTemplateAdd && !company) {
    return <p>Company not found</p>;
  }

  return (
    isLoading ? <Loading /> :
    <div className="d-flex w-100 gap-5 mt-4">
        <div className="feed">
        {message && <p>{message}</p>}
        <CompanyProfile canEdit={canEdit} 
                         isTemplateAdd={isTemplateAdd} 
                         setEditableFields={setEditableFields} 
                         setEditingFields={setEditingFields} 
                         companyUid={companyUid} 
                         editableFields={editableFields} 
                         editingFields={editingFields} 
                         handleFieldChange={handleFieldChange} 
                         setCanEdit={setCanEdit} 
                         user={user}
                         users={users}/>
       
        </div>
        <div className="">
          <CompanyRightBar softwares={softwares} 
                           canEdit={canEdit} 
                           setMessage={setMessage} 
                           editableFields={editableFields} 
                           setEditableFields={setEditableFields} 
                           handleFieldChange={handleFieldChange} 
          />

      </div>
    </div> 
  );
}

export default CompanyTemplate;
