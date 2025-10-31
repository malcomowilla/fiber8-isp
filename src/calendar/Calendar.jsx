
import '../custom-scheduler.css';
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import  { useEffect, useState, useCallback, } from 'react';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import CalendarEvent from './CalendarEvent'
import FullCalendar from '@fullcalendar/react'
import DeleteCalendarEvent from './DeleteCalendarEvent'

import dayjs from 'dayjs';
import Lottie from 'react-lottie';
import LoadingAnimation from '../loader/loading_animation.json'
import Backdrop from '@mui/material/Backdrop';

import { requestPermission } from '../firebase/firebasePermission';
import {useNavigate} from 'react-router-dom'
import {useApplicationSettings} from '../settings/ApplicationSettings'
import toast, { Toaster } from 'react-hot-toast';


const Calendar = () => {

const navigate = useNavigate()



const eventForm = {
title: '',
start: dayjs(new Date()),
end: dayjs(new Date()),
client: '',
task_type: '',
status: '',
assigned_to: '',
description: '',

}
  const [isOpen, setIsOpen] = useState(false);
const [isOpenDelete, setisOpenDelete] = useState(false)
const [calendarEventForm, setCalendarEventForm] = useState(eventForm)
const [calendarEvents, setCalendarEvent]= useState([])
const [openAddition, setopenAddition] = useState(false)
const [openErrorAlert, setopenErrorAlert] = useState(false)
const [loading, setloading] = useState(false)
const [openLoad, setopenLoad] = useState(false)
const [start, setStart] = useState({})
const [end, setEnd] = useState(dayjs(new Date()))
const [title, setTitle] = useState('')
const [eventId, setEventId] = useState('')
const [openUpdateAlert, setopenUpdateAlert] = useState(false)
const [openDeleteAlert, setopenDeleteAlert] = useState(false)

const {adminFormSettings,  setCalendarSettings, setOpenOfflineError, setSnackbar,
   showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,

} = useApplicationSettings()




const subdomain = window.location.hostname.split('.')[0];


  
const handleGetCalendarSettings = useCallback(
  async() => {
    try {
      const response = await fetch('/api/calendar_settings', {
        headers: { 'X-Subdomain': subdomain },
      })
      const newData = await response.json()



     




      if (response.ok) {
        console.log('data',newData)
        // const start_in_minutes = newData.start_in_minutes
        //   const start_in_hours = newData.start_in_hours
          const {start_in_hours,  start_in_minutes} = newData[0]
          setCalendarSettings((prevData)=>  ({...prevData, start_in_minutes,
            start_in_hours
             }))

      } else {
        console.log('error fetching calendar settings')
        setOpenOfflineError(true)
      }
    } catch (error) {
      console.log('error fetching calendar settings', error)
      setOpenOfflineError(true)
    }
  },
  [],
)



useEffect(() => {
  handleGetCalendarSettings()
}, [handleGetCalendarSettings]);










const handleCloseDeleteAlert = ()=>{
  setopenDeleteAlert(false)
}




useEffect(() => {
  requestPermission();
}, []);




const defaultOptions = {
  loop: true,
  autoplay: true, 
  animationData: LoadingAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const handleCloseUpdateAlert =()=>{
  setopenUpdateAlert(false)
}


const handleCloseErrorAlert = ()=>{
  setopenErrorAlert(false)
}

const handleCloseAddition = ()=> {
  setopenAddition(false)
}



const handleChangeDateTime1 = (dateTime1)=>{

  // setCalendarEventForm({...calendarEventForm,})
  setCalendarEventForm((prevData) => ({
    ...prevData,
    start: dateTime1
  }))
}



const handleChangeDateTime2 = (dateTime2)=>{

  setCalendarEventForm((prevData) => ({
    ...prevData,
    end: dateTime2
  }))
}



const handleChange = (e)=>{
const {name, value} = e.target
setCalendarEventForm((prevData) => ({
  ...prevData,
  [name]: value
}))
}

const handleDateClick = ()=>{
  setIsOpen(true)
}



const handleGetCalendarEvents = useCallback(
  async() => {
    try {
      const response = await fetch('/api/calendar_events', {
        headers: { 'X-Subdomain': subdomain },
      })
      const newData = await response.json()

    


      if (response.ok) {
        setCalendarEvent(newData)
  if (response.status === 403) {
        toast.error(newData.error, {
          position: "top-center",
          duration: 6000, 
        })      
      }
        
      } else {
          if (response.status === 403) {
        toast.error(newData.error, {
          position: "top-center",
          duration: 6000, 
        })      
      }
        console.log('error')
        setopenErrorAlert(true)
//          if (response.status === 401) {
//   toast.error(newData.error, {
//     position: "top-center",
//     duration: 4000,
//   })
// }

if (response.status === 401) {
  toast.error(newData.error, {
    position: "top-center",
    duration: 4000,
  })
   setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/signin'
         }, 1900);
}

      }
    } catch (error) {
      console.log('error geting')
    }
  },
  [],
)


