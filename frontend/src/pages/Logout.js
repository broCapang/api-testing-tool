import React from 'react';



const Logout = () => {
    localStorage.removeItem('access_token');
    return (
        <div className="flex items-center justify-center h-screen">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg w-96 p-20">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center">Successfully logout!</h2>

          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <span className="text-xs text-center text-gray-500 uppercase">DataShield</span>
            <span className="border-b w-1/5 lg:w-1/4"></span>
            
          </div>
        </div>
      </div>
    );
};

export default Logout;