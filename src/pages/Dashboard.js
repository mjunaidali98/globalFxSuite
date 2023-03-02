import { useNavigate } from "react-router-dom";
import {
  collection,
  // endAt,
  // getCountFromServer,
  getDocs,
  limit,
  // limitToLast,
  orderBy,
  query,
  // startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../components/firebase";
import TradeBox from "../components/TradeBox";
const Dashboard = () => {
  const [user] = useState(() => {
    const saveUser = JSON.parse(localStorage.getItem("user"));
    if (saveUser) {
      return saveUser;
    } else {
      return null;
    }
  });

  const navigate = useNavigate();
  const [expand, setExpand] = useState(null);
  const [tradeIdeas, setTradeIdeas] = useState([]);
  // const [page] = useState(1);
  const PAGE_SIZE = 5;
  // const [lastVisible, setLastVisible] = useState(null);
  // const [firstVisible, setFirstVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [countTradeIdeas, setCountTradeIdeas] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "trade_ideas"),
      where("status", "==", "active"),
      orderBy("timestamp", "desc"),
      limit(PAGE_SIZE)
    );
    const unsubscribe = async () => {
      setLoading(true);
      const documents = await getDocs(q);
      const tradeIdeas = [];
      documents.forEach((document) => {
        tradeIdeas.push({
          id: document.id,
          ...document.data(),
        });
      });
      setTradeIdeas(tradeIdeas);
      // setLastVisible(documents.docs[documents.docs.length - 1]);
      // setFirstVisible(documents.docs[0]);
      setLoading(false);
    };
    return () => unsubscribe();
  }, []);

  // const nextPage = async () => {
  //   setLoading(true);
  //   const tradeRef = collection(db, "trade_ideas");
  //   const q = query(
  //     tradeRef,
  //     orderBy("timestamp", "desc"),
  //     startAfter(lastVisible.data().timestamp), // Pass the reference
  //     limit(PAGE_SIZE)
  //   );
  //   const documents = await getDocs(q);
  //   updateState(documents);
  //   setLoading(false);
  // };

  // const updateState = (documents) => {
  //   if (!documents.empty) {
  //     const tradeIdeasArray = [];
  //     documents.forEach((document) => {
  //       tradeIdeasArray.push({
  //         id: document.id,
  //         ...document.data(),
  //       });
  //     });
  //     setTradeIdeas([...tradeIdeas, ...tradeIdeasArray]);
  //   }
  //   if (documents?.docs[0]) {
  //     // setFirstVisible(documents.docs[0]);
  //   }
  //   if (documents?.docs[documents.docs.length - 1]) {
  //     setLastVisible(documents.docs[documents.docs.length - 1]);
  //   }
  // };

  // useEffect(() => {
  //   const countTradeIdeas = async () => {
  //     const collectionRef = collection(db, "trade_ideas");
  //     const snapshot = await getCountFromServer(collectionRef);
  //     setCountTradeIdeas(snapshot.data().count);
  //   };

  //   countTradeIdeas();
  // }, []);


  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="min-h-full p-7 container mx-auto ">
        <h2 className="header">Dashboard</h2>
        <div className="mt-3 flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 justify-start lg:justify-between xl:justify-start w-full items-start lg:space-x-3 xl:space-x-6">
          <div className="bg-[#1B283F] overflow-hidden rounded-lg w-[373px] h-[349px]">
            <div className="flex flex-col justify-end pl-6 min-h-[7.2rem]">
              <p className="text-[#FFFFFF] text-[22px] font-semibold">
                Welcome Back,
              </p>
              <h3 className="text-[32px] font-bold text-[#B5B5C3]">
                {user?.displayName !== null ? user?.displayName : "Guest"}
              </h3>
            </div>
            <div className="wellcome-image -mt-[11px]  pl-6">
              <button className="mt-[2.8rem] bg-[#F64E60] text-[#FFFFFF] rounded-lg w-[172px] h-[43px] text-center text-[12px] font-semibold">
                Go to My Account
              </button>
            </div>
          </div>
          <div className="bg-[#FFFFFF] w-[373px] h-[349px] rounded-lg overflow-hidden">
            <img
              className=" w-full h-[170px] object-cover "
              src="images/dashboard_forex_image.jfif"
              alt="forex"
            />
            <div className="p-5">
              <h3 className="text-[21px] font-semibold mb-1">
                Forex 101 Introduction
              </h3>
              <p className="text-[13px] font-medium text-[#838383]">
                You’ve completed 3 out of 12 lessons
              </p>
              <progress className="w-full rounded-md mt-5" value="32" max="100" />
              <button className="bg-[#6469EE] mt-5 text-[#FFFFFF] w-full rounded-lg h-[43px] text-center text-[12px] font-semibold">
                Resume Lesson{" "}
              </button>
            </div>
          </div>
        </div>
        <div className="flex py-6 items-center justify-between">
          <h2 className="header">Recent Trade Ideas</h2>
          {/* <p
            onClick={() => navigate("/trade")}
            className="text-[16px] text-[#404040] font-medium cursor-pointer"
          >
            SEE ALL
          </p> */}
        </div>
        {loading ? (
          <h2 className="text-xl font-semibold">Loading...</h2>
        ) : (
          <>
            <TradeBox
              tradeIdeas={tradeIdeas}
              expand={expand}
              setExpand={setExpand}
            />

            {/* {countTradeIdeas > PAGE_SIZE &&
              countTradeIdeas !== tradeIdeas?.length && ( */}
            <button
              onClick={() => navigate("/trade")}
              className="bg-[#B4B4B426]  w-full mt-3 rounded-md text-[12px] font-semibold h-[51px] text-center"
            >
              Load More
            </button>
            {/* )} */}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
