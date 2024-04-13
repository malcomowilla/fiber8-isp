import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export const DatePicker = () => {
  const [value, setValue] = React.useState(dayjs(''));

  return (

    <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add Subscription</h2>


      <form>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">


          <div>
                  <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subscriber</label>
                  <select id="category" className="bg-gray-50 border
                   border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 
                   focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <option value="TV">TV/Monitors</option>
                      <option value="PC">PC</option>
                      <option value="GA">Gaming/Console</option>
                      <option value="PH">Phones</option>
                  </select>
              </div>
              <div className="sm:col-span-2 ">
                  <label htmlFor="name" className="block mb-2
                   text-sm font-medium text-gray-900 dark:text-white">Date Subscribed</label>

 <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>

                   <DateTimePicker
          label="Controlled picker"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        /> 
       </DemoContainer >

              </div>
              <div className="w-full">
                 
          <div>
                  <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                  <select id="category" className="bg-gray-50 border
                   border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 
                   focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <option value="TV">TV/Monitors</option>
                      <option value="PC">PC</option>
                      <option value="GA">Gaming/Console</option>
                      <option value="PH">Phones</option>
                  </select>
              </div>
              </div>
              <div className="w-full">
                 
          <div>
                  <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Package</label>
                  <select id="category" className="bg-gray-50 border
                   border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 
                   focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <option value="TV">TV/Monitors</option>
                      <option value="PC">PC</option>
                      <option value="GA">Gaming/Console</option>
                      <option value="PH">Phones</option>
                  </select>
              </div>
              </div>
            
             
             
          </div>

          <div className='mt-4'>
        
          </div>
      </form>
  </div>
      // <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
      //    <DateTimePicker
                 

      //     label="Uncontrolled picker"
      //   /> 
        
      //   {/* <DateTimePicker
      //     label="Controlled picker"
      //     value={value}
      //     onChange={(newValue) => setValue(newValue)}
      //   /> */}
      // </DemoContainer>
  );
}