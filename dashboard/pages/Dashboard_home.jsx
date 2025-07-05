// import React from 'react'
// import LeftSideNavbar from '../components/LeftSideNavbar.jsx'
// import constructionImage from "../../src/assets/constrcution2.jpg"

// function Dashboard_home() {
//   return (
//     <>
      
//       <LeftSideNavbar/>
//       <div className='bg-[url(`${constructionImage}`)]'></div>
//     </>
//   )
// }

// export default Dashboard_home
import React from 'react';
import LeftSideNavbar from '../components/LeftSideNavbar.jsx';
import constructionImage from "../../src/assets/constrcution2.jpg";
const BASE_URL = import.meta.env.VITE_SERVER_URL;
function Dashboard_home() {
  return (
    <div className="flex h-screen">
      <LeftSideNavbar />
      <div 
        className="flex-1 bg-cover bg-center"
        // style={{ backgroundImage: `url(${constructionImage})` }}
      >
        {/* Your dashboard content goes here */}
      </div>
    </div>
  );
}

export default Dashboard_home;