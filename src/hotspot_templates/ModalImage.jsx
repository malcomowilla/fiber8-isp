// import { motion, AnimatePresence } from 'framer-motion';

// const ModalImage = ({ isModalOpen, setIsModalOpen, previewImage,
//     title
//  }) => {
//   return (
//     <AnimatePresence>
//       {isModalOpen && (
//         <motion.div
//           className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <motion.div
//             className="bg-white h-[100%] max-h-[80%]  p-6 rounded-lg shadow-lg max-w-md
            
//             w-full mx-4 relative"
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.8, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             {/* Modal Header */}
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-2xl font-semibold text-gray-800">{title} Preview</h2>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>

//             {/* Modal Content */}

//             <div className="h-[calc(100%-120px)]  
//             flex-1    rounded-lg overflow-y-auto
//             "> {/* Adjust height to leave space for header and footer */}
//               <img
//                 src={previewImage}
//                 alt="Preview"
//                 className="w-full h-full object-co object-center"
//               />
//             </div>

//             {/* Modal Footer */}
//             <div className="mt-6 flex justify-end">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
//               >
//                 Close
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default ModalImage;








import { motion, AnimatePresence } from 'framer-motion';

const ModalImage = ({ isModalOpen, setIsModalOpen, previewImage, title }) => {
  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white h-[90%] max-h-[90%] p-6 rounded-lg shadow-lg max-w-4xl w-full mx-4 relative flex flex-col"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-thin text-gray-800
              
              ">{title} Preview</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content - Scrollable Image Container */}
            <div className="flex-1 overflow-y-auto rounded-lg bg-gray-100 p-4">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-auto max-w-full max-h-[70vh] object-contain"
              />
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalImage;