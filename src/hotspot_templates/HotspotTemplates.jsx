

// // const HotspotTemplates = () => {
// //   return (
// //     <div>
      
// //     </div>
// //   )
// // }

// // export default HotspotTemplates

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import ModalImage from './ModalImage'; // Import the modal component




// const HotspotTemplates = () => {
//   const navigate = useNavigate();
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [clean, setClean] = useState(false);
//   const [sleekspot, setSleekspot] = useState(false);
//   const [attractive, setAttractive] = useState(false);
//   const [flat, setFlat] = useState(false);
//   const [minimal, setMinimal] = useState(false);
//   const [simple, setSimple] = useState(false);
// const [defaultTemplate, setDefaultTemplate] = useState(false);

// const [isModalOpen, setIsModalOpen] = useState(false);
// const [previewImage, setPreviewImage] = useState(null);
// const [imagetitle, setImagetitle] = useState(null);


// const handleImageClick = (image, title) => {
//   setPreviewImage(image);
//   setIsModalOpen(true);
//   setImagetitle(title)
// };
//   // hotspot_templates
//   // Sample template data (20 templates)
//   const templates = Array.from({ length: 10 }, (_, index) => ({
//     id: index + 1,
//     name: `Template ${index + 1}`,
//     background: `bg-gradient-to-r ${index % 2 === 0 ? 'from-purple-500 to-pink-500' : 'from-blue-500 to-teal-500'}`,
//     iconColor: index % 2 === 0 ? 'text-pink-200' : 'text-teal-200',
//     buttonColor: index % 2 === 0 ? 'bg-pink-500' : 'bg-teal-500',
//   }));



//   const imageTemplates = [
//     {
//       id: 1,
//       name: 'default',
//       image: '/images/template_image/default_template.png'
//     },
//     {
//       id: 2,
//       name: 'sleek',
//       image: '/images/template_image/sleek_deesighn.png'
//     },

//     {
//       id: 3,
//       name: 'attractive',
//       image: '/images/template_image/attractive.png.png'
//     },
    
    
//   ]
//   const handleTemplateSelect = (template) => {
//     setSelectedTemplate(template);
//     console.log('template', template)
//     // navigate('/hotspot-login', { state: { template } });
//     navigate('/hotspot-page', { state: { template } });
//   };

//   return (




// <>
// {/* {isModalOpen && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//     <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
//       <h2 className="text-xl font-semibold mb-4">Template Preview</h2>
//       <img src={previewImage} alt="Preview" className="w-full h-auto" />
//       <button 
//         onClick={() => setIsModalOpen(false)} 
//         className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
//       >
//         Close
//       </button>
//     </div>
//   </div>
// )} */}

    
//     <div className="min-h-screen  p-8">
//       <h1 className="text-4xl font-bold text-center mb-8 
//       text-black dark:text-white
//       ">Choose a Hotspot Template</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         { imageTemplates.map((template) => (
//           <motion.div
//             key={template.id}
//             className={`p-6 rounded-xl shadow-lg cursor-pointer  text-white`}
            
//           >
//             <div className="flex flex-col items-center">
//               <div className={`w-16 h-16 rounded-full flex items-center justify-center`}>
               
//               </div>
//               <h2 className="text-xl font-thin
//               dark:text-white  text-black
//               mt-4">{template.name}</h2>
//               <img src={template.image} alt="template image"
//                onClick={() => handleImageClick(template.image, template.name)} 
//               className="w-full h-auto" />


//               <div className='p-4'>  

//               {/* <p className='text-black dark:text-white'> preview image </p> */}
//               <ModalImage
//         isModalOpen={isModalOpen}
//         title={template.name}
//         setIsModalOpen={setIsModalOpen}
//         previewImage={previewImage}
//       />
//                 </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </div>

//     </>
//   );
// };

// export default HotspotTemplates;


 
















// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import ModalImage from './ModalImage';

// const HotspotTemplates = () => {
//   const navigate = useNavigate();
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [imagetitle, setImagetitle] = useState(null);

