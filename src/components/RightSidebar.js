import React, { useState } from "react";
import Calendar from "moedim";
import styled from "@emotion/styled";
import { Calendar as BigCalender, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
// const StyledCalendar = styled(Calendar)`
//   --moedim-primary: #f00;
// `;

const StyledCalendar = styled(Calendar)(({ theme }) => ({
  backgroundColor: "#677be7",
  color: "#FFFFFF",
  border: "none",
  minWidth: "100%",
  padding: "30px",
  borderRadius: "10px",
  '& .cIFnvd[aria-pressed="true"]': {
    background: "#fce36e",
    borderRadius: "5px !important",
    color: "#000",
  },
  "& .fatsuA": {
    marginTop: "14px",
  },
  "& .cfqheK": {
    minWidth: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    paddingTop: "5px",
  },
  "& .cuRXYf": {
    borderBottom: "0.5px solid #FFFFFF",
    paddingBottom: "20px",
  },
  "& .cIFnvd": {
    border: "none",
    fontSize: "12px",
    borderRadius: "15%",
  },
  "& bxUOeX": {
    borderRadius: "15%",
    width: "33px",
    height: "33px",
    backgroundColor: "transparent",
  },
  "& .kVEIdA": {
    color: "#fff",
    borderRadius: "0%",
    fontSize: "12px",
    fontWeight: "bold",
  },
}));
// locale = "en-US"
const RightSidebar = () => {
  const localizer = momentLocalizer(moment)

  const myEventsList = [
    {
      'title': 'All Day Event very long title',
      'allDay': true,
      'start': new Date(2015, 3, 0),
      'end': new Date(2015, 3, 1)
    },
    {
      'title': 'Long Event',
      'start': new Date(2015, 3, 7),
      'end': new Date(2015, 3, 10)
    },

    {
      'title': 'DTS STARTS',
      'start': new Date(2016, 2, 13, 0, 0, 0),
      'end': new Date(2016, 2, 20, 0, 0, 0)
    },

    {
      'title': 'DTS ENDS',
      'start': new Date(2016, 10, 6, 0, 0, 0),
      'end': new Date(2016, 10, 13, 0, 0, 0)
    },

    {
      'title': 'Some Event',
      'start': new Date(2015, 3, 9, 0, 0, 0),
      'end': new Date(2015, 3, 9, 0, 0, 0)
    },
    {
      'title': 'Conference',
      'start': new Date(2015, 3, 11),
      'end': new Date(2015, 3, 13),
      desc: 'Big conference for important people'
    },
    {
      'title': 'Meeting',
      'start': new Date(2015, 3, 12, 10, 30, 0, 0),
      'end': new Date(2015, 3, 12, 12, 30, 0, 0),
      desc: 'Pre-meeting meeting, to prepare for the meeting'
    },
    {
      'title': 'Lunch',
      'start': new Date(2015, 3, 12, 12, 0, 0, 0),
      'end': new Date(2015, 3, 12, 13, 0, 0, 0),
      desc: 'Power lunch'
    },
    {
      'title': 'Meeting',
      'start': new Date(2015, 3, 12, 14, 0, 0, 0),
      'end': new Date(2015, 3, 12, 15, 0, 0, 0)
    },
    {
      'title': 'Happy Hour',
      'start': new Date(2015, 3, 12, 17, 0, 0, 0),
      'end': new Date(2015, 3, 12, 17, 30, 0, 0),
      desc: 'Most important meal of the day'
    },
    {
      'title': 'Dinner',
      'start': new Date(2015, 3, 12, 20, 0, 0, 0),
      'end': new Date(2015, 3, 12, 21, 0, 0, 0)
    },
    {
      'title': 'Birthday Party',
      'start': new Date(2015, 3, 13, 7, 0, 0),
      'end': new Date(2015, 3, 13, 10, 30, 0)
    },
    {
      'title': 'Birthday Party 2',
      'start': new Date(2015, 3, 13, 7, 0, 0),
      'end': new Date(2015, 3, 13, 10, 30, 0)
    },
    {
      'title': 'Birthday Party 3',
      'start': new Date(2015, 3, 13, 7, 0, 0),
      'end': new Date(2015, 3, 13, 10, 30, 0)
    },
    {
      'title': 'Late Night Event',
      'start': new Date(2015, 3, 17, 19, 30, 0),
      'end': new Date(2015, 3, 18, 2, 0, 0)
    },
    {
      'title': 'Multi-day Event',
      'start': new Date(2015, 3, 20, 19, 30, 0),
      'end': new Date(2015, 3, 22, 2, 0, 0)
    }
  ]

  const [value, setValue] = useState(new Date());
  // const [nextActive, setNextActive] = useState(false);
  // const [previousActive, setPreviousActive] = useState(false);

  const handleChange = (d) => {
    if (d > new Date()) {
      // setNextActive(true);
    } else if (d < new Date()) {
      // setPreviousActive(true);
    } else {
      // setNextActive(false);
      // setPreviousActive(false);
    }
    setValue(d);
  };

  return (
    <div className="w-[360px] p-6 border-l space-y-9">
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
      <div className="w-full">
        <StyledCalendar value={value} onChange={handleChange} />

      </div>
      <div className="">

        <BigCalender
          style={{ height: 280 }}
          localizer={localizer}
          events={myEventsList}
          startAccessor="start"
          endAccessor="end"
        />
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
