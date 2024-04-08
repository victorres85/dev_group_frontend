import { handleImageUpload } from '../../utils/imageUpload';
import { useState, useEffect } from 'react';


export function DisplayImage({ url, altTxt, directory, setImageKey, onImageChange}) {
  const [imgUrl, setImgUrl] = useState(url || null);
  const [classNames, setClassNames] = useState('');


  useEffect(()=>{
  switch (directory) {
    case "users":
      setClassNames('user-profile-avatar shadow position-absolute top-50 start-0 translate-middle-x');
      break;
    case "companies":
      setClassNames('company-logo shadow position-absolute top-0 start-0 translate-middle-x');
      break;
    default:
      break;
  }
},[directory])

    const Upload = async (event, directory) => {
      let newUrl = await handleImageUpload(event, directory);
      setTimeout(() => {
          onImageChange(newUrl)
          setImgUrl(newUrl);
          setImageKey(prevKey => prevKey + 1);
      }, 1000); 
    }


    return (
      <div 
        onClick={() => document.getElementById('hFileInput').click()} 
        className={ classNames } 
        style={{maxWidth: directory === 'softwares' ? '300px' : '100%', maxHeight: directory === 'softwares' ? '600px' : '100%', zIndex:1}}>
        <img 
        src={imgUrl}
        alt={altTxt} 
        className='w-100 h-100 '
        style={{display: imgUrl ? '': 'none'}}
        />
        <input 
          type="file" 
          id="hFileInput" 
          onChange={(event) => Upload(event, directory)}
          style={{display:  directory === 'softwares' && !imgUrl ? '': 'none'}} 
        />
      </div>
    );
  }
  
  export default DisplayImage;