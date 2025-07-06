// import { Navigate, Outlet } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const ProtectedRoute = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         // Verify the user's authentication status
//         const response = await axios.get('http://localhost:8000/api/v1/auth/verify', {
//           withCredentials: true
//         });
//         setIsAuthenticated(response.data.isAuthenticated);
//       } catch (error) {
//         setIsAuthenticated(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import LeftSideNavbar from '../../dashboard/components/LeftSideNavbar';
const BASE_URL = import.meta.env.VITE_SERVER_URL

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/auth/verify`, 
          { withCredentials: true }
        );
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
    
    // Set up periodic verification (every 5 minutes)
    const interval = setInterval(verifyAuth, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LeftSideNavbar/>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;