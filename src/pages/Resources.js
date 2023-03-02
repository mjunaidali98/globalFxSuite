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
  where,
} from "firebase/firestore";
import { Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { db } from "../components/firebase";
import ResourceTab from "../components/ResourceTab";

const Resources = () => {
  const [resource, setResource] = useState([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countResource, setCountResource] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "resources"),
      where("type", "==", "document"),
      orderBy("timestamp", "desc"),
      limit(PAGE_SIZE)
    );
    const unsubscribe = async () => {
      setLoading(true);
      const documents = await getDocs(q);
      const resource = [];
      documents.forEach((document) => {
        resource.push({
          id: document.id,
          ...document.data(),
        });
      });
      setResource(resource);
      setLastVisible(documents.docs[documents.docs.length - 1]);
      setFirstVisible(documents.docs[0]);
      setLoading(false);
    };
    return () => unsubscribe();
  }, []);

  const nextPage = async () => {
    setLoading(true);
    const tradeRef = collection(db, "resources");
    const q = query(
      tradeRef,
      where("type", "==", "document"),
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
    const tradeRef = collection(db, "resources");
    const q = query(
      tradeRef,
      where("type", "==", "document"),
      orderBy("timestamp", "desc"),
      endAt(firstVisible.data().timestamp), // Use `endAt()` method and pass the reference
      limitToLast(PAGE_SIZE)
    );
    const documents = await getDocs(q);
    updateState(documents);
    setLoading(false);
  };

  const updateState = (documents) => {
    if (!documents.empty) {
      const resource = [];
      documents.forEach((document) => {
        resource.push({
          id: document.id,
          ...document.data(),
        });
      });
      setResource(resource);
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
    const countresource = async () => {
      const collectionRef = collection(db, "resources");
      const q = query(collectionRef, where("type", "==", "document"));
      const snapshot = await getCountFromServer(q);
      setCountResource(snapshot.data().count);
    };

    countresource();
  }, [page]);

  return (
    <div className="min-h-full max-w-[855px] p-7">
      <ResourceTab />

      <div className="mt-8 ">
        <h3 className="header">Downloadable Resources</h3>
        <p className="text-[11px]">
          Curated list of all available resources and articles
        </p>
        {loading ? (
          <h2 className="text-xl font-semibold">Loading...</h2>
        ) : (
          <>
            <div className="grid sm:grid-cols-3 gap-6 mt-6">
              {resource?.length > 0 &&
                resource.map(({ id, url, type, title, discription }) => (
                  <div
                    key={id}
                    className="bg-[#FFFFFF] flex flex-col justify-between rounded-lg overflow-hidden max-w-fit"
                  >
                    {url && (
                      <img
                        className="w-[238px] h-[158px] object-center"
                        src={url}
                        alt="resource_image"
                      />
                    )}
                    <div className="p-5 max-w-[225px]">
                      <p className="uppercase text-[10px] font-semibold">
                        {type}
                      </p>
                      <h3 className="font-semibold text-[17px]">{title}</h3>
                      <p className="text-[12px] text-[#838383] mt-1 truncate">
                        {discription}
                      </p>
                      <div className="mt-4 space-x-1 flex items-center justify-between">
                        <button className="text-[13px] border font-medium rounded-lg w-[117px] h-[42px]">
                          Download
                        </button>
                        <button className="text-[13px] bg-[#F4F4F4] rounded-lg font-medium h-[42px] w-[63px]">
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {countResource > PAGE_SIZE && (
              <div className="mt-9 flex justify-between items-center">
                <p className="text-[14px] font-medium text-[#5E6278]">
                  Showing {PAGE_SIZE * page - PAGE_SIZE} to {PAGE_SIZE * page}{" "}
                  of {countResource} entries
                </p>
                <Pagination
                  variant="outlined"
                  shape="rounded"
                  style={{
                    marginTop: "20px",
                  }}
                  count={Math.ceil(countResource / PAGE_SIZE)}
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

export default Resources;
