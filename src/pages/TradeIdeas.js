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
  const archived = true;
  const [tab, setTab] = useState(1);

  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countTradeIdeas, setCountTradeIdeas] = useState(null);
  const [archivedTradeIdeas, setArchivedTradeIdeas] = useState([]);
  const [lastArchivedVisible, setLastArchivedVisible] = useState(null);
  const [firstArchivedVisible, setFirstArchivedVisible] = useState(null);
  const [archivedPage, setArchivedPage] = useState(1);
  const [archivedCountTradeIdeas, setArchivedCountTradeIdeas] = useState(null);



  useEffect(() => {
    const q = query(collection(db, "trade_ideas"),
      where('status', '==', status),
      orderBy("timestamp", "desc"),
      limit(PAGE_SIZE),
    );

    const a_q = query(collection(db, "trade_ideas"),
      where('archived', '==', archived),
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

      //ARCHIVED TRADES STARTS
      const documents_archived = await getDocs(a_q);
      const archivedtradeIdeas = [];
      documents_archived.forEach((document) => {
        archivedtradeIdeas.push({
          id: document.id,
          ...document.data(),
        });
      });

      setArchivedTradeIdeas(archivedtradeIdeas);
      setLastArchivedVisible(documents_archived.docs[documents_archived.docs.length - 1]);
      setFirstArchivedVisible(documents_archived.docs[0]);
      //ARCHIVED TRADES END
    };
    return () => unsubscribe();
  }, [archived]);

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
    async function countTradeIdeas() {
      const q = query(collection(db, 'trade_ideas'), where('status', '==', status));
      const snapshot = await getDocsFromServer(q);
      setCountTradeIdeas(snapshot.size);

      const a_q = query(collection(db, 'trade_ideas'), where('archived', '==', archived));
      const snapshot_archived = await getDocsFromServer(a_q);
      setArchivedCountTradeIdeas(snapshot_archived.size);
    };

    countTradeIdeas();
  }, [archived]);

  const nextArchivedPage = async () => {
    setLoading(true);
    const tradeArchivedRef = collection(db, "trade_ideas");
    const a_q = query(
      tradeArchivedRef,
      where('archived', '==', archived),
      orderBy("timestamp", "desc"),
      startAfter(lastArchivedVisible.data().timestamp), // Pass the reference
      limit(PAGE_SIZE)
    );
    const documents_archived = await getDocs(a_q);
    updateArchivedState(documents_archived);
    setLoading(false);
  };

  const previousArchivedPage = async () => {
    setLoading(true);
    const tradeArchivedRef = collection(db, "trade_ideas");
    const a_q = query(
      tradeArchivedRef,
      where('archived', '==', archived),
      orderBy("timestamp", "desc"),
      endAt(firstArchivedVisible.data().timestamp), // Use `endAt()` method and pass the reference
      limit(PAGE_SIZE)
    );
    const documents_archived = await getDocs(a_q);
    updateArchivedState(documents_archived);
    setLoading(false);
  };

  const updateArchivedState = (documents) => {
    if (!documents.empty) {
      const archivedtradeIdeas = [];
      documents.forEach((document) => {
        archivedtradeIdeas.push({
          id: document.id,
          ...document.data(),
        });
      });
      setArchivedTradeIdeas(archivedtradeIdeas);
    }
    if (documents?.docs[0]) {
      setFirstArchivedVisible(documents.docs[0]);
    }
    if (documents?.docs[documents.docs.length - 1]) {
      setLastArchivedVisible(documents.docs[documents.docs.length - 1]);
    }
  };

  const handleArchivedChange = (event, value) => {
    value > archivedPage ? nextArchivedPage() : previousArchivedPage();
    setArchivedPage(value);
  };

  const renderElement = (value) => {
    switch (value) {
      case 2: {
        return (
          <div className="flex flex-col mt-8 justify-between">
            <h2 className="header">Archived</h2>
            <TradeBox
              tradeIdeas={archivedTradeIdeas}
              expand={expand}
              setExpand={setExpand}
            />
            {archivedCountTradeIdeas > PAGE_SIZE && (
              <div className="mt-9 flex justify-between items-center">
                <p className="text-[14px] font-medium text-[#5E6278]">
                  Showing {PAGE_SIZE * archivedPage - PAGE_SIZE} to {PAGE_SIZE * archivedPage <= (archivedCountTradeIdeas) ? (PAGE_SIZE * archivedPage) : archivedCountTradeIdeas} of{" "}
                  {archivedCountTradeIdeas} entries
                </p>
                <Pagination
                  variant="outlined"
                  shape="rounded"
                  style={{
                    marginTop: "20px",
                  }}
                  count={Math.ceil(archivedCountTradeIdeas / PAGE_SIZE)}
                  page={archivedPage}
                  onChange={handleArchivedChange}
                />
              </div>
            )}
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
