import { ApplicationContext } from '../context/ApplicationContext';
import { useContext, useEffect } from 'react';
import { Navigate , useNavigate} from 'react-router-dom';
const ProtectAuth = ({ children }) => {
  const { user, setCurrentUser } = useContext(ApplicationContext);


// const navigate = useNavigate()
//   useEffect(() => {
//     const authenticated = document.cookie.includes("authenticated=true");

//     if (authenticated) {
// setCurrentUser(user)
//     } else {
//       setCurrentUser(null);
//     }

//   }, []);



  if (user === undefined) {
    return null;
  }

  if (!user) {

    return <Navigate to='layout/admin-dashboard' replace={true} />;
  }

  return children;
};

export default ProtectAuth;