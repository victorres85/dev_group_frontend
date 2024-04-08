import "./share.css";
import PermMediaIcon from '@mui/icons-material/PermMedia';
import AddLinkIcon from '@mui/icons-material/AddLink';
import { useState, useRef} from "react";
import baseUrl from "../../../baseUrl";
import LinkCard from "../link_card/LinkCard";
import Loading from "../../Loading";
import ShareButton from "./components/ShareButton";
import PostTextArea from "./components/PostTextArea";

export default function PostEdit({post, canEdit, updateLocalPost}) {

  var user; 
  try{
    user = JSON.parse(localStorage.getItem('user_data'))
  }catch{
    user = null
  }

  var userList;
  try{
    userList = JSON.parse(localStorage.getItem('userList'))
  }catch{
    userList = null
  }

  const fileInputRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [addLink, setAddLink] = useState(false)
  const [editableFields, setEditableFields] = useState({
    link: '',
    link_title: '', 
    link_description: '', 
    link_image: '',
    text: '',
    image: '',
    tagged_users: ''
  });

  useState(() => {
    if (post){
      setEditableFields({...editableFields, 
        text: post?.text, 
        image: post?.image, 
        tagged_users: post?.tagged_users,
        link: post?.link,
        link_title: post?.link_title,
        link_description: post?.link_description,
        link_site_name: post?.link_site_name,
        link_image: post?.link_image})
    }
  }, [post]);

  const handleImageAdd = (event) => {
    event.stopPropagation();
    event.preventDefault();
    try{
    const newImage = URL.createObjectURL(event.target.files[0]);
    setEditableFields({...editableFields, image: newImage})
    setImage(newImage);
    } catch (error){
        console.error(error)
    }
  };

  const handleInput = () => {
    try{
      fileInputRef.current.click();
    } catch (error){
        console.error(error)
    }
  };

  const handleAddLink = () =>{
    setAddLink(true)
  }


  const handleMetaTags = async (value) => {
    if (!value) {
      setIsLoading(false);
      setAddLink(false);
      return;
    }
    setIsLoading(true);
    try{
        if (value !== editableFields.link) {  
          setAddLink(false)
            const bUrl = baseUrl()
            const jwt_token = localStorage.getItem('jwt_token');   
            if (!jwt_token) {
                return;
            }
            try {
                const params = new URLSearchParams({
                    url: value
                });
                const response = await fetch(`${bUrl}/api/fetch-meta-tags?${params.toString()}`, {            method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${jwt_token}`,
                },
                });
                if (response.status === 401){
                window.location.href = '/logout';    
                }
                if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const { title, description, site_name, image} = data;
                setEditableFields({ ...editableFields, link:value, link_title: title, link_description: description, link_site_name: site_name, link_image: image });
                setIsLoading(false);
            } catch (error) {
                console.error('There was an error!', error)
            }
        }
    }catch (error) {console.error('There was an error!', error)}
  };


  console.log('post SHARE: ', post)
  return (
    <div className={`${!canEdit == true && 'card'}`} style={{width: !canEdit ? '100%' : 'auto'}}>
      <div className="shareWrapper card-body" style={{width: !canEdit ? '100%' : 'auto'}}>
        <div className="shareTop" style={{height:'fit-content', width: !canEdit ? '100%' : 'auto'}}>
          {!canEdit && 
          <img className="shareProfileImg" src={user.picture} alt="" style={{height:'fit-content'}} />
          }
          <div className='input-group input-group-sm ' style={{height:'fit-content'}}>
            {image && (
              <div className="w-100 d-flex flex-row justify-content-center me-4 mb-3">
                <img src={image} alt="Uploaded" 
                style={{ maxWidth: !canEdit ? '100%' : '500px', maxcHeight: '500px'}} />
              </div>
            )
            }
            {isLoading ? <Loading /> :
            editableFields.link_title && !addLink &&
            (
              <LinkCard title={editableFields.link_title}
                        description={editableFields.link_description}
                        site_name={editableFields.link_site_name}
                        image={editableFields.link_image}/>
              )}
            <PostTextArea 
              editableFields={editableFields}
              setEditableFields={setEditableFields}
              userList={userList}
              user={user}
            />
            {addLink && 
                  <input type="text" style={{maxWidth:400}} className="form-control form-control-sm mb-0 mt-2 rounded" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                  name="name" defaultValue={editableFields.link} 
                  onBlur={(event) => {handleMetaTags(event.target.value)}} 
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === 'Tab') {
                      handleMetaTags(event.target.value);
                    }
                  }}
                  placeholder='Link'/>}
            </div>
        </div>
        <hr className="shareHr" style={{margin: canEdit ? '12px 24px 12px 0': ''}}/>
        <div className="shareBottom">
            <div className="shareOptions">
                <div className="shareOption" onClick={()=>{handleInput()}}>
                    <PermMediaIcon htmlColor="#0d6efd" 
                        className="shareIcon"                        
                    />
                    <input type="file" ref={fileInputRef} onChange={(event)=>{handleImageAdd(event)}} 
                    style={{ display: 'none' }} />
                    <span className="shareOptionText">Photo or Video</span>
                </div>
                <div className="shareOption" onClick={()=>{handleAddLink()}}>
                    <AddLinkIcon htmlColor="green" className="shareIcon"/>
                    <span className="shareOptionText">Link</span>
                </div>
            </div>
            <ShareButton 
                editableFields={editableFields} 
                image={image} 
                setEditableFields={setEditableFields} 
                post={post} 
                updateLocalPost={updateLocalPost}
              />
        </div>
      </div>
    </div>
  );
}