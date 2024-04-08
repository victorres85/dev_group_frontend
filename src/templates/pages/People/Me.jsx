import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Profile from './Profile/Profile';
import UserRightBar from './RightBar/RightBar';
import { handleUpdateLocalStorage } from '../../../utils/fetchData';
import Loading from '../Loading';
import { handleLocalStorage } from '../../../utils/fetchData';

Modal.setAppElement('#root');

function MyProfile() {  
  const [isLoading, setIsLoading] = useState(true);
  const user_data = JSON.parse(localStorage.getItem('user_data'))
  const [user, setUser] = useState(user_data);
  const [softwares, setSoftwares] = useState();
  const [message, setMessage] = useState(null)

  const [editingFields, setEditingFields] = useState({
    name: false,
    picture: false,
    bio: false,
    role: false,
    joined: false,
    company: false,
    softwares: false,
    stacks: false,
    twitter: false,
    linkedin: false,
    github: false,
    newStack: false,
  });


  const [editableFields, setEditableFields] = useState({
    name: user.name ? user.name : '',
    picture:  user.picture ? user.picture : '',
    bio: user.bio ? user.bio : '',
    role: user.role ? user.role : '',
    joined: user.joined_at ? user.joined_at : '',
    twitter: user.twitter ? user.twitter : '',
    linkedin:  user.linkedin ? user.linkedin : '',
    github: user.github ? user.github : '',
    company: user.company ? user.company : '',
    stacks: user.stacks ? user.stacks : [],
    softwares: user.softwares ? user.softwares : [],
  });

  const saveChanges = async () => {
    document.body.style.cursor = 'wait';
    try{
        const formData = new FormData();
        formData.append("name", editableFields.name);
        formData.append("bio", editableFields.bio);
        formData.append("role", editableFields.role);
        formData.append("joined", editableFields.joined);
        formData.append("twitter", editableFields.twitter);
        formData.append("linkedin", editableFields.linkedin);
        formData.append("github", editableFields.github);
        formData.append("company", editableFields.company.uid);
        const softwareUids = editableFields.softwares ?  editableFields.softwares.map(software => software.uid) : [] ;
        formData.append("softwares", softwareUids);
        const stackUids = editableFields.stacks ?  editableFields.stacks.map(stack => stack.uid) : [] ;
        formData.append("stacks", stackUids);
        formData.append("uid", user.uid);
        handleUpdateLocalStorage({formData:formData, setObject:setUser, storageName:'user_data', endpoint:'/api/user/update'}).
        then(data => { 
          if (data === true) { 
            document.body.style.cursor = 'default';
            setMessage('Changes saved successfully');
          }else{
            document.body.style.cursor = 'default';
            setMessage('Error saving changes');
          }
      }).catch(error => {
        document.body.style.cursor = 'default';
        console.log(error);
        setMessage('Error saving changes');
      });
         
    }catch (error){
        console.log(error);
    }
  }

  useEffect(() => {
    var softwareList;
    try{
      softwareList = JSON.parse(localStorage.getItem('softwareList'));
      setSoftwares(softwareList);
    } catch (error){
      console.log(error);
      softwareList = null;
    }
    if (softwareList === null){
      handleLocalStorage({ setObject: setSoftwares, data:softwareList, storageName: 'softwareList', endpoint: '/api/software/list'});
    }else{
      setSoftwares(softwareList);
    }
  }, []);
  
  useEffect(() => {
    if (softwares){
      setIsLoading(false);
    }
  },[softwares]);

  useEffect(() => {
    setIsLoading(false);
  }, [user]);


  useEffect(() => {
    if (message){
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  }, [message]);

    if (isLoading) {
      return <Loading />;
    }

  return (
    <>      {message && <div className="alert alert-success" role="alert">{message}</div>}

    <div className="d-flex w-100">
        <div className="feed">
            <Profile editingFields={editingFields} 
                setEditingFields={setEditingFields} 
                editableFields={editableFields} 
                setEditableFields={setEditableFields} 
                saveChanges={saveChanges}
                setIsLoading={setIsLoading}/>

        </div>
        <UserRightBar 
            setEditingFields={setEditingFields} 
            editingFields={editingFields} 
            editableFields={editableFields} 
            setEditableFields={setEditableFields} 
            objList={softwares}
        />
    </div>
    </>
  );
}

export default MyProfile;
