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

const Article = () => {
  const [article, setArticle] = useState([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countArticle, setCountArticle] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "resources"),
      where("type", "==", "article"),
      orderBy("timestamp", "desc"),
      limit(PAGE_SIZE)
    );
    const unsubscribe = async () => {
      setLoading(true);
      const documents = await getDocs(q);
      const article = [];
      documents.forEach((document) => {
        article.push({
          id: document.id,
          ...document.data(),
        });
      });
      setArticle(article);
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
      where("type", "==", "article"),
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
      where("type", "==", "article"),
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
      const article = [];
      documents.forEach((document) => {
        article.push({
          id: document.id,
          ...document.data(),
        });
      });
      setArticle(article);
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
    const countarticle = async () => {
      const collectionRef = collection(db, "resources");
      const q = query(collectionRef, where("type", "==", "article"));
      const snapshot = await getCountFromServer(q);
      setCountArticle(snapshot.data().count);
    };

    countarticle();
  }, [page]);
  return (
    <div className="min-h-full p-7 max-w-[855px]">
      <ResourceTab />

      <div className="mt-8 ">
        <h3 className="header">Articles</h3>
        <p className="text-[11px]">
          Curated list of all available articles and articles
        </p>
        {loading ? (
          <h2 className="text-xl font-semibold">Loading...</h2>
        ) : (
          <>
            {article?.length > 0 &&
              article?.map(({ id, title, type, url }) => (
                <div key={id} className="flex items-center flex-wrap mt-6">
                  <div className="bg-[#FFFFFF] mr-5 mb-5 flex  justify-between flex-col rounded-lg overflow-hidden min-w-[238px] h-[220px] max-w-[238px] p-7">
                    <div className="">
                      <p className="text-[11px] font-semibold uppercase">
                        {type}
                      </p>
                      <h3 className="text-[17px] font-semibold mt-2">
                        {title}
                      </h3>
                    </div>

                    <div className="mt-4 space-x-1 flex items-center justify-between">
                      <a href={url}>
                        <button className="text-[13px] border font-medium rounded-lg w-[117px] h-[42px]">
                          Read
                        </button>
                      </a>
                      <button className="text-[13px] bg-[#F4F4F4] rounded-lg font-medium h-[42px] w-[63px]">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            {countArticle > PAGE_SIZE && (
              <div className="mt-9 flex justify-between items-center">
                <p className="text-[14px] font-medium text-[#5E6278]">
                  Showing {PAGE_SIZE * page - PAGE_SIZE} to {PAGE_SIZE * page}{" "}
                  of {countArticle} entries
                </p>
                <Pagination
                  variant="outlined"
                  shape="rounded"
                  style={{
                    marginTop: "20px",
                  }}
                  count={Math.ceil(countArticle / PAGE_SIZE)}
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

export default Article;
