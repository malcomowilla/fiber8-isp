
import '../custom-scheduler.css';
import dayGridPlugin from '@fullcalendar/daygrid'
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
import { Construction, Code, Rocket, Clock } from 'lucide-react';



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
      
          const {start_in_hours,  start_in_minutes} = newData[0]
          setCalendarSettings((prevData)=>  ({...prevData, start_in_minutes,
            start_in_hours
             }))

      } else {
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



const handleChangeDateTime1 = (dateTime1)=>{

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
       

if (response.status === 401) {
  toast.error(newData.error, {
    position: "top-center",
    duration: 4000,
  })
   setTimeout(() => {
          window.location.href='/signin'
         }, 1900);
}

      }
    } catch (error) {
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
   
  } else {
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
    const newData = await response.json()
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
 const event = clickInfo.event;
  const extra = event;
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

<div className="flex flex-col items-center justify-center "> <div className="text-6xl">🚧</div> <h1 className="text-2xl font-bold mt-4">Under Development</h1> <p className="text-gray-500">This feature
   is still in development. Please check back later.</p> </div>

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

































