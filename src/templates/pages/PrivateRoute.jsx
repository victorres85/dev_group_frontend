import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children }) => {

    PrivateRoute.propTypes = {
        children: PropTypes.node,
      };
      
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('jwt_token'); // replace this with your authentication logic

  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} />;
};

export default PrivateRoute;