import  { useState, useEffect, useRef } from 'react';
import capitalize from '../../../utils/capitalize';
import baseUrl from '../../baseUrl';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const PostTemplate = () => {
    const [image, setImage] = useState();
    const [card, setCard] = useState({});
    const fileInputRef = useRef();
    const [canEdit, setCanEdit] = useState(true)
    const storageData = JSON.parse(localStorage.getItem('data'))
    const userList = storageData.userList;
    const [suggestions, setSuggestions] = useState([]);
    const textareaRef = useRef(null);

    const [editingFields, setEditingFields] = useState({
        link: true,
        text: true,
        tag: true,
        });
    
      const [editableFields, setEditableFields] = useState({
        link: '',
        text: '',
        tag: [],
      });

    const handleImageAdd = (event) => {
        const newImage = URL.createObjectURL(event.target.files[0]);
        setImage(newImage);
      };
  
    const handleInput = (event) => {
      if (event.target.textContent.endsWith('\\image')) {
        event.target.textContent = event.target.textContent.replace('\\image', '');
        fileInputRef.current.click();
      }
    };
    
    const handleTextAreaChange = (event, field, value) => {
        event.stopPropagation();
        if (field === 'text') {
          setEditableFields({...editableFields, text:value})
          const match = value.match(/@(\w{2,})$/);
          if (match) {
            const search = match[1].toLowerCase();
            const suggestedUsers = userList.filter(user => user.name.toLowerCase().startsWith(search));
            setSuggestions(suggestedUsers);
          } else {
            setSuggestions([]);
          }
        }
      };

    const handleSuggestionClick = (event, user) => {
      if (user === 'none'){
        textareaRef.current.focus();
        const length = textareaRef.current.value.length;
        textareaRef.current.selectionStart = length;
        textareaRef.current.selectionEnd = length;
      }
      else{
        event.stopPropagation();
        const previousTxt = editableFields.text;
        const newTxt = previousTxt.replace(/@(\w{2,})$/, `@${user.name}`);
        setEditableFields({
          ...editableFields,
          text: newTxt,
          tag: [...editableFields.tag, user.uid],
        });
          textareaRef.current.focus();
          const length = textareaRef.current.value.length;
          textareaRef.current.selectionStart = length;
          textareaRef.current.selectionEnd = length;
          setSuggestions([]);
      }
      };

  useEffect(()=>{},[editableFields.text])
    
  const handleFieldChange = (event, field, value) => {
    event.stopPropagation();
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
        [field]: value.replace(/\n/g, '<br/>'),
      })); 
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


  const handleMetaTags = async (field, value) => {
    setEditingFields({ ...editingFields, [field]: false });
    setEditableFields({ ...editableFields, [field]: value });
    setCanEdit(false)
    if (field === 'link' && value !== editableFields.link) {
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
            const { title, description, site_name, image, image_width, image_height } = data;
            let max_width = 400;
            let max_height = 400;
            let scale = Math.min(max_width / image_width, max_height / image_height);
            let width = image_width * scale;
            let height = image_height * scale;
            setCard({ title, description, site_name, image, width, height });
        } catch (error) {
            console.error('There was an error!', error)
        }
    }
  };

  const handleCanEdit = (event) => {
    event.preventDefault();
    setCanEdit(!canEdit);
  } 


    return (
      <div>
        {image ? <img src={image} alt="Uploaded" style={{ maxWidth: '500px', maxcHeight: '500px'}} /> :
        <div className="btn btn-sm btn-outline-secondary mb-2" 
        onClick={handleInput}>
          <i className="bi bi-box-arrow-up me-2"></i> Upload Image
        </div>
        }
        {canEdit || editingFields.link || editableFields.link === '' ?
        (
            <input type="text" style={{maxWidth:400}} className="form-control form-control-sm mb-3" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
            name="name" defaultValue={editableFields.link} 
            onBlur={(event) => {handleMetaTags('link', event.target.value)}} 
            placeholder='Link'/>
        ) : 
        (
            <p className="mb-3" onClick={() => {handleFieldEdit('link'); setCanEdit(true)}}>{capitalize(editableFields.link)}</p>
        )}
        {card.title &&
            (
                <div className="card d-flex flex-column justify-content-center align-items-center" style={{maxWidth:600}}>
                  <div className='w-100 d-flex flex-row justify-content-end'>
                  <span className="btn btn-outline-success m-2 p-1 pt-0 pb-0" onClick={(event) => {handleCanEdit(event)}} ><i className="bi bi-pencil"></i></span>
                  </div>
                  <div className='w-100 d-flex flex-row  flex-wrap justify-content-around align-items-center'>
                    <img src={card.image} alt={card.title} 
                    className="m-0 mb-3 p-0"
                    style={{width: card.width > 0 ? card.width : 'auto', height: card.height > 0 ? card.height : 'auto', maxHeight: 300, maxWidth:200}} />
                    <div style={{maxWidth:350}} className="m-0 p-0">
                        <h6>{card.title}</h6>
                        <p style={{fontSize:'80%'}}>{card.description}</p>
                    </div>
                  </div>
                </div>
              )}
        <div>
      </div>
        {editingFields.text || editableFields.text === '' ? 
        (
            <div>
            <textarea
              ref={textareaRef}
              type="text"
              style={{ minWidth: 250, maxWidth: 600, minHeight: 100 }}
              className="form-control"
              aria-describedby="inputGroup-sizing-sm"
              name="text"
              value={editableFields.text}
              onChange={(event) => handleTextAreaChange(event, 'text', event.target.value)}
              onBlur={(event) => {handleFieldChange(event, 'text', event.target.value);  }}
              placeholder='Write your post here...'
            />
            {suggestions.length > 0 && (
              <div className="dropdown-menu show" onClick={(event) => handleSuggestionClick(event, 'none')}>
                {suggestions.map(user => (
                  <div key={user.uid} className="dropdown-item w-100 h-100 btn-outline-primary" 
                  style={{zIndex:100, pointerEvents: 'auto'}} onClick={(event) => handleSuggestionClick(event, user)}>
                    {user.name}
                  </div>
                ))}
              </div>
            )}
            </div>
        ) : (
            <div className="mb-1" onClick={() => handleFieldEdit('text')}> 
                <ReactMarkdown rehypePlugins={[rehypeRaw]} onClick={() => handleFieldEdit('text')}>{editableFields.text}</ReactMarkdown>
            </div>
        )}
        <input type="file" ref={fileInputRef} onChange={handleImageAdd} style={{ display: 'none' }} />
      </div>
    );
  };

export default PostTemplate;