//   // State for checkboxes
//   const [templateStates, setTemplateStates] = useState({
//     clean: false,
//     sleekspot: false,
//     attractive: false,
//     flat: false,
//     minimal: false,
//     simple: false,
//     default: false,
//   });

//   // Handle image click for preview
//   const handleImageClick = (image, title) => {
//     setPreviewImage(image);
//     setIsModalOpen(true);
//     setImagetitle(title);
//   };

//   // Handle template selection
//   const handleTemplateSelect = (template) => {
//     setSelectedTemplate(template);
//     console.log('template', template);
//     navigate('/hotspot-page', { state: { template } });
//   };

//   // Handle checkbox change
//   const handleCheckboxChange = (templateName) => {
//     console.log('templateName', templateName);

//     setTemplateStates((templateStates) => ({
      
//       ...templateStates,
//       [templateName]: !templateStates[templateName],
      
//        // Toggle the checkbox state
//     }));

//     if (templateStates.default === true) {
//       templateStates.sleek = false;
//       templateStates.attractive = false;
//       templateStates.flat = false;
//       templateStates.minimal = false;
//       templateStates.simple = false;
//       templateStates.clean = false;
//     }




//     if (templateStates.sleek === true) {
//       templateStates.default === false
//       templateStates.attractive = false;
//       templateStates.flat = false;
//       templateStates.minimal = false;
//       templateStates.simple = false;
//       templateStates.clean = false;
//     }
   
//     console.log('templateStates', templateStates);
//   };

//   // Sample template data
//   const imageTemplates = [
//     { id: 1, name: 'default', image: '/images/template_image/default_template.png' },
//     { id: 2, name: 'sleek', image: '/images/template_image/sleek_deesighn.png' },
//     { id: 3, name: 'attractive', image: '/images/template_image/attractive.png.png' },
//     { id: 4, name: 'flat', image: '/images/template_image/flat.png' },
//     { id: 5, name: 'minimal', image: '/images/template_image/minimal.png' },
//     { id: 6, name: 'simple', image: '/images/template_image/simple.png' },
//     { id: 7, name: 'clean', image: '/images/template_image/clean.png' },
//   ];

//   return (
//     <>
//       <div className="min-h-screen p-8">
//         <h1 className="text-4xl  text-center mb-8 text-black
//         font-thin
//         dark:text-white">
//           Choose a Hotspot Template
//         </h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {imageTemplates.map((template) => (
//             <motion.div
//               key={template.id}
//               className="p-6 rounded-xl shadow-lg cursor-pointer text-white"
//             >
//               <div className="flex flex-col items-center">
//                 <div className="w-16 h-16 rounded-full flex items-center justify-center"></div>
//                 <h2 className="text-xl font-thin dark:text-white text-black mt-4">
//                   {template.name}
//                 </h2>
//                 <img
//                   src={template.image}
//                   alt="template image"
//                   onClick={() => handleImageClick(template.image, template.name)}
//                   className="w-full h-auto"
//                 />

//                 {/* Checkbox */}
//                 <div className="mt-4 flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={templateStates[template.name] || false}
//                     onChange={() => handleCheckboxChange(template.name)}
//                     className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
//                   />
//                   <label className="ml-2 text-black dark:text-white">Select</label>
//                 </div>

//                 {/* Modal for Image Preview */}
//                 <div className="p-4">
//                   <ModalImage
//                     isModalOpen={isModalOpen}
//                     title={imagetitle}
//                     setIsModalOpen={setIsModalOpen}
//                     previewImage={previewImage}
//                   />
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default HotspotTemplates;





import React, { useState, useCallback, useEffect, lazy } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ModalImage from './ModalImage';
import toast, { Toaster } from 'react-hot-toast';
import {useApplicationSettings} from '../settings/ApplicationSettings'
const SettingsNotification = lazy(() => import('../notification/SettingsNotification'))
import Backdrop from '../backdrop/Backdrop'



