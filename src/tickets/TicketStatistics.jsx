
import { useState, useEffect, useCallback } from 'react'
import { useApplicationSettings } from '../settings/ApplicationSettings'
import { motion } from 'framer-motion';
import { LuTicketSlash } from "react-icons/lu";
import { CgDanger } from "react-icons/cg";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { AiOutlineFire } from "react-icons/ai";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createConsumer } from "@rails/actioncable";
const cable = createConsumer(`wss://${window.location.hostname}/cable`);







const StatCard = ({ title, value, icon, color, extratext,totalTickets }) => {
    const [animatedValue, setAnimatedValue] = useState(0);
    const {companySettings, setCompanySettings,
  
      templateStates, setTemplateStates,
      settingsformData, setFormData,
      handleChangeHotspotVoucher, voucher, setVoucher
    } = useApplicationSettings()
  
    const navigate = useNavigate()
  
    useEffect(() => {
      const animate = setTimeout(() => {
        setAnimatedValue(value);
      }, 500); // Delay animation for a smoother effect
      return () => clearTimeout(animate);
    }, [value]);


    
  
    return (
      <>
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.03 }}
        className={`p-6 rounded-lg shadow-2xl ${color} text-white cursor-pointer`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold ">{title}</h3>
            <p className="text-3xl font-bold">{animatedValue}</p>
            <p> {extratext} </p>
          </div>
          <div className="text-4xl">{icon}</div>
        </div>
      </motion.div>
      </>
    );
  };


  

