import {
  collection,
  endAt,
  // getCountFromServer,
  getDocs,
  getDocsFromServer,
  limit,
  // limitToLast,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
// import { NavLink } from "react-router-dom";
import { db } from "../components/firebase";
import TradeBox from "../components/TradeBox";

const TradeIdeas = () => {
  const [expand, setExpand] = useState(null);
  const [tradeIdeas, setTradeIdeas] = useState([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const status = 'active';
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countTradeIdeas, setCountTradeIdeas] = useState(null);
  const [tab, setTab] = useState(1);

  useEffect(() => {
    const q = query(collection(db, "trade_ideas"),
      where('status', '==', status),
      orderBy("timestamp", "desc"),
      limit(PAGE_SIZE),
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
      setLastVisible(documents.docs[documents.docs.length - 1]);
      setFirstVisible(documents.docs[0]);
      setLoading(false);
    };
    return () => unsubscribe();
  }, []);

  const nextPage = async () => {
    setLoading(true);

    const tradeRef = collection(db, "trade_ideas");
    const q = query(
      tradeRef,
      where('status', '==', status),
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
    const tradeRef = collection(db, "trade_ideas");
    const q = query(
      tradeRef,
      where('status', '==', status),
      orderBy("timestamp", "desc"),
      endAt(firstVisible.data().timestamp), // Use `endAt()` method and pass the reference
      limit(PAGE_SIZE)
    );
    const documents = await getDocs(q);
    updateState(documents);
    setLoading(false);
  };

  const updateState = (documents) => {
    if (!documents.empty) {
      const tradeIdeas = [];
      documents.forEach((document) => {
        tradeIdeas.push({
          id: document.id,
          ...document.data(),
        });
      });
      setTradeIdeas(tradeIdeas);
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
    const countTradeIdeas = async () => {
      const q = query(collection(db, 'trade_ideas'), where('status', '==', status));
      const snapshot = await getDocsFromServer(q);
      setCountTradeIdeas(snapshot.size);
      // setCountTradeIdeas(snapshot.data().count);
    };
    countTradeIdeas();
  }, []);

  const renderElement = (value) => {
    switch (value) {
      case 2: {
        return (
          <div className="flex flex-col items-center mt-8 justify-between ">
            <h2 className="header">Archived</h2>

            <h3 className="text-[32px] font-bold text-[#B5B5C3]">
              Coming Soon
            </h3>
          </div>
        )
      }
      case 1:
      default:
        {
          return (
            <React.Fragment>
              <h2 className="header mt-8">Most Recent Trade Ideas</h2>

              <TradeBox
                tradeIdeas={tradeIdeas}
                expand={expand}
                setExpand={setExpand}
              />
              {countTradeIdeas > PAGE_SIZE && (
                <div className="mt-9 flex justify-between items-center">
                  <p className="text-[14px] font-medium text-[#5E6278]">
                    Showing {PAGE_SIZE * page - PAGE_SIZE} to {PAGE_SIZE * page <= (countTradeIdeas) ? (PAGE_SIZE * page) : countTradeIdeas} of{" "}
                    {countTradeIdeas} entries
                  </p>
                  <Pagination
                    variant="outlined"
                    shape="rounded"
                    style={{
                      marginTop: "20px",
                    }}
                    count={Math.ceil(countTradeIdeas / PAGE_SIZE)}
                    page={page}
                    onChange={handleChange}
                  />
                </div>
              )}
            </React.Fragment>
          )
        }

    }
  }


  return (
    <div className="min-h-full p-7">
      {/* Tabs Start */}
      <div className="flex items-center space-x-2">
        <div
          onClick={() => tab !== 1 && setTab(1)}
          className={
            tab === 1
              ? "bg-[#6469EE] rounded-md text-[#FFFFFF]"
              : "bg-[#FFFFFF] text-[#5E616D] rounded-md"
          }
        >
          <button className="text-[13px] font-bold px-3 py-2 rounded-md cursor-pointer">
            Active Trades
          </button>
        </div>
        <div
          onClick={() => tab !== 2 && setTab(2)}
          className={
            tab === 2
              ? "bg-[#6469EE] text-[#FFFFFF] rounded-md"
              : "bg-[#FFFFFF] text-[#5E616D] rounded-md"
          }
        >
          <button className=" text-[13px] font-bold px-3 py-2 rounded-md cursor-pointer">
            Archived
          </button>
        </div>
      </div>
      {/* Tabs End */}

      {loading ? (
        <h2 className="text-xl my-5 font-semibold">Loading...</h2>
      ) : (
        <React.Fragment>
          {renderElement(tab)}
        </React.Fragment>
      )}
    </div>
  );
};

export default TradeIdeas;
