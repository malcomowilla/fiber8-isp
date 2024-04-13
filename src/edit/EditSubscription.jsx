import * as React from "react"
import {useState} from 'react'

import { Button } from "@/components/ui/button"


import {DatePicker}  from '../date-picker/Date'

import EditIcon from '@mui/icons-material/Edit';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { IconButton } from '@mui/material';
import { FormControl } from '@mui/base';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import dayjs from 'dayjs';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

// <IconButton style={{color: 'black'}} >
// <EditIcon />
// </IconButton>
export function EditSubscription() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () =>  setOpen(false);
  const [value, setValue] = React.useState(dayjs(''));
const [see, setSee] = useState(true)

const handleCancel = (e) => {
  setSee(false)
}

  return (

    <div>

 <IconButton style={{color: 'black'}}  onClick={handleOpen}>
 <EditIcon />
 </IconButton>
 { see &&

      <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
        slots={{ backdrop: StyledBackdrop }}
      >

        <ModalContent sx={{ width: 800}} className='dark:bg-black'>
          <section className='bg-white dark:bg-gray-900'>
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16  ">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add Subscription</h2>

      <form className=''>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">


          <div>
                  <label htmlFor="category" className="block mb-2 text-sm font-medium dark:text-white ">Subscriber</label>
                  <select id="category" className="bg-gray-50 border
                   border-gray-300  text-sm rounded-lg focus:ring-primary-500 
                   focus:border-primary-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400
                    dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:bg-black">
                      <option value="TV">TV/Monitors</option>
                      <option value="PC">PC</option>
                      <option value="GA">Gaming/Console</option>
                      <option value="PH">Phones</option>
                  </select>
              </div>
              <div className="sm:col-span-2 ">
                 

 <DemoContainer components={['DateTimePicker', 'DateTimePicker']} >

                   <DateTimePicker
          label="Date Subscribed"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          className='dark:text-white'
        /> 

<DateTimePicker
          label="Valid Until"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        /> 
       </DemoContainer >

              </div>
              <div className="w-full">
                 
          <div>
                  <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900
                   dark:text-white">Status</label>
                  <select id="category" className="bg-gray-50 border
                   border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 
                   focus:border-primary-500 block w-full p-2.5 
                    dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <option value="TV">TV/Monitors</option>
                      <option value="PC">PC</option>
                      <option value="GA">Gaming/Console</option>
                      <option value="PH">Phones</option>
                  </select>
              </div>
              </div>
              <div className="w-full">
                 
          <div>
                  <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900
                   dark:text-white">Package</label>
                  <select id="category" className="bg-gray-50 border
                   border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 
                   focus:border-primary-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400
                    dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <option value="TV">TV/Monitors</option>
                      <option value="PC">PC</option>
                      <option value="GA">Gaming/Console</option>
                      <option value="PH">Phones</option>
                  </select>
              </div>
              </div>
            
             
             
          </div>

          <div className='mt-4 space-x-3'>
          <Button type='submit'>Save</Button>
          <Button type='submit' onClick={ handleCancel}>Cancel</Button>
          </div>

        

      </form>
  </div>
  </section>
        </ModalContent>

      </Modal>
}
    </div>
  );

  }



  const Backdrop = React.forwardRef((props, ref) => {
    const { open, className, ...other } = props;
    return (
      <div
        className={clsx({ 'base-Backdrop-open': open }, className)}
        ref={ref}
        {...other}
      />
    );
  });
  
  Backdrop.displayName = 'Backdrop';

  Backdrop.propTypes = {
    className: PropTypes.string.isRequired,
    open: PropTypes.bool,
  };
  
  
  const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
  };
  
  const Modal = styled(BaseModal)`
    position: fixed;
    z-index: 1300;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  const StyledBackdrop = styled(Backdrop)`
    z-index: -1;
    position: fixed;
    inset: 0;
    background-color: rgb(0 0 0 / 0.5);
    -webkit-tap-highlight-color: transparent;
  `;
  
  const ModalContent = styled('div')(
    ({ theme }) => css`
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: 500;
      text-align: start;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow: hidden;
      background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
      border-radius: 8px;
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      box-shadow: 0 4px 12px
        ${theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 0.5)' : 'rgb(0 0 0 / 0.2)'};
      padding: 24px;
      color: ${theme.palette.mode === 'dark' ? grey[50] : grey[900]};
  
      & .modal-title {
        margin: 0;
        line-height: 1.5rem;
        margin-bottom: 8px;
      }
  
      & .modal-description {
        margin: 0;
        line-height: 1.5rem;
        font-weight: 400;
        color: ${theme.palette.mode === 'dark' ? grey[400] : grey[800]};
        margin-bottom: 4px;
      }
    `,
  );
  