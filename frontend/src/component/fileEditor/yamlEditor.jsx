import React, { useState, useEffect } from 'react';
import yaml from 'js-yaml';



function YamlEditor () {
    const [name, setName] = useState('Type of payload data');
    const [yamlData, setYamlData] = useState('Payload data in YAML');

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleYamlDataChange = (e) => {
        setYamlData(e.target.value);
    };
   return (
       <div className="max-w-screen-lg m-auto p-4 py-10">
           <h1 className="text-center text-2xl font-bold mb-4 text-white">Edit YAML Data</h1>
           <div className="mb-4">
               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                   Name
               </label>
               <input
                   id="name"
                   type="text"
                   value={name}
                   onChange={handleNameChange}
                   placeholder="Name"
                   className="w-full p-2 border border-gray-300 rounded-lg"
               />
           </div>
           <div>
               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="yamlData">
                   YAML Data
               </label>
               <textarea
                   id="yamlData"
                   value={yamlData}
                   onChange={handleYamlDataChange}
                   rows="20"
                   cols="80"
                   className="w-full p-2 border border-gray-300 rounded-lg"
               />
           </div>
       </div>
    );
};

export default YamlEditor;
