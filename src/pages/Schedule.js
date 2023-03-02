import {
  collection,
  endAt,
  getCountFromServer,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { db } from "../components/firebase";
import Moment from "react-moment";

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countSchedule, setCountSchedule] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "schedule"),
      orderBy("timestamp", "desc"),
      limit(PAGE_SIZE)
    );
    const unsubscribe = async () => {
      setLoading(true);
      const documents = await getDocs(q);
      const schedule = [];
      documents.forEach((document) => {
        schedule.push({
          id: document.id,
          ...document.data(),
        });
      });
      setSchedule(schedule);
      setLastVisible(documents.docs[documents.docs.length - 1]);
      setFirstVisible(documents.docs[0]);
      setLoading(false);
    };
    return () => unsubscribe();
  }, []);

  const nextPage = async () => {
    setLoading(true);
    const tradeRef = collection(db, "schedule");
    const q = query(
      tradeRef,
      orderBy("timestamp", "desc"),
      startAfter(lastVisible.data().timestamp), // Pass the reference
      limit(PAGE_SIZE)
    );
    const documents = await getDocs(q);
    updateState(documents);
    setLoading(false);
  };

  const previousPage = async () => {
    setLoading(true);
    const tradeRef = collection(db, "schedule");
    const q = query(
      tradeRef,
      orderBy("schedule", "desc"),
      endAt(firstVisible.data().timestamp), // Use `endAt()` method and pass the reference
      limitToLast(PAGE_SIZE)
    );
    const documents = await getDocs(q);
    updateState(documents);
    setLoading(false);
  };

  const updateState = (documents) => {
    if (!documents.empty) {
      const schedule = [];
      documents.forEach((document) => {
        schedule.push({
          id: document.id,
          ...document.data(),
        });
      });
      setSchedule(schedule);
    }
    if (documents?.docs[0]) {
      setFirstVisible(documents.docs[0]);
    }
    if (documents?.docs[documents.docs.length - 1]) {
      setLastVisible(documents.docs[documents.docs.length - 1]);
    }
  };

  const handleChange = (event, value) => {
    value > page ? nextPage() : previousPage();
    setPage(value);
  };

  useEffect(() => {
    const countSchedule = async () => {
      const collectionRef = collection(db, "schedule");
      const snapshot = await getCountFromServer(collectionRef);
      setCountSchedule(snapshot.data().count);
    };

    countSchedule();
  }, [page]);

  return (
    <div className="min-h-full p-7 max-w-[855px]">
      <div className="mt-8 md:flex items-center justify-between">
        <div>
          <h3 className="header">Scheduled Events</h3>
          <p className="text-[11px]">
            Curated list of all scheduled for the selected month
          </p>
        </div>
        <div className="bg-[#6469EE] mt-4 md:mt-0 h-[43px] cursor-pointer] w-[109.5px] justify-center rounded-lg text-[11px] text-[#FFFFFF] flex items-center space-x-2 font-semibold">
          <button className="">This Month</button>
          <img
            className="-rotate-90 w-[10px] h-[10px]"
            src="images/Dashboard_Calendar_LeftArrow.png"
            alt="arrow_icon"
          />
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {loading ? (
          <h2 className="text-xl font-semibold">Loading...</h2>
        ) : (
          <>
            {schedule?.length > 0 &&
              schedule?.map(({ id, title, timestamp }, index) => (
                <div
                  key={id}
                  className={`${
                    index === 0
                      ? "bg-[#0C101B] text-[#FFFFFF]"
                      : "bg-[#FFFFFF] text-[#262626]"
                  }  md:flex space-y-5 md:space-y-0 p-5 w-full items-center justify-between rounded-lg`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`${
                        index === 0 ? "bg-[#55585F]" : "bg-[#55585F0A] "
                      }  grid place-items-center rounded-[7px] w-[52px] h-[52px]`}
                    >
                      <h3 className="text-[16px] font-semibold leading-3">
                        <Moment format="DD">{timestamp}</Moment>
                      </h3>
                      <p className="text-[12px] uppercase tracking-widest">
                        <Moment format="MMM">{timestamp}</Moment>
                      </p>
                    </div>
                    <div className="grid justify-between h-[52px]">
                      <p className="text-[15px] font-semibold ">{title}</p>
                      <div className="flex items-center space-x-2">
                        <img
                          src={`images/${
                            index === 0 ? "Clock_Slected" : "Clock1"
                          }.png`}
                          alt="clock_icon"
                        />
                        <h4 className="text-[13px]">
                          <Moment format="LT">{timestamp}</Moment>
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div
                      className={`${
                        index === 0
                          ? "bg-[#4DC183] text-[#FFFFFF]"
                          : "bg-[#B4B4B426] text-[#262626]"
                      }  cursor-pointer rounded-lg text-[12px] font-bold w-[152px] h-[51px] grid place-items-center`}
                    >
                      Join Live Call
                    </div>
                    <img
                      src={`images/${
                        index === 0 ? "Arrow_Slected.png" : "Arrow.png"
                      }`}
                      alt="Arrow_icon"
                    />
                  </div>
                </div>
              ))}
            {countSchedule > PAGE_SIZE && (
              <div className="mt-9 flex justify-between items-center">
                <p className="text-[14px] font-medium text-[#5E6278]">
                  Showing {PAGE_SIZE * page - PAGE_SIZE} to {PAGE_SIZE * page}{" "}
                  of {countSchedule} entries
                </p>
                <Pagination
                  variant="outlined"
                  shape="rounded"
                  style={{
                    marginTop: "20px",
                  }}
                  count={Math.ceil(countSchedule / PAGE_SIZE)}
                  page={page}
                  onChange={handleChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Schedule;