useEffect(() => {
  handleGetCalendarEvents()
}, [handleGetCalendarEvents]);


const formattedEvents = calendarEvents.map(event => ({
    
  id: event.id,
  title: event.title,
  start: event.start,
  end: event.end,
  extendedProps: {
    client: event.client,
    assigned_to: event.assigned_to,
    status: event.status,
    task_type: event.task_type,
    description: event.event_title // or use something else
  }
}));






const handleCreateEvent = async(e)=>{


try {

  e.preventDefault()
  setloading(true)
  setopenLoad(true)
const response = await fetch('/api/calendar_events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Subdomain': subdomain,
  },
  body: JSON.stringify(calendarEventForm)
})

const newData = await response.json()
  if (response.ok) {
    setopenLoad(false)
    
    setIsOpen(false)
   
    setloading(false)
    setCalendarEvent((prev)=> ([
      ...prev, newData
    ]))
    setopenAddition(true)
  } else {


    if (response.status === 401) {
  toast.error(newData.error, {
    position: "top-center",
    duration: 4000,
  })
}

    toast.error('Failed to create event', {
      position: "top-center",
      duration: 4000,
    })


    console.log('err')
    setopenErrorAlert(true)
    setopenLoad(false)
    setloading(false)
    setIsOpen(false)


  }
} catch (error) {
  console.log('err')
  setopenLoad(false)
  setloading(false)
    setloading(false)
}
}







const handleUpdateEvent = async(e)=>{
  

try {
    e.preventDefault()
  setloading(true)
  setopenLoad(true)
const response = await fetch(`/api/calendar_events/${eventId}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'X-Subdomain': subdomain,
  },
  body: JSON.stringify(calendarEventForm)
})

const newData = await response.json()
  if (response.ok) {
    toast.success('Task updated successfully', {
      position: "top-center",
      duration: 4000,
    })
    setopenLoad(false)
    setisOpenDelete(false)
    setopenUpdateAlert(true)
    setloading(false)
    setCalendarEvent(calendarEvents.map(item => (item.id === eventId ? newData : item)));
    // setCalendarEvent((prev)=> ([
    //   ...prev, newData
    // ]))
  } else {
    console.log('err')
    setopenErrorAlert(true)
    setopenLoad(false)
    setloading(false)
    setisOpenDelete(false)
     if (response.status === 401) {
  toast.error(newData.error, {
    position: "top-center",
    duration: 4000,
  })
}



  }
} catch (error) {
  console.log('err')
  setopenLoad(false)
  setloading(false)
  setopenErrorAlert(true)
    setloading(false)
    setisOpenDelete(false)

}
}





const handleDeleteEvent = async()=>{
  


try {
    setloading(true)
  setopenLoad(true)
   const response = await fetch(`/api/calendar_events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      }
    })
    
  if (response.ok) {
    setCalendarEvent(calendarEvents.filter((calendarEvent)=> calendarEvent.id !==  eventId))

    setopenLoad(false)
    setisOpenDelete(false)
    setloading(false)
    toast.success('Task deleted successfully', {
      position: "top-center",
      duration: 4000,
    })
    setopenDeleteAlert(true)
    // setCalendarEvent((prev)=> ([
    //   ...prev, newData
    // ]))
  } else {
    console.log('err')
    toast.error('Failed to delete task', {
      position: "top-center",
      duration: 4000,
    })

     if (response.status === 401) {
  toast.error(newData.error, {
    position: "top-center",
    duration: 4000,
  })
}

    setopenErrorAlert(true)
    setopenLoad(false)
    setloading(false)
    setisOpenDelete(false)


  }
} catch (error) {
  console.log('err')
  setopenLoad(false)
  setloading(false)
  setopenErrorAlert(true)
    setloading(false)
    setisOpenDelete(false)

}
}






