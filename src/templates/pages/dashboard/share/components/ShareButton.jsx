import { handleSubmitV2 } from "../../../../../utils/fetchData";
import handleImageUpload from "../../../../../utils/imageUpload";

function ShareButton({editableFields, image, setEditableFields, post, updateLocalPosts, canEdit }){
  const handleShare = async (event, endpoint) => {
    event.preventDefault();
    let fetchMethod = 'POST';
    let updatedFields = Object.keys(editableFields).reduce((result, key) => {
      if (editableFields[key] !== null && editableFields[key] !== undefined) {
        result[key] = editableFields[key];
      }
      return result;
    }, {});
    if (image !== null){
      const imgUrl = await getBlob()  
      updatedFields = {...updatedFields, image: imgUrl}
      setEditableFields(updatedFields)
    }

    if (canEdit){
      updatedFields = {...updatedFields, uid: post.uid}
      fetchMethod = 'PATCH'
    }
    const newPost = await ( await handleSubmitV2(event, updatedFields, endpoint, fetchMethod, 'dashboard'))
    updateLocalPosts([newPost])

  }

  const getBlob = async() => {
    if (!image) {
        return '';
    }
    const response = await fetch(image);
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
    const newImage = await handleImageUpload(file, 'posts')
    return(newImage)
  };

  return (
    <>
    {!canEdit ?
            <div className="btn btn-sm btn-outline-success" onClick={(event)=>{handleShare(event, '/api/post/add')}}>Post</div>
            :
            <div className="btn btn-sm btn-outline-success" onClick={(event)=>{handleShare(event, '/api/post/update/')}}>Save</div>
            }
    </>
    );
}

export default ShareButton;