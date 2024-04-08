import baseUrl from "../templates/baseUrl";

export const handleImageUpload = async (event, directory) => {
  const bUrl= baseUrl();

  let file;
    if (directory === 'posts') {
      file = event
    }else{
      file = event.target.files[0];
    }

    const formData = new FormData();
    formData.append('image', file, file.name);
    formData.append('directory', directory);
  
    const url = bUrl + '/api/upload/image';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
        },
        body: formData
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.imgUrl;
    } catch (error) {
      console.error('Error:', error);
    }
};

export default handleImageUpload;