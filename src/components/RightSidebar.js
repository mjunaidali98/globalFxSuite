import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../components/firebase";

import { Calendar as BigCalender, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Loader from "./loader";
import { timeSince } from "../functions";

const RightSidebar = () => {
  const localizer = momentLocalizer(moment)
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [pageSize, setPageSize] = useState(3);
  const scheduleCollectionRef = collection(db, "schedule");
  const announcementsCollectionRef = collection(db, "announcements");
  const memberCollectionRef = collection(db, 'members');
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true);

    const q = query(scheduleCollectionRef, orderBy("timestamp", "desc"));

    const q_announcements = query(announcementsCollectionRef, orderBy("timestamp", "desc"));

    const unsubscribe = async () => {
      const documents = await getDocs(q);
      const schedule = [];

      documents.forEach((document) => {
        schedule.push({
          id: document.id,
          ...document.data(),
        });
      });
      const defaultDuration = 60; // 1 hour in minutes
      const eventsWithDefaultDuration = schedule.map((event) => {
        let startTime = new Date(event.timestamp * 1000);
        return {
          ...event,
          start: startTime,
          end: new Date(startTime.getTime() + (defaultDuration * 60000)),
        };
      });
      setSchedule(eventsWithDefaultDuration);

      const announcementsDocuments = await getDocs(q_announcements);
      let announcementsDocs = [];
      announcementsDocuments.forEach(async (doc) => {
        announcementsDocs.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      announcementsDocs = announcementsDocs.map(async (item) => {
        let user = await getMemberBySenderId(item.sender);
        return { ...item, user }
      })
      let data = await Promise.all(announcementsDocs)
      setAnnouncements(data);
      setLoading(false);

    };

    return () => unsubscribe();
    // eslint-disable-next-line
  }, []);
  // eslint-enable-next-line

  async function getMemberBySenderId(senderId) {
    try {
      const memberDocSnapshot = await getDoc(doc(memberCollectionRef, senderId));
      if (!memberDocSnapshot.exists()) {
        console.log('No matching document.');
        return null;
      }
      const memberData = memberDocSnapshot.data();
      const member = { id: memberDocSnapshot.id, ...memberData }
      return member
    } catch (e) {
      console.error('Error getting member: ', e);
      return null;
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const updateState = () => {
    if (announcements.length !== pageSize) {
      setPageSize(announcements.length);
    } else {
      setPageSize(3);
    }
  };


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
      <div className="bg-[#1E2C7C] grid place-items-center p-[35px] rounded-xl">
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
        <div className="grid grid-cols-3 itmes-center space-x-2 mt-2">
          <div className="bg-[#ffffff3d] p-2 text-[#FFFFFF] text-center place-items-center rounded-xl">
            <p className="text-[21px] font-bold">32</p>
            <p className="text-[12px]">Total Course</p>
          </div>
          <div className="bg-[#ffffff3d] p-2 text-[#FFFFFF] text-center place-items-center rounded-xl">
            <p className="text-[21px] font-bold">120</p>
            <p className="text-[12px]">Study Hours</p>
          </div>
          <div className="bg-[#ffffff3d] p-2 text-[#FFFFFF] text-center place-items-center rounded-xl">
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
          events={schedule}
          onSelectEvent={handleEventClick}
          defaultView="month"
        />
        <div className={`${showModal ? "absolute" : "hidden"} w-full left-0 right-0 top-0 z-10`}>
          <div className="w-full h-1/2 flex flex-col justify-end p-5 shadow-lg z-[100] border border-gray-200 bg-white rounded-xl bg-opacity-80">
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
          {
            announcements.length && announcements.length > 3 ?
              <p role={"button"} onClick={() => updateState()} className="text-[#5E616D] text-[16px] cursor-pointer font-medium">
                {announcements.length === pageSize ? "Hide" : "See more"}
              </p>
              : ""}
        </div>
        {loading ?
          <div className="w-full items-center flex justify-center my-5">
            <Loader />
          </div> :
          !announcements.length ?
            <p className="text-gray-400"> No announcements</p>
            :
            announcements.slice(0, pageSize).map((item, idx) => {
              console.log("item", item)
              return (

                <React.Fragment>
                  {!idx &&
                    <div className="bg-[#262626] rounded-xl p-3">
                      <div className="flex items-center space-x-1 mb-2">
                        <img
                          className="rounded-full object-cover w-[28px] h-[28px]"
                          src={item.user.photo}
                          alt="profile_imagge"
                        />
                        <p className="text-[13px] text-[#FFFFFF] font-medium">
                          {item.user.name}
                        </p>
                      </div>
                      <p className="text-[#FFFFFF] text-[11px] mb-3">
                        Welcome to Global FX Suite Guys! This is the start of something
                        great!
                      </p>
                      <p className="text-[9px] text-[#FFFFFF]">{timeSince(item.timestamp)}</p>
                    </div>
                  }
                  <div className="bg-[#FFFFFF] rounded-xl p-3">
                    <div className="flex items-center space-x-1 mb-2">
                      <img
                        className="rounded-full object-cover w-[28px] h-[28px]"
                        src={item.user.photo}
                        alt="profile_imagge"
                      />
                      <p className="text-[13px] font-medium text-[#040404]">
                        {item.user.name}
                      </p>
                    </div>
                    <p className="text-[#5E616D] text-[11px] mb-3">
                      {item.content}
                    </p>
                    <p className="text-[9px] text-[#5E616D]">{timeSince(item.timestamp)}</p>
                  </div>
                </React.Fragment>
              )
            })}
      </div>
    </div>
  );
};

export default RightSidebar;
