import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

const Timer = () => {
  return (
    <div className="mx-auto flex w-full max-w-2xl items-center
    ">
      <CountdownItem unit="Hour" text="hours" />
      <CountdownItem unit="Minute" text="minutes" />
      <CountdownItem unit="Second" text="seconds" />
    </div>
  );
};

const CountdownItem = ({ unit, text }) => {
  const { ref, time } = useTimer(unit);

  return (
    <div className="flex h-10 w-1/3 flex-col max-sm:mt-9 sm:mt-[-90px] 
    items-center justify-center 
    gap-1  border-slate-200 font-mono md:h-36 md:gap-2">
      <div className="relative w-full overflow- text-center">
        <span
          ref={ref}
          className="block text-2xl font-medium dark:text-white text-black md:text-4xl lg:text-6xl xl:text-3xl"
        >
          {time}
        </span>
      </div>
      <span className="text-xs font-light dark:text-white text-black md:text-sm lg:text-base playwrite-de-grund">
        {text}
      </span>
    </div>
  );
};

export default Timer;

const useTimer = (unit) => {
  const [ref, animate] = useAnimate();

  const intervalRef = useRef(null);
  const timeRef = useRef("");

  const [time, setTime] = useState("");

  useEffect(() => {
    intervalRef.current = setInterval(handleTimeUpdate, 1000);

    return () => clearInterval(intervalRef.current || undefined);
  }, []);

  const handleTimeUpdate = async () => {
    const now = new Date();
    let newTime = "";

    if (unit === "Hour") {
      newTime = now.toLocaleString("en-US", {
        hour: "numeric",
        hour12: true,
      });
    } else if (unit === "Minute") {
      newTime = now.toLocaleString("en-US", {
        minute: "numeric",
      });
    } else if (unit === "Second") {
      newTime = now.toLocaleString("en-US", {
        second: "numeric",
      });
    }

    if (newTime !== timeRef.current) {
      // Exit animation
      await animate(
        ref.current,
        { y: ["0%", "-50%"], opacity: [1, 0] },
        { duration: 0.35 }
      );

      timeRef.current = newTime;
      setTime(newTime);

      // Enter animation
      await animate(
        ref.current,
        { y: ["50%", "0%"], opacity: [0, 1] },
        { duration: 0.35 }
      );
    }
  };

  return { ref, time };
};



















// import { useAnimate } from "framer-motion";
// import { useEffect, useRef, useState } from "react";

// // NOTE: Change this date to whatever date you want to countdown to :)
// const COUNTDOWN_FROM = "2024-10-01";

// const SECOND = 1000;
// const MINUTE = SECOND * 60;
// const HOUR = MINUTE * 60;
// const DAY = HOUR * 24;

// const CountDown = () => {
//   return (
//       <div className="mx-auto flex w-full max-w-2xl items-center ">
//         <CountdownItem unit="Day" text="days" />
//         <CountdownItem unit="Hour" text="hours" />
//         <CountdownItem unit="Minute" text="minutes" />
//         <CountdownItem unit="Second" text="seconds" />
//       </div>
//   );
// };

// const CountdownItem = ({ unit, text }) => {
//   const { ref, time } = useTimer(unit);

//   return (
//     <div className="flex h-10 w-1/4 flex-col   max-sm:mt-9 sm:mt-[-90px] items-center justify-center gap-1 border-r-[1px] border-slate-200
//      font-mono md:h-36 md:gap-2">
//       <div className="relative w-full overflow-hidden text-center">
//         <span
//           ref={ref}
//           className="block text-2xl font-medium dark:text-black  text-white md:text-4xl lg:text-6xl xl:text-3xl"
//         >
//           {time}
//         </span>
//       </div>
//       <span className="text-xs font-light text-slate-500 md:text-sm lg:text-base">
//         {text}
//       </span>
//     </div>
//   );
// };

// export default CountDown;

// // NOTE: Framer motion exit animations can be a bit buggy when repeating
// // keys and tabbing between windows. Instead of using them, we've opted here
// // to build our own custom hook for handling the entrance and exit animations
// const useTimer = (unit) => {
//   const [ref, animate] = useAnimate();

//   const intervalRef = useRef(null);
//   const timeRef = useRef(0);

//   const [time, setTime] = useState(0);

//   useEffect(() => {
//     intervalRef.current = setInterval(handleCountdown, 1000);

//     return () => clearInterval(intervalRef.current || undefined);
//   }, []);

//   const handleCountdown = async () => {
//     const end = new Date(COUNTDOWN_FROM);
//     const now = new Date();
//     const distance = +end - +now;

//     let newTime = 0;

//     if (unit === "Day") {
//       newTime = Math.floor(distance / DAY);
//     } else if (unit === "Hour") {
//       newTime = Math.floor((distance % DAY) / HOUR);
//     } else if (unit === "Minute") {
//       newTime = Math.floor((distance % HOUR) / MINUTE);
//     } else {
//       newTime = Math.floor((distance % MINUTE) / SECOND);
//     }

//     if (newTime !== timeRef.current) {
//       // Exit animation
//       await animate(
//         ref.current,
//         { y: ["0%", "-50%"], opacity: [1, 0] },
//         { duration: 0.35 }
//       );

//       timeRef.current = newTime;
//       setTime(newTime);

//       // Enter animation
//       await animate(
//         ref.current,
//         { y: ["50%", "0%"], opacity: [0, 1] },
//         { duration: 0.35 }
//       );
//     }
//   };

//   return { ref, time };
// };