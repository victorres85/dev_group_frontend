import { useEffect, useState } from 'react';
import Loading from '../../Loading';
import SoftwareProfile from './profile/SoftwareProfile';
import SoftwareRightBar from './rightBar/softwareRightBar';
import { useParams } from 'react-router-dom';
import { fetchSoftware } from '../../../../utils/fetchData';
import { useQuery } from '@tanstack/react-query';
import updateLocalStorage from '../../../../utils/updateLocalStorage';

function Software({addNew}) {  
  const softwareList = JSON.parse(localStorage.getItem('softwareList'))
  const { softwareUid } = useParams();
  const [ software, setSoftware ]  = useState(softwareList.find(software => software.uid === softwareUid));
  const [canEdit, setCanEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data, status } = useQuery({
    queryKey: ['fetch-software'],
    queryFn: fetchSoftware(softwareUid),
  });

  useEffect(() => {
    if (status === 'success') {
      if (JSON.stringify(software) !== JSON.stringify(data)){
        setSoftware(data);
        updateLocalStorage('softwareList', data)
      }
    }
  }, [data, status]);
  
  const [editingFields, setEditingFields] = useState({
    name: false,
    image: false,
    project_type: false,
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
    uid: null,
    name:  null,
    image: null,
    project_type:  null,
    client:  null,
    problem: null,
    solution: null,
    comments: null,
    company: null,
    link: null,
    stacks: [],
  });

  useEffect(() => {
    editableFields.uid= software ? software.uid : null,
    editableFields.name= software ? software.name : null,
    editableFields.image= software ? software.image : null,
    editableFields.project_type= software ? software.project_type : null,
    editableFields.client= software ? software.client : null,
    editableFields.problem= software ? software.problem : null,
    editableFields.solution= software ? software.solution : null,
    editableFields.comments= software ? software.comments : null,
    editableFields.company= software ? software.company : null,
    editableFields.link= software ? software.link : null,
    editableFields.stacks= software && Array.isArray(software.stacks) ? software.stacks : []
}, [software]);

  function handleFieldEdit(field){
    if (canEdit){
    setEditingFields(prevState => ({ ...prevState, [field]: true }));
    }
  }

  function handleFieldBlur(field, value){
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
      console.log('error', error)
    }
  }

function handleFieldChange(field, value){
  if (canEdit){
    setEditableFields(prevState => ({ ...prevState, [field]: value }));
    }
}

useEffect(() => {
    async function getSoftware() {
      const softwareData = await fetchSoftware(softwareUid);
      setSoftware(softwareData)
    }
    if (softwareUid !== undefined) {
      getSoftware();       
    }
}, [softwareUid]);

useEffect(()=>{
 if (software){
  setIsLoading(false)
 }
},[software])

  return (
    isLoading ? <Loading /> :
    <div className="d-flex w-100 gap-5">
        <div className="feed">
            <SoftwareProfile 
                editingFields={editingFields} 
                setEditingFields={setEditingFields} 
                editableFields={editableFields} 
                setEditableFields={setEditableFields} 
                handleFieldEdit={handleFieldEdit}
                handleFieldBlur={handleFieldBlur}
                canEdit={canEdit}
                setCanEdit={setCanEdit}
                addNew={addNew}
                softwareUid={softwareUid}
                />

        </div>
        <SoftwareRightBar setEditingFields={setEditingFields} 
            editingFields={editingFields} 
            editableFields={editableFields} 
            setEditableFields={setEditableFields} 
            handleFieldChange={handleFieldChange}
            canEdit={canEdit}
            addNew={addNew}
            editingField={editingFields.company} 
            fieldToEdit={'company'} 
            handleFieldEdit={handleFieldEdit}
        />
    </div>
  );
}

export default Software;
