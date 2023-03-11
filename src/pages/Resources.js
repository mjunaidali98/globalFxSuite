import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  endAt,
  getCountFromServer,
  getDocs,
  limit,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { db } from "../components/firebase";
import ResourceTab from "../components/ResourceTab";
import { useStore } from "../store";

const Resources = () => {
  const { state } = useStore();
  const { user } = state;
  const [resources, setResources] = useState([]);
  const [page, setPage] = useState(1);
  const [articlePage, setArticlePage] = useState(1);
  const PAGE_SIZE = 10;
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingSavedItems, setFetchingSavedItems] = useState(true);

  const [countResource, setCountResource] = useState(null);
  const [tab, setTab] = useState(1);
  const [article, setArticle] = useState([]);
  const [lastArticleVisible, setLastArticleVisible] = useState(null);
  const [firstArticleVisible, setFirstArticleVisible] = useState(null);
  const [countArticle, setCountArticle] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const savedResourcesRef = collection(db, "savedResources")
  const collectionRef = collection(db, "resources");
  useEffect(() => {
    const q = query(collectionRef,
      where("type", "==", "document"),
      orderBy("timestamp", "desc"),
      limit(PAGE_SIZE)
    );
    const q_a = query(collectionRef,
      where("type", "==", "article"),
      orderBy("timestamp", "desc"),
      limit(PAGE_SIZE)
    );

    const q_saved_res = query(savedResourcesRef, orderBy("timestamp", "desc"));

    const unsubscribe = async () => {
      setLoading(true);
      setFetchingSavedItems(true);
      const documents = await getDocs(q);
      const resource = [];
      documents.forEach((document) => {
        resource.push({
          id: document.id,
          ...document.data(),
        });
      });
      setResources(resource);
      setLastVisible(documents.docs[documents.docs.length - 1]);
      setFirstVisible(documents.docs[0]);
      setLoading(false);

      const data = await getDocs(q_a);
      const article = [];
      data.forEach((document) => {
        article.push({
          id: document.id,
          ...document.data(),
        });
      });
      setArticle(article);
      setLastArticleVisible(data.docs[data.docs.length - 1]);
      setFirstArticleVisible(data.docs[0]);

      const savedResourcesDocument = await getDocs(q_saved_res);
      const savedItemsArr = [];
      savedResourcesDocument.forEach((document) => {
        savedItemsArr.push({
          id: document.id,
          ...document.data(),
        });
      });
      setSavedItems(savedItemsArr);
      setFetchingSavedItems(false);

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
      setResources(resource);
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

  const nextArticlePage = async () => {
    setLoading(true);
    const tradeRef = collection(db, "resources");
    const q = query(
      tradeRef,
      where("type", "==", "article"),
      orderBy("timestamp", "desc"),
      startAfter(lastArticleVisible.data().timestamp), // Pass the reference
      limit(PAGE_SIZE)
    );
    const documents = await getDocs(q);
    updateArticleState(documents);
    setLoading(false);
  };

  const previousArticlePage = async () => {
    setLoading(true);
    const tradeRef = collection(db, "resources");
    const q = query(
      tradeRef,
      where("type", "==", "article"),
      orderBy("timestamp", "desc"),
      endAt(firstArticleVisible.data().timestamp), // Use `endAt()` method and pass the reference
      limitToLast(PAGE_SIZE)
    );
    const documents = await getDocs(q);
    updateArticleState(documents);
    setLoading(false);
  };

  const updateArticleState = (documents) => {
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
      setFirstArticleVisible(documents.docs[0]);
    }
    if (documents?.docs[documents.docs.length - 1]) {
      setLastArticleVisible(documents.docs[documents.docs.length - 1]);
    }
  };

  const handleArticleChange = (event, value) => {
    value > articlePage ? nextArticlePage() : previousArticlePage();
    setArticlePage(value);
  };

  useEffect(() => {
    const countresource = async () => {

      const q = query(collectionRef, where("type", "==", "document"));
      const snapshot = await getCountFromServer(q);

      const q_a = query(collectionRef, where("type", "==", "article"));
      const article_snapshot = await getCountFromServer(q_a);

      setCountArticle(article_snapshot.data().count);
      setCountResource(snapshot.data().count);
    };

    countresource();
  }, []);


  const handleSaveResource = async (resourceId) => {
    const resource = [...article, ...resources].find((item) => item.id === resourceId);
    // console.log("resource", resource)
    let savedItem = savedItems.find((item) => item.resourceId === resourceId);
    if (resource) {
      if (savedItem === undefined) {
        try {
          const docRef = await addDoc(savedResourcesRef, {
            userId: user.user_id,
            resourceId: resource.id,
            title: resource.title,
            type: resource.type,
            description: resource.description ? resource.description : "",
            url: resource.url,
            thumbnail: resource.thumbnail ? resource.thumbnail : "",
            timestamp: Date.now(),
          });
          onSnapshot(savedResourcesRef, (querySnapshot) => {
            const savedResources = [];
            querySnapshot.docs.forEach((doc) => {
              savedResources.push({
                id: doc.id,
                ...doc.data()
              })
            });
            setSavedItems(savedResources)
          });
          console.log('Document written with ID: ', docRef.id);
        } catch (e) {
          console.error('Error adding document: ', e);
        }
      } else {
        handleRemoveSavedResource(savedItem.id, savedItem.resourceId)
      }
    }
  }
  const handleRemoveSavedResource = async (savedResourceID, resourceId) => {
    try {
      const docRef = doc(savedResourcesRef, savedResourceID);
      console.log("docRef", docRef)
      await deleteDoc(docRef);
      console.log("savedItems", savedItems)
      setSavedItems(savedItems.filter((item) => item.resourceId !== resourceId))
      console.log('Document deleted successfully');
    } catch (e) {
      console.error('Error deleting document: ', e);
    }
  }

  const renderElement = (value) => {
    switch (value) {
      case 3: {
        return (
          <React.Fragment>
            <h3 className="header">Saved Resources</h3>
            <p className="text-[11px]">
              Curated list of all saved articles and resources
            </p>

            {fetchingSavedItems ?
              <h2 className="text-xl font-semibold">Loading...</h2>
              :
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {savedItems?.length > 0 ?
                  savedItems?.map(({ id, resourceId, title, discription, type, url, thumbnail }) => (
                    <div key={id} className="flex items-center flex-wrap mt-6">
                      <div
                        key={id}
                        className="bg-[#FFFFFF] flex flex-col h-full justify-between rounded-lg overflow-hidden max-w-[238px]"
                      >
                        {thumbnail ? (
                          <img
                            className="w-full h-[158px] object-center"
                            src={thumbnail}
                            alt="resource_image"
                          />
                        ) : <div></div>}
                        <div className="p-5 w-full">
                          <p className="uppercase text-[10px] font-semibold">
                            {type}
                          </p>
                          <h3 className="font-semibold text-[17px]">{title}</h3>
                          <p className="text-[12px] text-[#838383] mt-1 truncate">
                            {discription}
                          </p>
                          <div className="mt-4 space-x-1 flex items-center justify-between">
                            <button className="text-[13px] border font-medium rounded-lg w-[112px] h-[42px]">
                              {type === "article" ? "Read" : "Download"}
                            </button>
                            <button onClick={() => handleRemoveSavedResource(id, resourceId)} className="text-[13px] bg-[#F4F4F4] rounded-lg font-medium h-[42px] w-[72px]">
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) :
                  <div className="flex flex-col p-7 col-span-3 w-full items-center justify-center min-h-full">
                    <h3 className="text-[32px] font-bold text-[#B5B5C3]">
                      No Saved Items
                    </h3>
                  </div>
                }

              </div>
            }
          </React.Fragment>

        )
      }
      case 2: {
        return (
          <React.Fragment>
            <h3 className="header">Articles</h3>
            <p className="text-[11px]">
              Curated list of all available articles
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {article?.length > 0 &&
                article?.map(({ id, title, type, url }) => {
                  const isSaved = savedItems.find((item) => item.resourceId === id);
                  return (
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

                        <div className="mt-4 space-x-1 flex w-full items-center justify-between">
                          <a href={url}>
                            <button className="text-[13px] border font-medium rounded-lg w-[112px] h-[42px]">
                              Read
                            </button>
                          </a>
                          <button onClick={() => handleSaveResource(id)} className="text-[13px] bg-[#F4F4F4] rounded-lg font-medium h-[42px] w-[72px]">
                            {isSaved ? "Remove" : "Save"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              {countArticle > PAGE_SIZE && (
                <div className="mt-9 flex justify-between items-center">
                  <p className="text-[14px] font-medium text-[#5E6278]">
                    Showing {PAGE_SIZE * articlePage - PAGE_SIZE} to {PAGE_SIZE * articlePage}{" "}
                    of {countArticle} entries
                  </p>
                  <Pagination
                    variant="outlined"
                    shape="rounded"
                    style={{
                      marginTop: "20px",
                    }}
                    count={Math.ceil(countArticle / PAGE_SIZE)}
                    page={articlePage}
                    onChange={handleArticleChange}
                  />
                </div>
              )}
            </div>
          </React.Fragment>

        )
      }
      case 1:
      default: {
        return (
          <React.Fragment>
            <h3 className="header">Downloadable Resources</h3>
            <p className="text-[11px]">
              Curated list of all available resources
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {resources?.length > 0 &&
                resources.map(({ id, url, type, title, thumbnail, discription }) => {
                  const isSaved = savedItems.find((item) => item.resourceId === id);
                  return (
                    <div
                      key={id}
                      className="bg-[#FFFFFF] flex flex-col justify-between h-full rounded-lg overflow-hidden max-w-[238px]"
                    >
                      {thumbnail ? (
                        <img
                          className="w-[238px] h-[158px] object-center"
                          src={thumbnail}
                          alt="resource_image"
                        />
                      ) : <div></div>}
                      <div className="p-5 w-full">
                        <p className="uppercase text-[10px] font-semibold">
                          {type}
                        </p>
                        <h3 className="font-semibold text-[17px]">{title}</h3>
                        <p className="text-[12px] text-[#838383] mt-1 truncate">
                          {discription}
                        </p>
                        <div className="mt-4 space-x-1 flex items-center justify-between">
                          <a role={"button"} href={url} className="text-[13px] border flex items-center justify-center font-medium rounded-lg w-[112px] h-[42px]">
                            Download
                          </a>
                          <button onClick={() => handleSaveResource(id)} className="text-[13px] bg-[#F4F4F4] rounded-lg font-medium h-[42px] w-[72px]">
                            {isSaved ? "Remove" : "Save"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                }
                )}
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
          </React.Fragment>
        )
      }
    }
  }

  return (
    <div className="min-h-full max-w-[855px] p-7">
      <ResourceTab tab={tab} setTab={setTab} />
      <div className="mt-8 ">
        {loading ? (
          <h2 className="text-xl font-semibold">Loading...</h2>
        ) : (
          <React.Fragment>
            {renderElement(tab)}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default Resources;