const HotspotTemplates = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [imagetitle, setImagetitle] = useState(null);

  const {templateStates, setTemplateStates} = useApplicationSettings();
  const [open, setOpen] = useState(false);
const [openNotifactionSettings, setOpenSettings] = useState(false)
const [isloading, setisloading] = useState(false)

  
  // State for checkboxes
  // const [templateStates, setTemplateStates] = useState({
  //   clean: false,
  //   sleekspot: false,
  //   attractive: false,
  //   flat: false,
  //   minimal: false,
  //   simple: false,
  //   default: false,
  //   sleek: false, 
  // });

  // Handle image click for preview
  const handleImageClick = (image, title) => {
    setPreviewImage(image);
    setIsModalOpen(true);
    setImagetitle(title);
  };


  const handleClose = () => {
    setOpen(false);
  };
  
  
  const handleCloseNotifaction = () => {
   setOpenSettings(false);
  };

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    console.log('template', template);
    navigate('/hotspot-page', { state: { template } });
  };

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    const { checked, value } = event.target;
    setTemplateStates(event.target.checked);
    // console.log('templatename', templateStates[templateName]);
    console.log('checkbox', event.target.checked);
    console.log('checkbox target', event.target);

    // const templateName = event.target.value;
    if (value === 'default_template' && checked) {
      // templateStates.sleek = false;
      // templateStates.attractive = false;
      // templateStates.flat = false;
      // templateStates.minimal = false;
      // templateStates.simple = false;
      // templateStates.clean = false;
      setTemplateStates({
        ...templateStates,
        sleek: false,
        sleekspot: false,
        // default: true,
        default_template: true,
        attractive: false,
        flat: false,
        minimal: false,
        simple: false,
        clean: false,
      });
      
    }else if(value === 'sleekspot' && checked){
      setTemplateStates({
        ...templateStates,
        attractive: false,
        sleekspot: true,
        default_template: false,
        flat: false,
        minimal: false,
        simple: false,
        clean: false,
      });
    }else if(value === 'attractive' && checked){
      setTemplateStates({
        ...templateStates,
        sleekspot: false,
        default_template: false,
        attractive: true,
        flat: false,
        minimal: false,
        simple: false,
        clean: false,
      });
    }
  };







  // const handleCheckboxChange = (event, templateName) => {
  //   const { checked, value } = event.target;
  
  //   setTemplateStates((prevState) => {
  //     const updatedStates = {
  //       ...prevState,
  //       [templateName]: checked,
  //     };
  
  //     if (value === 'default' && checked) {
  //       // Uncheck other templates if 'default' is selected
  //       return {
  //         ...updatedStates,
  //         sleek: false,
  //         attractive: false,
  //         flat: false,
  //         minimal: false,
  //         simple: false,
  //         clean: false,
  //       };
  //     }
  
  //     return updatedStates;
  //   });
  
  //   console.log('checkbox', templateStates[templateName]);
  // };

  // Sample template data
  const imageTemplates = [
    { id: 1, name: 'default_template', image: '/images/template_image/default_template.png' },
    { id: 2, name: 'sleekspot', image: '/images/template_image/sleek_deesighn.png' },
    { id: 3, name: 'attractive', image: '/images/template_image/attractive.png.png' },
    { id: 4, name: 'flat', image: '/images/template_image/flat.png' },
    { id: 5, name: 'minimal', image: '/images/template_image/minimal.png' },
    { id: 6, name: 'simple', image: '/images/template_image/simple.png' },
    { id: 7, name: 'clean', image: '/images/template_image/clean.png' },
  ];


  const subdomain = window.location.hostname.split('.')[0];
  const saveHotspotTemplate = async(e) => {
e.preventDefault()

    try {
      setisloading(true)
    setOpen(true)
      const response = await fetch('/api/hotspot_templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,

        },
        body: JSON.stringify({
          hotspot_templates: templateStates

        })
      });

      const newData = await response.json();

      if (response.ok) {

        setTimeout(() => {
          navigate('/hotspot-page');
        }, 2000);
        toast.success('Hotspot Templates Saved Successfully', {
          duration: 3000,
          position: 'top-right',
        });

        toast.success('Hotspot Templates Saved Successfully', {
          duration: 3000,
          position: 'bottom-right',
        });

        setisloading(false)
setOpen(false)
setOpenSettings(true)

        const { attractive, flat,
           minimal, simple, clean, default_template, sleekspot} = newData

        setTemplateStates({
          ...templateStates,
          sleekspot: sleekspot,
          default_template: default_template,
          attractive: attractive,
          flat: flat,
          minimal: minimal,
          simple: simple,
          clean: clean,
        });
          
      } else {
        toast.error('Something went wrong', {
          duration: 3000,
          position: 'top-right',
        });

        setisloading(false)
setOpen(false)
setOpenSettings(false)

        toast.error('Something went wrong', {
          duration: 3000,
          position: 'bottom-right',
        });
      }
    } catch (error) {
      setisloading(false)
setOpen(false)
setOpenSettings(false)
// toast.error('Something went wrong', {
//           duration: 3000,
//           position: 'top-right',
//         });
    }
  }

  console.log('default', templateStates.default_template)


  const getHotspotTemplates = useCallback(
    async() => {
      const response = await fetch('/api/hotspot_templates', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,

        },
      });