const handleEventClick = (clickInfo)=> {
  setisOpenDelete(true)
  const eventData = clickInfo.event.extendedProps;
console.log('clcik',clickInfo)
 const event = clickInfo.event;
  const extra = event;
  console.log('extra', extra)
  // Log the event data to inspect what's available
  console.log("Event Data:", {
    id: clickInfo.event.id,
    title: clickInfo.event.title,
    start: clickInfo.event.start,
    end: clickInfo.event.end,
    description: eventData.description,
    task_type: eventData.task_type,
    status: eventData.status,
    assigned_to: eventData.assigned_to,
    
  });
  setEventId(parseInt(clickInfo.event.id))
  setTitle(clickInfo.event.title)

  setEnd(dayjs(clickInfo.event.start))
  setStart(dayjs(clickInfo.event.end))

  setCalendarEventForm({
    title: clickInfo.event.title || '',
    start: dayjs(clickInfo.event.start),
    end: dayjs(clickInfo.event.end),
    description: clickInfo.event.description || '',
    task_type: eventData.task_type,
    status: eventData.status || '',
    assigned_to: clickInfo.event.assigned_to || '',
    client: clickInfo.event.client || '',
    
  
  });



}


  const events=[
    
    {
      event_id: 1,
      title: "Event 1",
      start: new Date("2021/5/2 09:30"),
      end: new Date("2021/5/2 10:30"),
    },
    {
      event_id: 2,
      title: "Event 2",
      start: new Date("2021/8/11 10:00"),
      end: new Date("2024/8/11 15:58"),
    },
  ]

  // const element =
  //  document.querySelector('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.css-78trlr-MuiButtonBase-root-MuiIconButton-root');
  // if (element) {
  //   element.style.backgroundColor = 'red';
  // }

//   const element = document.querySelector('[data-testid="date-navigator"]');
// console.log(element); // Output: "your-test-id"
// const firstChild = element.children;
//       console.log(firstChild);
// element.style.background = 'black'


// .rs__view_navigator :nth-child(2) {color :black;}
//   .rs__view_navigator :nth-child(1) {color :green;}
//   .rs__view_navigator :nth-child(3) {color :black}
//   .rs__view_navigator :nth-child(4) {color :green}

// useEffect(() => {
//   const rs1 = document.getElementsByClassName('rs__view_navigator')[0];
//   console.dir(`Element with class 'rs__view_navigator1=> ${rs1}` );
//   const rs2 =  rs1.querySelector(':nth-child(1)')
//   const rs3 =  rs1.querySelector(':nth-child(2)')
//   const rs4 =  rs1.querySelector(':nth-child(3)')
//   const rs5 =  rs1.querySelector(':nth-child(4)')
//   const rs6 =  rs1.querySelector(':nth-child(5)')

//   console.dir(`Element with class 'rs__view_navigator2=> ${rs2}` );


// if (rs6) {
//   rs6.addEventListener("click", function () {
//     rs6.style.setProperty('color', 'green', 'important');
//     rs5.style.setProperty('color', 'black', 'important');
//   });
// }

//   if (rs5) {
//     rs5.addEventListener("click", function () {
//       rs5.style.setProperty('color', 'green', 'important');
//       rs4.style.setProperty('color', 'black', 'important');
//     });
//   }
  
//   if (rs4) {
//     rs4.addEventListener("click", function () {
//       rs4.style.setProperty('color', 'green', 'important');
//       rs2.style.setProperty('color', 'black', 'important');
//     });
//   }
  
//   if (rs3) {
//     rs3.addEventListener("click", function () {
//       rs3.style.setProperty('color', 'green', 'important');
//       rs2.style.setProperty('color', 'black', 'important');
//     });
//   }
//   if (rs2) {
//     rs2.addEventListener("click", function () {
//       rs2.style.setProperty('color', 'green', 'important');
//       rs3.style.setProperty('color', 'black', 'important');
//     });
//   } else {
//     console.dir("Element with class 'rs__view_navigator' not found");
//   }
// }, []);


