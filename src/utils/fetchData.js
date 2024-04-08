
import baseUrl from '../templates/baseUrl';

export const deleteObject = async (endpoint) => {
    const bUrl = baseUrl()
    const jwt_token = localStorage.getItem('jwt_token');   
    if (!jwt_token) {
      return;
    }
    try {
      const response = await fetch(bUrl + endpoint, {
        method: 'DELETE',
        headers: {
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
      return data;
    } catch (error) {
      console.error('There was an error!', error)
    }
  };

  export async function fetchData(endpoint){
    try{
    const bUrl = baseUrl()
    const jwt_token = localStorage.getItem('jwt_token');   
    if (!jwt_token) {
      return;
    }
    try {
      const response = await fetch(bUrl + endpoint, {
        method: 'GET',
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
      return data;
    } catch (error) {
      console.error('There was an error!', error)
    }
  }
  catch (error) {
    console.error('There was an error!', error)
  }
  }

  export const newFetchData = async (endpoint) => {
    try{
    const bUrl = baseUrl()
    const jwt_token = localStorage.getItem('jwt_token');   
    if (!jwt_token) {
      return;
    }
    try {
      fetch(bUrl + endpoint, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${jwt_token}`,
        },
      }).then(response => {
        if (response.status === 401){
          window.location.href = '/logout';    
        }else{
          const data = response.json();
          return data;
        }}).catch(error => {
          console.error('There was an error!', error)
        }) 
    } catch (error) {
      console.error('There was an error!', error)
    }
  }
  catch (error) {
    console.error('There was an error!', error)
  }
  };

  export const handleLocalStorage = async ({setObject, data, storageName, endpoint}) => {
    try{
    const storedDate = localStorage.getItem(storageName+'Date');
    const oneDayAgo = Date.now() - 1 * 24 * 60 * 60 * 1000;
    if (data && storedDate && new Date(storedDate).getTime() > oneDayAgo){
      setObject(data);
    } else{
      fetchData(endpoint).then(data => {
        if (setObject){
          setObject(data);
        }
        localStorage.removeItem(storageName);
        localStorage.removeItem(storageName+'Date');
        localStorage.setItem(storageName+'Date', new Date().toISOString());
        localStorage.setItem(storageName, JSON.stringify(data));
        return true;
      });
    }
    }catch (error) {
      console.error('There was an error!', error)
      throw error;
    }
  }


export const handleUpdateLocalStorage = async ({formData, setObject, storageName, endpoint}) => {
    const bUrl = baseUrl()
    const jwt_token = localStorage.getItem('jwt_token');
    try {
      const response = await fetch(bUrl + endpoint, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${jwt_token}`,
        },
        body: formData,
      });
      if (response.status === 401){
        window.location.href = '/logout';    
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setObject(data.data);
      localStorage.removeItem(storageName);
      localStorage.removeItem(storageName+'Date');
      localStorage.setItem(storageName+'Date', new Date().toISOString());
      localStorage.setItem(storageName, JSON.stringify(data.data));
      return true;
    } catch (error) {
      console.error('There was an error!', error)
      throw error;
    }
  }



export const handleSubmit = async (event, editableFields, fetchUrl, fetchMethod, redirect) => { 
  event.preventDefault();
  let formData = new FormData()
  for (const key in editableFields) {
    if (typeof editableFields[key] === 'object' && editableFields[key] !== null) {
      formData.append(key, JSON.stringify(editableFields[key]));
    } else {
      formData.append(key, editableFields[key]);
    }
  }

  const bUrl = baseUrl()
  const jwt_token = localStorage.getItem('jwt_token'); 
  
  try {  
    const response = await fetch(bUrl + fetchUrl, {
      method: fetchMethod,
      headers: {
        'Authorization': `Bearer ${jwt_token}`,
      },
      body: formData,
    })
    if (response.status === 401){
      window.location.href = '/logout';    
    }

    if (response.status === 200) {
        if (fetchMethod.toLowerCase() === 'post'){
          window.location.href = redirect;
        
        }else{
          window.location.href = redirect;
        }
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('There was an error!', error)
  }
};


export async function handleSubmitV2(event, editableFields, fetchUrl, fetchMethod){ 
  event.preventDefault();
  let dictionary = {}
  for (const key in editableFields) {
    if (typeof editableFields[key] === 'object' && editableFields[key] !== null) {
      dictionary[key] = editableFields[key];
    } else {
      dictionary[key] = editableFields[key];
    }
  }

  const bUrl = baseUrl()
  const jwt_token = localStorage.getItem('jwt_token'); 
  console.log('dictionary: ', dictionary)
  try {  
    const response = await fetch(bUrl + fetchUrl, {
      method: fetchMethod,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
      },
      body: JSON.stringify(dictionary),
    });
      if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      }
    return await response.json(); 
  } catch (error) {
    console.error('There was an error!', error)
  }
}


export const newHandleSubmit = async (formData, fetchUrl, fetchMethod, redirect) => {
  const bUrl = baseUrl()
  const jwt_token = localStorage.getItem('jwt_token'); 
  
  try {  
    const response = await fetch(bUrl + fetchUrl, {
      method: fetchMethod,
      headers: {
        'Authorization': `Bearer ${jwt_token}`,
      },
      body: formData,
    })
    if (response.status === 401){
      window.location.href = '/logout';    
    }

    if (response.status === 200) {
        if (fetchMethod.toLowerCase() === 'post'){
          window.location.href = redirect;
        
        }else{
          window.location.href = redirect;
        }
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('There was an error!', error)
  }
};


export async function fetchUser() {
  try {
    const bUrl = baseUrl()
    const response = await fetch( bUrl+`/api/user/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error:', error);
  }
}


export const fetchCompanies = async () => {

  const bUrl = baseUrl()
  const jwt_token = localStorage.getItem('jwt_token');
  const res = await fetch(bUrl+'/api/company/list',
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
      }
    });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};


export async function fetchSoftware(softwareUid) {
  const bUrl = baseUrl()
  const jwt_token = localStorage.getItem('jwt_token');

    const response = await fetch( bUrl+`/api/software/`+softwareUid, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt_token}`,
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const fetchData = await response.json();
    return fetchData;
 
}


export async function fetchPosts(skip, limit){
  const bUrl = baseUrl()

  const jwt_token = localStorage.getItem('jwt_token'); 
  try {
    const response = await fetch(bUrl + '/api/post/list?skip=' + skip + '&limit=' + limit, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`, 
      },
      body: JSON.stringify({ skip: parseInt(skip), limit: parseInt(limit) })

    });

    if (response.status === 401) {
      window.location.href = '/logout';
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Rethrow the error to be caught by the caller
  }
  // fetch(bUrl + '/api/post/list?skip='+skip+'&limit='+limit, {
  //   method: 'POST',
  //   headers: { 'Authorization': `Bearer ${jwt_token}`, },
  //   body: formData,
  // }).
  // then((response) =>{response.json()}).
  // then((data) => {
  //   console.log('Data Fetch: ', data);
  //   return data
  // }).catch(error => {
  //   console.error('Error:', error);
  //   return error;
  // });

}