const TicketStatistics = () => {
    const [totalTickets, setTotalTickets] = useState(0)
    const [openTickets, setOpenTickets] = useState(0)
    const [solvedTickets, setSolvedTickets] = useState(0)
    const [highPriorityTickets, setHighPriorityTickets] = useState(0)
    const navigate = useNavigate()




const subdomain = window.location.hostname.split('.')[0];

  useEffect(() => {
    const subscription = cable.subscriptions.create(
      { channel: "TicketsChannel" , 
        "X-Subdomain": subdomain
  }, // must match your Rails channel class
      {
        received(data) {
           console.log('received data from tickets chanel', data)
            setTotalTickets(data.total_tickets)
            setOpenTickets(data.open_tickets)
            setSolvedTickets(data.solved_tickets)
            setHighPriorityTickets(data.high_priority_tickets)
         
        },
        connected() {
          console.log("Connected to TicketsChannel");
        },
        disconnected() {
          console.log("Disconnected from TicketsChannel");
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [subdomain]);






const stats = [
    {
      title: <p className='text-black '>Total Tickets</p>,
      value: <p className='text-black '>{totalTickets || 0}</p>, 
      extratext: <p className='text-black '> All support tickets</p>,
      icon: <div className='bg-green-300 p-1 rounded-lg'>< LuTicketSlash className='text-green-500'/></div>,

      color: "bg-white",
    },

    {
        title: <p
        onClick={() => {
          navigate('/admin/open-tickets')
        }}
        className='text-black '>Open Tickets</p>,
        value: <p  onClick={() => {
          navigate('/admin/open-tickets')
        }} className='text-black'>{openTickets ||0}</p>,
        extratext: <p className='text-black '> Ticket requiring attention</p>,
        icon:  <div
         onClick={() => {
          navigate('/admin/open-tickets')
        }}
        className='bg-orange-300 p-1 rounded-lg'>< CgDanger className='text-red-500'/></div>,
  
        color: "bg-white",
    },
    {
      title: "Solved Tickets",
      value: <p 
      onClick={() => {
        navigate('/admin/solved-tickets')
      }}
      >{solvedTickets || 0}</p>,

      icon: <IoCheckmarkDoneOutline
       onClick={() => {
        navigate('/admin/solved-tickets')
      }}
      />,
      extratext: <p
       onClick={() => {
        navigate('/admin/solved-tickets')
      }}
      className='text-white'> Ticket resolved(issue resolved)</p>,
      color: "bg-green-500",
    },
    {
      title: <p
      
      className='text-black'>High Priority Tickets</p>,

      value: <p
       onClick={() => {
        navigate('/admin/urgent-tickets')
      }}
      className='text-black'>{highPriorityTickets || 0} </p>,

      icon:  <div
      onClick={() => {
        navigate('/admin/urgent-tickets')
      }}
      className='bg-red-300 p-1 rounded-lg'><AiOutlineFire  className='text-red-500'/> </div>,
      extratext: <p 
       onClick={() => {
        navigate('/admin/urgent-tickets')
      }}
      className='text-black'> High Priority Ticket</p>,
      color: "bg-white",
    },
  
   
  ];

    const getTotalTickets = useCallback(
      async() => {
        try {
          const response = await fetch('/api/total_tickets', {
            headers: { 'X-Subdomain': window.location.hostname.split('.')[0] },
          });
          const newData = await response.json()
          if (response.ok) {
            setTotalTickets(newData.total_tickets)
            console.log('fetched ticket count', newData)
          } else {
            console.log('failed to fetch ticket count')
            if (response.status === 402) {
              setTimeout(() => {
                toast.error('license expired', {
                  duration: 3000,
                  position: 'top-right',
                }); 
              }, 1800);
              
            }
          }
        } catch (error) {
          toast.error('failed to ticket count', {
            duration: 3000,
            position: 'top-right',
          });
          
        }
      },
      [],
    )
    




    useEffect(() => {
      getTotalTickets()
     
    }, [getTotalTickets]);






    const getHighPriorityTickets = useCallback(
      async() => {
        try {
          const response = await fetch('/api/high_priority_tickets', {
            headers: { 'X-Subdomain': window.location.hostname.split('.')[0] },
          });
          const newData = await response.json()
          if (response.ok) {
            setHighPriorityTickets(newData.high_priority_tickets)
            console.log('fetched router settings', newData)
          } else {
            console.log('failed to fetch ticket count')
            if (response.status === 402) {
              setTimeout(() => {
                toast.error('license expired', {
                  duration: 3000,
                  position: 'top-right',
                }); 
              }, 1800);
              
            }
          }
        } catch (error) {
          toast.error('failed get high priority tickets', {
            duration: 3000,
            position: 'top-right',
          });
          
        }
      },
      [],
    )
    




    useEffect(() => {
      getHighPriorityTickets()
     
    }, [getHighPriorityTickets]);



    const getSolvedTickets = useCallback(
      async() => {
        try {
          const response = await fetch('/api/solved_tickets', {
            headers: { 'X-Subdomain': window.location.hostname.split('.')[0] },
          });
          const newData = await response.json()
          if (response.ok) {
            setSolvedTickets(newData.solved_tickets)
            console.log('fetched router settings', newData)
          } else {
            console.log('failed to fetch ticket count')
            if (response.status === 402) {
              setTimeout(() => {
                toast.error('license expired', {
                  duration: 3000,
                  position: 'top-right',
                }); 
              }, 1800);
              
            }
          }
        } catch (error) {
          toast.error('failed to get solved tickets', {
            duration: 3000,
            position: 'top-right',
          });
          
        }
      },
      [],
    )
    




    useEffect(() => {
      getSolvedTickets()
     
    }, [getSolvedTickets]);


     const getOpenTickets = useCallback(
      async() => {
        try {
          const response = await fetch('/api/open_tickets', {
            headers: { 'X-Subdomain': window.location.hostname.split('.')[0] },
          });
          const newData = await response.json()
          if (response.ok) {
            setOpenTickets(newData.open_tickets)
            console.log('fetched router settings', newData)
          } else {
            console.log('failed to fetch ticket count')
            if (response.status === 402) {
              setTimeout(() => {
                toast.error('license expired', {
                  duration: 3000,
                  position: 'top-right',
                }); 
              }, 1800);
              
            }
          }
        } catch (error) {
          toast.error('failed to ticket count', {
            duration: 3000,
            position: 'top-right',
          });
          
        }
      },
      [],
    )


    useEffect(() => {
      getOpenTickets()
     
    }, [getOpenTickets]);
  return (
    <div className="min-h-sm bg-gradient-to-r  p-8">
     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            totalTickets={totalTickets}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            extratext={stat.extratext}
            color={stat.color}
          />
        ))}
      </div>
    </div>
  )
}

export default TicketStatistics