const newData = await response.json();
      if (response.ok) {
        
        const { attractive, flat,
          minimal, simple, clean, default_template, sleekspot} = newData[0]

       setTemplateStates({
         ...templateStates,
         sleekspot: sleekspot,
         default: default_template,
         attractive: attractive,
         flat: flat,
         minimal: minimal,
         simple: simple,
         clean: clean,
       });
      } else {
        toast.error('failed to get hotspot templates settings', {
          duration: 3000,
          position: 'top-right',
        });
      }

    },
    [],
  )
  
  useEffect(() => {
    getHotspotTemplates();
   
  }, [getHotspotTemplates]);





  return (
    <>

    
    <Toaster />

    <Backdrop  handleClose={handleClose}  open={open}/>
<SettingsNotification open={openNotifactionSettings} handleClose={ handleCloseNotifaction }/>

      <div className="min-h-screen p-8">
        <h1 className="text-4xl roboto-condensed-bold font-thin text-center mb-8
        
        text-black dark:text-white">
          Choose a Hotspot Template
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {imageTemplates.map((template) => (
            <motion.div
              key={template.id}
              className="p-6 rounded-xl shadow-xl h-full  cursor-pointer text-white"
            >
              <div className="flex flex-col items-center">
                <div className="w-16  h-16 rounded-full flex items-center justify-center"></div>
                <h2 className="text-xl  dark:text-white text-black mt-4">
                  {template.name}
                </h2>
                <img
                  src={template.image}
                  alt="template image"
                  onClick={() => handleImageClick(template.image, template.name)}
                  className="w-full h-auto rounded-xl"
                />

                {/* Checkbox */}
                <div className="mt-4 flex items-center">
                <input
                className={`p-2 rounded-xl shadow-lg cursor-pointer text-green-500 border-2 ${
  templateStates[template.name] ? 'border-4 border-purple-500' : ''
}`}
              type="checkbox"
              value={template.name}
              checked={templateStates[template.name]}
              onChange={(e) => handleCheckboxChange(e)}

            />
                  <label className="ml-2 text-black dark:text-white">Select</label>
                </div>

                {/* Modal for Image Preview */}
                <div className="p-4">
                  <ModalImage
                    isModalOpen={isModalOpen}
                    title={imagetitle}
                    setIsModalOpen={setIsModalOpen}
                    previewImage={previewImage}
                  />
                </div>



              </div>

             

            </motion.div>

           
          ))}

          <div className='flex justify-center items-center'>

          <motion.button 
          whileHover={{ scale: 1.1 }}
          className='bg-green-500 text-white px-10 text-lg py-4 rounded-lg '
           onClick={saveHotspotTemplate}>Save</motion.button>
          </div>
           
        </div>

      </div>
    </>
  );
};

export default HotspotTemplates;






























