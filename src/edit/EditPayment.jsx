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
export function EditPayment() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [value, setValue] = React.useState(dayjs(''));
const [see, setSee] = useState(true)

const handleCancel = (e) => {
  e.preventDefault()
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
      


        <section className="bg-white dark:bg-gray-900 ">
<div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Update Payment</h2>
    <form action="#">
        <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
            <div className="sm:col-span-2">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Shortcode/paybill
                </label>
                <input type="text" name="name" id="name" className="bg-gray-50 border
                 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 
                 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                 dark:focus:ring-primary-500 dark:focus:border-primary-500"   required=""/>
            </div>
            <div className="w-full">
                <label htmlFor="brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Mpesa Confirmation Code</label>
                <input type="text" name="brand" id="brand"
                 className="bg-gray-50 border border-gray-300
                  text-gray-900 text-sm rounded-lg focus:ring-primary-600 
                  focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                   dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                     required=""/>
            </div>
            <div className="w-full">
                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
                <input type="number"
                 name="price" id="price" className="bg-gray-50 border border-gray-300
                  text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                   block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                    dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                     />
            </div>
            <div>
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900
                 dark:text-white">Subscriber</label>
                <select id="category" className="bg-gray-50 border border-gray-300 text-gray-900
                 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5
                  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                   dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                    <option selected="">Electronics</option>
                    <option value="TV">TV/Monitors</option>
                    <option value="PC">PC</option>
                    <option value="GA">Gaming/Console</option>
                    <option value="PH">Phones</option>
                </select>
            </div>
            <div>
                <label htmlFor="item-weight" className="block mb-2 text-sm font-medium text-gray-900
                 dark:text-white">Phone Number</label>
                <input type="text" name="item-weight" id="item-weight" 
                className="bg-gray-50 border border-gray-300 text-gray-900
                 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                   dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 
                   dark:focus:border-primary-500"   />
            </div> 



            <div>
              
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





            <div>
                <label htmlFor="item-weight" className="block mb-2 text-sm font-medium text-gray-900
                 dark:text-white">Claimed On</label>
                <input type="date" name="item-weight" id="item-weight" 
                className="bg-gray-50 border border-gray-300 text-gray-900
                 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                   dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 
                   dark:focus:border-primary-500"  placeholder="Ex. 12" required=""/>
            </div> 




            <div>
                <label htmlFor="item-weight" className="block mb-2 text-sm 
                font-medium text-gray-900 dark:text-white">Claimed By</label>
                <input type="text" name="item-weight" id="item-weight" 
                className="bg-gray-50 border border-gray-300 text-gray-900
                 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                   dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 
                   dark:focus:border-primary-500"  placeholder="+254791568852" />
            </div> 
        </div>
        <div className="flex items-center space-x-4">
            <button type="submit" className="dark:text-white bg-primary-700 hover:bg-primary-800 
            focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm 
            px-5 py-2.5 text-center dark:bg-primary-600 hover:text-white border dark:focus:ring-primary-800">
                Create Subscription
            </button>
            <button type="button" className="text-red-600 inline-flex items-center hover:text-white border
             border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 
             font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500
              dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                <svg className="w-5 h-5 mr-1 -ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 
                  0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 
                  0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                Delete
            </button>
            <Button type='submit' variant=''  onClick={ handleCancel}>Cancel</Button>

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
  
