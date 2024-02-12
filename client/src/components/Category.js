import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import PostService from "../services/PostService";
import likeIcon from "../svg/icons8-like-64 2.png";

const Category = ({ currentSub, setCurrentSub }) => {
  const API_URL = "http://localhost:8081";
  const [loadData, setLoadData] = useState(null);
  const { category } = useParams();
  const navigate = useNavigate();
  const [currentFilter, setCurrentFilter] = useState("By Popular");
  const [ifClickedLatest, setIfClickedLatest] = useState(false);
  const [ifClickedPop, setIfClickedPop] = useState(true);
  const [filteredPost, setFilteredPost] = useState(null);

  //根據類別更新的副作用
  useEffect(() => {
    window.scrollTo(0, 0);
    PostService.loadByCategoryAndSortByTopLatest(category)
      .then((result) => {
        console.log(result);
        setLoadData(result.data.result);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [currentSub]);

  // 隨著分類鈕改變，重新載入內容
  useEffect(() => {
    if (currentFilter == "By Popular") {
      PostService.loadByCategoryAndSortByTopPop(category)
        .then((result) => {
          console.log(result);
          setFilteredPost(result.data.result);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      PostService.loadByCategoryAndSortByTopLatest(category)
        .then((result) => {
          console.log(result);
          setFilteredPost(result.data.result);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [currentFilter, currentSub]);

  const handleCheckEachPost = (_id) => {
    navigate(`/post/${_id}`);
  };

  //點擊最熱門
  const handleFilterSwitchToPop = async (prop) => {
    setCurrentFilter(() => {
      return prop;
    });
    if (ifClickedPop) {
      return;
    } else {
      setIfClickedPop(true);
      setIfClickedLatest(false);
      let result = await PostService.loadByCategoryAndSortByTopPop(category);
    }
  };
  //點擊最新
  const handleFilterSwitchToLatest = async (prop) => {
    setCurrentFilter(() => {
      return prop;
    });
    if (ifClickedLatest) {
      return;
    } else {
      setIfClickedLatest(true);
      setIfClickedPop(false);
      let result = await PostService.loadByCategoryAndSortByTopLatest(category);
    }
  };

  return (
    <div className="categoryPage">
      <div className="categoryPageTitle">
        <p>{category}</p>
      </div>
      <div className="categoryPageContent">
        {loadData && loadData[0] && (
          <div className="firstPost">
            <div
              className="postCover"
              onClick={(e) => {
                handleCheckEachPost(loadData[0]._id);
              }}
              style={{ backgroundImage: `url(${API_URL}${loadData[0].image})` }}
            ></div>
            <div className="postInfo">
              <p
                onClick={(e) => {
                  handleCheckEachPost(loadData[0]._id);
                }}
              >
                {loadData[0].title}
              </p>
              <div className="categoryDiv">
                <div className="category">{loadData[0].category}</div>
              </div>

              <div className="infoContent">
                <div className="likes">
                  {loadData[0].likeCount} People
                  <div className="likeIcon">
                    <img src={likeIcon} alt="" />
                  </div>
                </div>
                <p
                  className="viewMore"
                  onClick={(e) => {
                    handleCheckEachPost(loadData[0]._id);
                  }}
                >
                  view..
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="decorationBanner">
          <div className="productBannerTitle">
            <p className="productBannerFirst">
              <p>Glample.</p>
              <p>グランプル.</p>
              <p>Glample.</p>
              <p>グランプル.</p>
              <p>Glample.</p>
              {/* <p>グランプル.</p> */}
            </p>
            <p className="productBannerSecond">
              {/* <p>Glample.</p> */}
              <p>グランプル.</p>
              <p>Glample.</p>
              <p>グランプル.</p>
              <p>Glample.</p>
              <p>グランプル.</p>
            </p>
          </div>
        </div>
        <div className="secondAndThirdPost">
          {loadData && loadData[1] && loadData[2] && (
            <>
              <div className="secondPost">
                <div
                  className="secondPostCover"
                  onClick={(e) => {
                    handleCheckEachPost(loadData[1]._id);
                  }}
                  style={{
                    backgroundImage: `url(${API_URL}${loadData[1].image})`,
                  }}
                ></div>
                <div className="secondPostInfo">
                  <div
                    className="postTitle"
                    onClick={(e) => {
                      handleCheckEachPost(loadData[1]._id);
                    }}
                  >
                    {loadData[1].title}
                  </div>
                  <div className="postCategoryDiv">
                    <div className="postCategory">{loadData[1].category}</div>
                  </div>
                  <div className="postOther">
                    <div className="likes">
                      <div className="likeIcon">
                        <img src={likeIcon} alt="" />
                      </div>
                      {loadData[1].likeCount}
                    </div>

                    <div
                      className="postView"
                      onClick={() => {
                        handleCheckEachPost(loadData[1]._id);
                      }}
                    >
                      view..
                    </div>
                  </div>
                </div>
              </div>
              <div className="secondPost reversePost">
                <div
                  className="secondPostCover"
                  style={{
                    backgroundImage: `url(${API_URL}${loadData[2].image})`,
                  }}
                  onClick={() => {
                    handleCheckEachPost(loadData[2]._id);
                  }}
                ></div>
                <div className="secondPostInfo">
                  <div
                    className="postTitle"
                    onClick={(e) => {
                      handleCheckEachPost(loadData[2]._id);
                    }}
                  >
                    {loadData[2].title}
                  </div>
                  <div className="postCategoryDiv">
                    <div className="postCategory">{loadData[2].category}</div>
                  </div>
                  <div className="postOther">
                    <div className="likes">
                      <div className="likeIcon">
                        <img src={likeIcon} alt="" />
                      </div>
                      {loadData[2].likeCount}
                    </div>

                    <div
                      className="postView"
                      onClick={() => {
                        handleCheckEachPost(loadData[2]._id);
                      }}
                    >
                      view..
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="fourthPost">
          {loadData && loadData[3] && (
            <>
              <div
                className="postCover"
                onClick={() => {
                  handleCheckEachPost(loadData[3]._id);
                }}
                style={{
                  backgroundImage: `url(${API_URL}${loadData[3].image})`,
                }}
              ></div>
              <div className="postContent">
                <p
                  onClick={(e) => {
                    handleCheckEachPost(loadData[3]._id);
                  }}
                >
                  {loadData[3].title}
                </p>
                <div className="categoryDiv">
                  <div className="category">{loadData[3].category}</div>
                </div>

                <div className="infoContent">
                  <div className="likes">
                    {loadData[3].likeCount} People
                    <div className="likeIcon">
                      <img src={likeIcon} alt="" />
                    </div>
                  </div>
                  <p
                    className="viewMore"
                    onClick={(e) => {
                      handleCheckEachPost(loadData[3]._id);
                    }}
                  >
                    view..
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="decorationBanner">
          <div className="productBannerTitle">
            <p className="productBannerFirst">
              <p>Glample.</p>
              <p>グランプル.</p>
              <p>Glample.</p>
              <p>グランプル.</p>
              <p>Glample.</p>
              {/* <p>グランプル.</p> */}
            </p>
            <p className="productBannerSecond">
              {/* <p>Glample.</p> */}
              <p>グランプル.</p>
              <p>Glample.</p>
              <p>グランプル.</p>
              <p>Glample.</p>
              <p>グランプル.</p>
            </p>
          </div>
        </div>
        <div className="eachPostContent">
          <div className="filterSection">
            <p className="currentFilter">Current: Load {currentFilter}</p>
            <div className="filterSelection">
              <button
                disabled={ifClickedLatest ? true : false}
                onClick={(e) => {
                  handleFilterSwitchToLatest(e.target.innerText);
                }}
              >
                By Latest
              </button>
              <button
                disabled={ifClickedPop ? true : false}
                onClick={(e) => {
                  handleFilterSwitchToPop(e.target.innerText);
                }}
              >
                By Popular
              </button>
            </div>
          </div>
          {filteredPost && (
            <div className="postCards">
              {filteredPost.map((data) => {
                return (
                  <div className="postCard">
                    <div className="postCardInfo">
                      <div className="postCardCategory">
                        <p>{data.category}</p>
                      </div>
                      <div
                        className="postCardTitle"
                        onClick={(e) => {
                          handleCheckEachPost(data._id);
                        }}
                      >
                        {data.title}
                      </div>
                      <div className="postCardDate">
                        {data.date.slice(0, 10)}
                      </div>
                      <div className="postCardLike"></div>
                    </div>
                    <div className="postCardCover">
                      <img
                        src={API_URL + data.image}
                        alt=""
                        onClick={(e) => {
                          handleCheckEachPost(data._id);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
