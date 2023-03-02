import React from "react";
import Moment from "react-moment";

const TradeBox = ({ tradeIdeas, expand, setExpand }) => {
  const imagePair = (path) => {
    const pair = Array.from(path);
    pair.splice(-7, 0, "-");
    return pair.join("");
  };
  return (
    <div className="mt-4 ">
      {tradeIdeas?.length > 0 &&
        tradeIdeas.map(
          ({
            id,
            type,
            entry,
            timestamp,
            pair,
            status,
            style,
            stop_loss,
            take_profits,
          }) => (
            <div
              key={id}
              id={id}
              className={`${expand === id
                  ? "bg-[#6469EE] border-b-2 text-[#FFFFFF]"
                  : "bg-[#FFFFFF]"
                } p-6 mb-3 rounded-lg`}
            >
              <div
                className={`${expand === id && "border-b border-[#ebe4e4]"
                  }  h-[100px] flex items-center justify-between  `}
              >
                <div className="flex items-center space-x-5">
                  <img
                    className="w-[85px] h-[41px] object-cover"
                    src={imagePair(`images/Forex Pairs/${pair}.png`)}
                    alt="flag"
                  />
                  <div>
                    <p className="text-[10px] tracking-widest text-[#FFFFFF] font-bold">
                      <Moment local>{timestamp}</Moment>
                    </p>
                    <p className="text-[17px] font-bold">
                      {pair}{" "}
                      <span
                        className={`${type === "Buy" ? "text-[#FF0000]" : "text-[#4BC5D7]"
                          } uppercase `}
                      >
                        {type}
                      </span>{" "}
                      @ {entry}
                    </p>
                  </div>
                </div>
                <div className="items-center space-x-6 hidden md:inline-flex">
                  {expand === id ? (
                    <>
                      <button
                        onClick={() => setExpand(null)}
                        className="bg-[#FFFFFF26] rounded-md text-[12px] font-semibold w-[132px] h-[51px] text-center"
                      >
                        Show less
                      </button>
                      <img
                        className="w-[16px]"
                        src="images/selected_arrow_up.png"
                        alt="arrow_icon"
                      />
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setExpand(id)}
                        className="bg-[#FFFFFF26] rounded-md text-[12px] font-semibold w-[132px] h-[51px] text-center"
                      >
                        Click to expand{" "}
                      </button>
                      <img
                        className="w-[16px]"
                        src="images/Arrow.png"
                        alt="arrow_icon"
                      />
                    </>
                  )}
                </div>
              </div>
              {expand === id && (
                <>
                  <div className="p-5 w-full ">
                    <div className="grid md:grid-cols-5 md:pl-[5.4rem] w-full md:items-center">
                      <div className="">
                        <p className="text-[13px] ">Status</p>
                        <h3 className="text-[15px] font-bold capitalize">
                          {status}
                        </h3>
                        <p className="mt-5 text-[13px]">Trade Type</p>
                        <p className="text-[15px] font-bold">{type}</p>
                      </div>
                      <hr className="rotate-90 hidden md:block origin-center self-center max-w-[50px]" />
                      <div className="mt-5 md:mt-0">
                        <p className="text-[13px] ">Provider</p>
                        <h3 className="text-[15px] font-bold">god_tradez</h3>
                        <p className="mt-5 text-[13px]">Trade Style</p>
                        <p className="text-[15px] font-bold">{style}</p>
                      </div>
                      <hr className="rotate-90 hidden md:block origin-center self-center max-w-[50px]" />
                      <div className="mt-5 md:mt-0">
                        <p className="text-[13px] ">Entry</p>
                        <h3 className="text-[15px] font-bold">{entry}</h3>
                        <p className="mt-5 text-[13px]">Stop Loss</p>
                        <p className="text-[15px] font-bold">
                          {stop_loss[0]?.value}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className=" md:pl-[6.6rem] p-5 w-full">
                    {take_profits.map(({ id, value, order }) => (
                      <div
                        key={id}
                        className="flex items-center space-x-3 mb-3"
                      >
                        <div className="p-3 rounded-md w-full md:w-[404px] flex justify-center flex-col h-[51px] bg-[#F4F4F438]">
                          <p className="text-[13px]">Take Profit {order}</p>
                          <p className="text-[15px]">{value}</p>
                        </div>
                        <button
                          onClick={() => navigator.clipboard.writeText(value)}
                          className="bg-[#FFFFFF] hidden md:block rounded-md text-[12px] font-semibold w-[145px] h-[51px] text-[#262626]"
                        >
                          Copy to clipboard
                        </button>
                        <button
                          onClick={() => navigator.clipboard.writeText(value)}
                          className="bg-[#FFFFFF] rounded-md text-[12px] font-semibold md:hidden block w-[63.62px] h-[51px] text-[#262626]"
                        >
                          Copy
                        </button>
                      </div>
                    ))}

                    <div className="mt-10 md:mt-6">
                      <p className="text-[12px] mb-3 font-bold">
                        Trade Disclaimer
                      </p>
                      <p className="text-[12px] max-w-[515px]">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )
        )}
    </div>
  );
};

export default TradeBox;
