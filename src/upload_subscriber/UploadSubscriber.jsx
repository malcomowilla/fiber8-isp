

import React from 'react'
import {motion} from 'framer-motion'
import {Link} from 'react-router-dom'
import {useState} from 'react'
import toast, { Toaster } from 'react-hot-toast';
import {useApplicationSettings} from '../settings/ApplicationSettings'



const UploadSubscriber = () => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const {settingsformData,
showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,

    } = useApplicationSettings()
  
    // Handle file selection
    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
      }
    };
  
    // Handle drag-and-drop
    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };
  
    const handleDragLeave = () => {
      setIsDragging(false);
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        setFile(droppedFile);
      }
    };


    const subdomain = window.location.hostname.split('.')[0];
    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('please select a file first')
          return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
    
        try {
          const response = await fetch(`/api/subscribers/import?router_name=${settingsformData.router_name}`, {
            method: 'POST',
            headers:{
              'X-Subdomain': subdomain,
            },
            body: formData,
          });
    
          const newData = await response.json();
          if (response.ok) {
            toast.success('Subscribers imported successfully!');
          } else {
            toast.error('Failed to import subscribers.');
            toast.error(newData.error, {
              position: "top-center",
              duration: 4000,
            });
          }
        } catch (error) {
          toast.error('Error importing subscribers:', error);
        }
      };
  
  return (

    <>
      <Toaster />
      <div className="flex relative justify-center  min-h-screen bg-gradient-to-r "
      onClick={()=> {
        setShowMenu1(false)
        setShowMenu2(false)
        setShowMenu3(false)
        setShowMenu4(false)
        setShowMenu5(false)
        setShowMenu6(false)
        setShowMenu7(false)
        setShowMenu8(false)
        setShowMenu9(false)
        setShowMenu10(false)
        setShowMenu11(false)  
        setShowMenu12(false)
      }}
      >
      <form onSubmit={handleFileUpload}>
      <motion.div
        className="bg-white p-8 rounded-lg shadow-2xl text-center w-full max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-800
        font-montserat
        "
        
        >
          Upload Subscribers
        </h1>

        {/* Drag-and-Drop Area */}
      
        <motion.div
          className={`border-2 border-dashed ${
            isDragging ? "border-indigo-500" : "border-gray-300"
          } rounded-lg p-6 cursor-pointer transition-colors duration-300`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <input
            type="file"
            accept=".csv,.json"
            className="hidden"
            id="file-upload"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: isDragging ? 10 : 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                📂
              </motion.div>
              <p className="text-gray-600">
                {file
                  ? `Selected File: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
                  : "Drag & drop a file or click to upload"}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supported formats: .csv, .json
              </p>
            </div>
          </label>
        </motion.div>

        {/* Upload Button */}
        {file && (
          <motion.button
          type='submit'
            className="mt-6 bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            
          >
            Upload Now
          </motion.button>
        )}
      </motion.div>
      </form>
    </div>
    </>
  )
}

export default UploadSubscriber
