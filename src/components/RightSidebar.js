import React, { useState } from "react";
// import Calendar from "moedim";
// import styled from "@emotion/styled";
import { Calendar as BigCalender, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
// const StyledCalendar = styled(Calendar)`
//   --moedim-primary: #f00;
// `;

// const StyledCalendar = styled(Calendar)(({ theme }) => ({
//   backgroundColor: "#677be7",
//   color: "#FFFFFF",
//   border: "none",
//   minWidth: "100%",
//   padding: "30px",
//   borderRadius: "10px",
//   '& .cIFnvd[aria-pressed="true"]': {
//     background: "#fce36e",
//     borderRadius: "5px !important",
//     color: "#000",
//   },
//   "& .fatsuA": {
//     marginTop: "14px",
//   },
//   "& .cfqheK": {
//     minWidth: "100%",
//     display: "grid",
//     gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
//     paddingTop: "5px",
//   },
//   "& .cuRXYf": {
//     borderBottom: "0.5px solid #FFFFFF",
//     paddingBottom: "20px",
//   },
//   "& .cIFnvd": {
//     border: "none",
//     fontSize: "12px",
//     borderRadius: "15%",
//   },
//   "& bxUOeX": {
//     borderRadius: "15%",
//     width: "33px",
//     height: "33px",
//     backgroundColor: "transparent",
//   },
//   "& .kVEIdA": {
//     color: "#fff",
//     borderRadius: "0%",
//     fontSize: "12px",
//     fontWeight: "bold",
//   },
// }));
// locale = "en-US"
const RightSidebar = () => {
  const localizer = momentLocalizer(moment)
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);


  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const converTimeStampToDate = (timeStamp) => {
    var timestamp = timeStamp ? timeStamp : 1677958601;
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return new Date(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
  }

  const events = [
    {
      'title': 'All Day Event very long title',
      'start': converTimeStampToDate(1677996881),
    },
    {
      'title': 'Long Event',
      'start': converTimeStampToDate(1677996881),
    },

    {
      'title': 'DTS STARTS',
      'start': new Date(2023, 3, 13),
    },

    {
      'title': 'DTS ENDS',
      'start': converTimeStampToDate(1677996881),
    },

    {
      'title': 'Some Event',
      'start': new Date(2023, 2, 9),
    },
    {
      'title': 'Conference',
      'start': new Date(2023, 2, 11),
      desc: 'Big conference for important people'
    },
    {
      'title': 'Meeting',
      'start': new Date(2023, 2, 6, 2, 0),
      desc: 'Pre-meeting meeting, to prepare for the meeting'
    },
  ];

  const defaultDuration = 60; // 1 hour in minutes

  const eventsWithDefaultDuration = events.map((event) => {
    return {
      ...event,
      end: new Date(event.start.getTime() + defaultDuration * 60000),
    };
  });
  // const [value, setValue] = useState(new Date());

  // const handleChange = (d) => {
  //   if (d > new Date()) {
  //   } else if (d < new Date()) {
  //     // setPreviousActive(true);
  //   } else {
  //   }
  //   setValue(d);
  // };


  const formats = {
    weekdayFormat: (date, culture, localizer) =>
      localizer.format(date, 'dd').charAt(0),
  };
  
  const MyToolbar = (toolbar) => {
    const { label } = toolbar;
    return (
      <div className="flex items-center w-full justify-between pb-5 border-b-[0.5px] border-white ">
        <p>
          <span className="rbc-toolbar-label">{label}</span>
        </p>
        <div className="flex space-x-2">
          <button type="button" className="text-white hover:text-black hover:bg-[#fce36e]" onClick={() => toolbar.onNavigate('PREV')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" stroke="2" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
          </button>
          <button type="button" className="text-white hover:text-black hover:bg-[#fce36e]" onClick={() => toolbar.onNavigate('NEXT')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" stroke="2" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-[380px] p-6 border-l space-y-9">
      <div className="bg-[#1E2C7C] grid place-items-center p-[35px] rounded-lg">
        <div className="grid place-items-center">
          <img
            className="w-[100px] h-[100px] rounded-full object-cover"
            src="images/profile_image.jfif"
            alt="profile_image"
          />
          <div className="text-[#FFFFFF] mt-2 flex items-center space-x-1">
            <h4 className=" text-[21px] font-bold">Lucas Morales</h4>
            <img
              className="w-[18px] h-[18px]"
              src="images/Dashboard_Verified_Badge.png"
              alt="Dashboard_Verified_Badge"
            />
          </div>
          <p className="text-[16px] font-normal text-[#FFFFFF]">
            Verified Student
          </p>
        </div>
        <div className="flex itmes-center space-x-2 mt-2">
          <div className="bg-[#ffffff3d] p-2 text-[#FFFFFF] text-center place-items-center rounded-md">
            <p className="text-[21px] font-bold">32</p>
            <p className="text-[12px]">Total Course</p>
          </div>
          <div className="bg-[#ffffff3d] p-2 text-[#FFFFFF] grid text-center place-items-center rounded-md">
            <p className="text-[21px] font-bold">120</p>
            <p className="text-[12px]">Study Hours</p>
          </div>
          <div className="bg-[#ffffff3d] p-2 text-[#FFFFFF] grid text-center place-items-center rounded-md">
            <p className="text-[21px] font-bold">5.0</p>
            <p className="text-[12px]">Rating</p>
          </div>
        </div>
      </div>
      {/* <div className="w-full">
        <StyledCalendar value={value} onChange={handleChange} />

      </div> */}
      <div className="relative">

        <BigCalender
          style={{
            minHeight: 100,
            // height: 350,
            background: "#677be7",
            border: "none",
            minWidth: "100%",
            padding: "30px",
            borderRadius: "10px",
            position: "relative"
          }}
          components={{ toolbar: MyToolbar }}
          popup={true}
          onKeyPressEvent={(e) => console.log("e", e)}
          formats={formats}
          // toolbar={false}
          views={["month"]}
          startAccessor="start"
          endAccessor="end"
          localizer={localizer}
          events={eventsWithDefaultDuration}
          onSelectEvent={handleEventClick}
          defaultView="month"
        />
        <div className={`${showModal ? "absolute" : "hidden"} top-[185.5px] z-10`}>
          <div className="w-full h-1/2 flex flex-col justify-end p-5 shadow-lg z-[100] border border-gray-200 bg-white">
            <h3 className="text-[16px] font-bold text-[#5E616D] my-3">{selectedEvent?.title}</h3>
            <p className="text-base font-normal text-[#5E616D]">
              Start: {selectedEvent?.start?.toLocaleString()}<br />
            </p>
          </div>
          <button className="text-red-700 absolute top-2 right-2" onClick={() => setShowModal(false)}>Close</button>
        </div>
      </div>
      <div>
        <div className="flex items-center mb-3 justify-between">
          <h5 className="text-[20px] font-semibold">Announcements</h5>
          <p className="text-[#5E616D] text-[16px] cursor-pointer font-medium">
            See All
          </p>
        </div>
        <div className="bg-[#262626] rounded-lg p-3">
          <div className="flex items-center space-x-1 mb-2">
            <img
              className="rounded-full object-cover w-[28px] h-[28px]"
              src="images/announce_profile_image.jfif"
              alt="profile_imagge"
            />
            <p className="text-[13px] text-[#FFFFFF] font-medium">
              Toby Barfield
            </p>
          </div>
          <p className="text-[#FFFFFF] text-[11px] mb-3">
            Welcome to Global FX Suite Guys! This is the start of something
            great!
          </p>
          <p className="text-[9px] text-[#FFFFFF]">15 min ago</p>
        </div>
        <div className="bg-[#FFFFFF] rounded-lg p-3">
          <div className="flex items-center space-x-1 mb-2">
            <img
              className="rounded-full object-cover w-[28px] h-[28px]"
              src="images/announce_profile_image.jfif"
              alt="profile_imagge"
            />
            <p className="text-[13px] font-medium text-[#040404]">
              Tonya Hannibal
            </p>
          </div>
          <p className="text-[#5E616D] text-[11px] mb-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco.
          </p>
          <p className="text-[9px] text-[#5E616D]">2 hours ago</p>
        </div>
        <div className="bg-[#FFFFFF] rounded-lg p-3">
          <div className="flex items-center space-x-1 mb-2">
            <img
              className="rounded-full object-cover w-[28px] h-[28px]"
              src="images/announce_profile_image.jfif"
              alt="profile_imagge"
            />
            <p className="text-[13px] font-medium text-[#040404]">
              Tonya Hannibal
            </p>
          </div>
          <p className="text-[#5E616D] text-[11px] mb-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco.
          </p>
          <p className="text-[9px] text-[#5E616D]">2 hours ago</p>
        </div>
      </div>

    </div>
  );
};

export default RightSidebar;
