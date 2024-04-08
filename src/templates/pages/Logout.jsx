import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutComponent = () => {
  const navigate = useNavigate();

  const cleanLocalStorage = () => {
    try{
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('userList');
      localStorage.removeItem('companyList');
      localStorage.removeItem('companyListDate')
      localStorage.removeItem('stackList');
      localStorage.removeItem('stackListDate')
      localStorage.removeItem('softwareList');
      localStorage.removeItem('softwareListDate');
      localStorage.removeItem('posts');
      localStorage.removeItem('postsDate');
      localStorage.removeItem('skip');
      localStorage.removeItem('limit');

      return true;
    }catch (error){
      console.log(error);
      return false;
    }
  }

  useEffect(() => {
    const cleaned = cleanLocalStorage();
    if (cleaned){
      navigate('/login');
    }

  }, [navigate]);

  return null;
};

export default LogoutComponent;