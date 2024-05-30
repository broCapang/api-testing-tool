import React, { useState, useEffect } from 'react';
import yaml from 'js-yaml';



function YamlEditor () {
   return (
        <div>
            <h1 className='justify-center'>Edit YAML Data</h1>
            <input
                type="text"
                value='SSRF'
                placeholder="Name"
            />
            <textarea
                value='YAML Data'
                rows="20"
                cols="80"
            />
        </div>
    );
};

export default YamlEditor;
