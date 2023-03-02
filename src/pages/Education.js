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
  // where,
} from "firebase/firestore";
import { Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { db } from "../components/firebase";
import EducationTab from "../components/EducationTab";

const Education = () => {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countCourses, setCountcourses] = useState(null);
  const [tab, setTab] = useState(1);

  useEffect(() => {
    const q = query(
      collection(db, "courses"),
      orderBy("id", "desc"),
      limit(PAGE_SIZE)
    );

    const unsubscribe = async () => {
      setLoading(true);
      const documents = await getDocs(q);
      const courses = [];
      documents.forEach((document) => {
        courses.push({
          id: document.id,
          ...document.data(),
        });
      });
      setCourses(courses);
      setLastVisible(documents.docs[documents.docs.length - 1]);
      setFirstVisible(documents.docs[0]);
      setLoading(false);
    };
    return () => unsubscribe();
  }, []);

  const nextPage = async () => {
    setLoading(true);
    const tradeRef = collection(db, "courses");
    const q = query(
      tradeRef,
      orderBy("id", "desc"),
      startAfter(lastVisible.data().id), // Pass the reference
      limit(PAGE_SIZE)
    );
    const documents = await getDocs(q);
    updateState(documents);
    setLoading(false);
  };

  const previousPage = async () => {
    setLoading(true);
    const tradeRef = collection(db, "courses");
    const q = query(
      tradeRef,
      orderBy("id", "desc"),
      endAt(firstVisible.data().id), // Use `endAt()` method and pass the reference
      limitToLast(PAGE_SIZE)
    );
    const documents = await getDocs(q);
    updateState(documents);
    setLoading(false);
  };

  const updateState = (documents) => {
    if (!documents.empty) {
      const courses = [];
      documents.forEach((document) => {
        courses.push({
          id: document.id,
          ...document.data(),
        });
      });
      setCourses(courses);
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
    const countcourses = async () => {
      const collectionRef = collection(db, "courses");
      const snapshot = await getCountFromServer(collectionRef);
      setCountcourses(snapshot.data().count);
    };

    countcourses();
  }, [page]);

  const renderElement = (value) => {
    switch (value) {
      case 2: {
        return (
          <div className="flex flex-col items-center mt-8 justify-between ">
            <h2 className="header">Marketplace</h2>

            <h3 className="text-[32px] font-bold text-[#B5B5C3]">
              Coming Soon
            </h3>
          </div>
        )
      }
      case 3: {
        return (
          <div className="flex flex-col items-center mt-8 justify-between ">
            <h2 className="header">Purchased</h2>

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
              <div className="flex items-center mt-8 justify-between ">
                <h3 className="header">Featured Courses</h3>
                <div className="flex items-center space-x-2">
                  <img
                    className="cursor-pointer"
                    src="images/Dashboard_Scroll_LeftArrow.png"
                    alt="Dashboard_Scroll_LeftArrow"
                  />
                  <img
                    className="cursor-pointer"
                    src="images/Dashboard_Scroll_RightArrow.png"
                    alt="Dashboard_Scroll_RightArrow"
                  />
                </div>
              </div>
              <div className="grid overflow-x-auto mt-3  lg:grid-cols-2 xl:grid-cols-3 w-full gap-4">
                {loading ? (
                  <h2 className="text-xl font-semibold">Loading...</h2>
                ) : (
                  <>
                    {courses?.length > 0 &&
                      courses
                        ?.slice(0, 3)
                        ?.map(({ id, title, thumbnail, discription, lessons }) => (
                          <div
                            key={id}
                            className="rounded-lg w-full min-w-[239px] h-full flex flex-col overflow-hidden bg-[#421855]"
                          >
                            <img
                              className="h-[149px] w-full object-cover"
                              src={thumbnail}
                              alt="course_image"
                            />
                            <div className="p-5 h-full flex flex-col justify-between text-[#FFFFFF]">
                              <h3 className="text-[21px] font-medium ">{title}</h3>
                              <div className="">
                                <div className="flex items-center justify-between mt-3">
                                  <p>{lessons?.length} Lessons</p>
                                  <p>|</p>
                                  <p>40 hours</p>
                                </div>
                                <button className="bg-[#FFFFFF] mt-8 text-[#000] rounded-lg py-3 text-[16px] font-medium w-full text-center">
                                  View Lesson
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                  </>
                )}
              </div>

              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h2 className="header">Recommended Course</h2>
                  <p className="text-[16px] text-[#404040] font-medium cursor-pointer">
                    SEE ALL
                  </p>
                </div>

                {loading ? (
                  <h2 className="text-xl font-semibold">Loading...</h2>
                ) : (
                  <>
                    {courses?.length > 0 &&
                      courses?.map(
                        ({ id, title, thumbnail, discription, lessons }, index) => (
                          <div key={id} className="mt-6 w-full space-y-5">
                            <div
                              className={`${index === 0
                                ? "bg-[#6E67E7] text-[#FFFFFF]"
                                : "bg-[#FFFFFF]"
                                } p-5 w-[327px] h-[324px] lg:h-full lg:w-full flex flex-col lg:flex-row lg:items-center lg:justify-between rounded-md`}
                            >
                              <div className="flex  lg:items-center flex-col lg:flex-row lg:space-x-3">
                                <img
                                  className="rounded-md object-cover w-[284px] max-h-[63px] min-h-[150px] lg:w-[103px] lg:min-h-[63px]"
                                  src={thumbnail}
                                  alt="course_image"
                                />
                                <div className="mt-4 lg:mt-0">
                                  <p
                                    className={`${index === 0
                                      ? "text-[#FFFFFFBA]"
                                      : "text-[#22222287]"
                                      } text-[10px] tracking-widest font-medium `}
                                  >
                                    FOREIGN EXCHANGE
                                  </p>
                                  <h4 className="text-[17px] font-medium">{title}</h4>
                                </div>
                              </div>
                              <div className="flex mt-4 lg:mt-0 items-center space-x-6">
                                <div
                                  className={`${index === 0 ? "bg-[#FFFFFF26]" : " bg-[#B4B4B426]"
                                    } rounded-lg p-4 flex items-center space-x-6 text-[12px] font-medium`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <img
                                      className="w-[16px] h-[16px]"
                                      src={`images/${index === 0
                                        ? "Lessons_Icon_Selected.png"
                                        : "Lessons_Icon_Deselected.png"
                                        }`}
                                      alt="book_icon"
                                    />
                                    <p className="flex items-center space-x-1">
                                      <span>{lessons?.length}</span>
                                      <span>Lessons</span>
                                    </p>
                                  </div>
                                  {/* <p>|</p>
                                  <div className="flex items-center space-x-3">
                                    <img
                                      className="w-[16px] h-[16px]"
                                      src={`images/${index === 0
                                        ? "Lessons_Star_Icon_Selected.png"
                                        : "Lessons_Star_Icon_Black.png"
                                        }`}
                                      alt="star_icon"
                                    />
                                    <p>4.6</p>
                                  </div> */}
                                </div>
                                <img
                                  className="lg:block hidden cursor-pointer"
                                  src={`images/${index === 0 ? "Arrow_Slected.png" : "Arrow.png"
                                    }`}
                                  alt="Arrow_icon"
                                />
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    {countCourses > PAGE_SIZE && (
                      <div className="mt-9 flex justify-between items-center">
                        <p className="text-[14px] font-medium text-[#5E6278]">
                          Showing {PAGE_SIZE * page - PAGE_SIZE} to {PAGE_SIZE * page}{" "}
                          of {countCourses} entries
                        </p>
                        <Pagination
                          variant="outlined"
                          shape="rounded"
                          style={{
                            marginTop: "20px",
                          }}
                          count={Math.ceil(countCourses / PAGE_SIZE)}
                          page={page}
                          onChange={handleChange}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </React.Fragment>
          )
        }
    }
  }


  return (
    <div className="pb-14 p-7 container mx-auto">
      <EducationTab tab={tab} setTab={setTab} />
      <React.Fragment>
        {renderElement(tab)}
      </React.Fragment>
    </div>
  );
};

export default Education;