// useEffect(() => {
//   const element = document.querySelector('[data-testid="date-navigator"] :nth-child(1)');
// const element2 = document.querySelector('[data-testid="date-navigator"] :nth-child(3)')
// const element3 = document.querySelector('[data-testid="date-navigator"]')
// const element4 = document.querySelector('[data-testid="date-navigator"] :nth-child(2)')



//   if (element || element2 || element3 ||  element4) {
//     element.style.setProperty('color', 'white', 'important');
//     element2.style.setProperty('color', 'white', 'important');
//     element3.style.setProperty('background-color', 'green', 'important');
//     element4.style.setProperty('color', 'white', 'important');
//     element3.style.setProperty('margin-bottom', '20px', 'important')
//     element3.style.setProperty('border-radius', '4px', 'important')
//   } else {
//     console.log("Element not found");
//   }
// }, []);



useEffect(() => {
  let DraggableEelement = document.getElementById('draggable-el')


  
 if (DraggableEelement) {
  new Draggable(DraggableEelement ,{
    eventData: function (eventEl) {
      let title = eventEl.getAttribute("title")
      let id = eventEl.getAttribute("data")
      let start = eventEl.getAttribute("start")
      return { title, id, start }
    }
  })
 }
}, []);


// const handleEventClick = () => {
//   // Prevent any default modal behavior
//   return false;
// };
  return (
    <>

 <Toaster />
{loading &&    <Backdrop open={openLoad} sx={{ color:'#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  
  <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} />
    
     </Backdrop>
  }



     <div
     onClick={() => {
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
     className=''>
      <div className='col-span-8'>
        <CalendarEvent  handleChangeDateTime1={handleChangeDateTime1}   handleChangeDateTime2={handleChangeDateTime2} 
        isOpen={isOpen} handleChange={handleChange} 
         calendarEventForm={calendarEventForm} setIsOpen={setIsOpen} handleCreateEvent={handleCreateEvent} />


        <DeleteCalendarEvent   calendarEventForm={calendarEventForm} handleChange={handleChange} 
         eventId={eventId} handleDeleteEvent={handleDeleteEvent}
          start={start} end={end} title={title}  isOpenDelete={isOpenDelete} handleChangeDateTime1={handleChangeDateTime1} 
            handleChangeDateTime2={handleChangeDateTime2}  
        setisOpenDelete={setisOpenDelete} handleUpdateEvent={handleUpdateEvent}/>

        <p className='bg-gradient-to-r from-green-600 via-blue-400
         to-cyan-500 bg-clip-text text-transparent text-2xl font-bold inline-block mb-2'>Task Manager</p>

        <div className="flex justify-between items-center mb-4">
  {/* <h2 className="text-2xl font-semibold">Calendar</h2> */}
  <button
    onClick={() => setIsOpen(true)} // Open the create form
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
  >
    Create New Task
  </button>
</div>
      
           
      <FullCalendar
       nowIndicator={true}
editable={true}
dateClick={handleDateClick}
droppable={true}
selectable={true}
selectMirror={true}
eventClick={handleEventClick}
headerToolbar={{
  left: 'prev,next today',
  center: 'title',
  right: 'resourceTimelineWook, dayGridMonth,timeGridWeek'
}}


height="100%" // Set the calendar height to 100% of the container
width="50%"
aspectRatio={1.5} // Controls the width/height ratio for larger screens
contentHeight="auto" // Makes the height dynamic based on the container
        plugins={[  dayGridPlugin,
          interactionPlugin,
          timeGridPlugin ]}
  view="week"

events={formattedEvents}


  // events={[
  //   {
  //     event_id: 1,
  //     title: "Event 1",
  //     start: new Date("2024/8/11 09:30"),
  //     end: new Date("2024/8/11 4:30"),
  //   },
  //   {
  //     event_id: 2,
  //     title: "Event 2",
  //     start: new Date("2021/5/4 10:00"),
  //     end: new Date("2024/8/10 11:00"),
  //   },
  // ]}
/>
</div>


    <div id="draggable-el" className="ml-8 w-full border-2 p-2 rounded-md mt-16 lg:h-1/2 bg-green-600">
            <h1 className="font-bold text-lg text-center playwrite-de-grund
             text-black">Upcoming Events</h1>
            {calendarEvents.map(event => (
              <div
                className="fc-event border-2 p-1 m-2 w-full  cursor-pointer playwrite-de-grund text-black rounded-md ml-auto 
                text-center bg-white"
                title={event.title}
                key={event.id}
              >
                {event.title}
              </div>
            ))}
          </div>
          </div>
    </>
  )
}

export default Calendar



































// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Box,
//   Button,
//   Typography,
//   Backdrop,
//   CircularProgress,
//   IconButton,
//   Tooltip
// } from '@mui/material';
// import {
//   Calendar as BigCalendar,
//   dayjsLocalizer,
//   Views
// } from 'react-big-calendar';
// import { FaChevronLeft } from "react-icons/fa6";

// import dayjs from 'dayjs';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import EventFormModal from './EventFormModal';
// import EventDetailsModal from './EventDetailsModal';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { useApplicationSettings } from '../settings/ApplicationSettings';
// import { Add, Delete, Edit, Today } from '@mui/icons-material';
// import { FaChevronRight } from "react-icons/fa6";


// const localizer = dayjsLocalizer(dayjs);

// const Calendar = () => {
//   const navigate = useNavigate();
//   const { setCalendarSettings, setOpenOfflineError, setSnackbar } = useApplicationSettings();
  
//   // State
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//   const [view, setView] = useState(Views.WEEK);

//   // Fetch calendar settings
//   const fetchCalendarSettings = useCallback(async () => {
//     try {
//       const response = await fetch('/api/get_calendar_settings');
//       if (response.ok) {
//         const data = await response.json();
//         setCalendarSettings(prev => ({
//           ...prev,
//           ...data[0]
//         }));
//       }
//     } catch (error) {
//       setOpenOfflineError(true);
//     }
//   }, [setCalendarSettings, setOpenOfflineError]);

//   // Fetch events
//   const fetchEvents = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/get_calendar_events');
      
//       if (response.status === 401) {
//         handleUnauthorized();
//         return;
//       }

//       if (response.ok) {
//         const data = await response.json();
//         setEvents(data.map(event => ({
//           ...event,
//           start: new Date(event.start),
//           end: new Date(event.end)
//         })));
//       }
//     } catch (error) {
//       console.error('Error fetching events:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const handleUnauthorized = () => {
//     setSnackbar({
//       open: true,
//       message: 'Session expired. Please login again.',
//       severity: 'error'
//     });
//     navigate('/signin');
//   };

//   // Handle event creation
//   const handleCreateEvent = async (eventData) => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/create_calendar_event', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(eventData)
//       });

//       if (response.ok) {
//         const newEvent = await response.json();
//         setEvents(prev => [...prev, {
//           ...newEvent,
//           start: new Date(newEvent.start),
//           end: new Date(newEvent.end)
//         }]);
//         toast.success('Event created successfully');
//         setIsFormOpen(false);
//       }
//     } catch (error) {
//       toast.error('Failed to create event');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle event update
//   const handleUpdateEvent = async (eventData) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`/api/update_calendar_event/${selectedEvent.id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(eventData)
//       });

//       if (response.ok) {
//         const updatedEvent = await response.json();
//         setEvents(prev => prev.map(e => 
//           e.id === selectedEvent.id ? {
//             ...updatedEvent,
//             start: new Date(updatedEvent.start),
//             end: new Date(updatedEvent.end)
//           } : e
//         ));
//         toast.success('Event updated successfully');
//         setIsDetailsOpen(false);
//         setIsFormOpen(false);
//       }
//     } catch (error) {
//       toast.error('Failed to update event');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle event deletion
//   const handleDeleteEvent = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`/api/delete_calendar_event/${selectedEvent.id}`, {
//         method: 'DELETE'
//       });

//       if (response.ok) {
//         setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
//         toast.success('Event deleted successfully');
//         setIsDetailsOpen(false);
//       }
//     } catch (error) {
//       toast.error('Failed to delete event');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Event handlers
//   const handleSelectEvent = (event) => {
//     setSelectedEvent(event);
//     setIsDetailsOpen(true);
//   };

//   const handleSelectSlot = (slotInfo) => {
//     setSelectedEvent({
//       title: '',
//       start: slotInfo.start,
//       end: slotInfo.end,
//       allDay: slotInfo.action === 'click'
//     });
//     setIsFormOpen(true);
//   };

//   // Effects
//   useEffect(() => {
//     fetchCalendarSettings();
//     fetchEvents();
//   }, [fetchCalendarSettings, fetchEvents]);

//   // Custom components
//   const Event = ({ event }) => (
//     <div className="rbc-event-content">
//       <strong>{event.title}</strong>
//       {event.description && <p className="text-xs mt-1">{event.description}</p>}
//     </div>
//   );

//   const CustomToolbar = ({ label, onNavigate, onView }) => (
//     <div className="rbc-toolbar flex flex-wrap justify-between items-center p-4 bg-gray-50 rounded-t-lg">
//       <div className="flex items-center space-x-2">
//         <Tooltip title="Today">
//           <IconButton onClick={() => onNavigate('TODAY')}>
//             <Today />
//           </IconButton>
//         </Tooltip>
//         <Tooltip title="Previous">
//           <IconButton onClick={() => onNavigate('PREV')}>
//             <FaChevronLeft /> 
//           </IconButton>
//         </Tooltip>
//         <Typography variant="h6" className="font-medium">
//           {label}
//         </Typography>
//         <Tooltip title="Next">
//           <IconButton onClick={() => onNavigate('NEXT')}>
//             <FaChevronRight />
//           </IconButton>
//         </Tooltip>
//       </div>
//       <div className="flex space-x-2">
//         <Button
//           variant={view === Views.MONTH ? 'contained' : 'outlined'}
//           onClick={() => onView(Views.MONTH)}
//           size="small"
//         >
//           Month
//         </Button>
//         <Button
//           variant={view === Views.WEEK ? 'contained' : 'outlined'}
//           onClick={() => onView(Views.WEEK)}
//           size="small"
//         >
//           Week
//         </Button>
//         <Button
//           variant={view === Views.DAY ? 'contained' : 'outlined'}
//           onClick={() => onView(Views.DAY)}
//           size="small"
//         >
//           Day
//         </Button>
//         <Button
//           variant="contained"
//           startIcon={<Add />}
//           onClick={() => {
//             setSelectedEvent({
//               title: '',
//               start: new Date(),
//               end: dayjs().add(1, 'hour').toDate()
//             });
//             setIsFormOpen(true);
//           }}
//           size="small"
//         >
//           New Event
//         </Button>
//       </div>
//     </div>
//   );

//   return (
//     <Box sx={{ height: 'calc(100vh - 64px)', p: 3 }}>
//       <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
//         <CircularProgress color="inherit" />
//       </Backdrop>

//       <BigCalendar
//         localizer={localizer}
//         events={events}
//         startAccessor="start"
//         endAccessor="end"
//         style={{ height: '100%' }}
//         onSelectEvent={handleSelectEvent}
//         onSelectSlot={handleSelectSlot}
//         selectable
//         components={{
//           event: Event,
//           toolbar: CustomToolbar
//         }}
//         views={[Views.MONTH, Views.WEEK, Views.DAY]}
//         view={view}
//         onView={setView}
//         defaultView={Views.WEEK}
//         eventPropGetter={(event) => ({
//           style: {
//             backgroundColor: event.color || '#3174ad',
//             borderRadius: '4px',
//             border: 'none',
//             color: 'white'
//           }
//         })}
//       />

//       <EventFormModal
//         open={isFormOpen}
//         onClose={() => setIsFormOpen(false)}
//         event={selectedEvent}
//         onSubmit={selectedEvent?.id ? handleUpdateEvent : handleCreateEvent}
//         isEdit={!!selectedEvent?.id}
//       />

//       <EventDetailsModal
//         open={isDetailsOpen}
//         onClose={() => setIsDetailsOpen(false)}
//         event={selectedEvent}
//         onEdit={() => {
//           setIsDetailsOpen(false);
//           setIsFormOpen(true);
//         }}
//         onDelete={handleDeleteEvent}
//       />
//     </Box>
//   );
// };

// export default Calendar;