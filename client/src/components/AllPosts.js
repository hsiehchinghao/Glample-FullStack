import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostService from "../services/PostService";

const AllPosts = ({ searchContent }) => {
  const API_URL = "https://glample-mern-9b575194526d.herokuapp.com/";
  const navigate = useNavigate();
  const { search } = useParams();
  const [searchResult, setSearchResult] = useState(null);
  const [loadAll, setLoadAll] = useState(null);
  const [currentFilter, setCurrentFilter] = useState("By Popular");
  const [ifClickedLatest, setIfClickedLatest] = useState(false);
  const [ifClickedPop, setIfClickedPop] = useState(true);
  const [filteredPost, setFilteredPost] = useState(null);

  //載入所有文章資訊
  //   useEffect(() => {
  //     window.scrollTo(0, 0);
  //     if (currentFilter == "By Popular") {
  //       PostService.loadPostByTopLikes()
  //         .then((result) => {
  //           console.log(result);
  //           setFilteredPost(result.data.result);
  //         })
  //         .catch((e) => {
  //           console.log(e);
  //         });
  //     } else {
  //       PostService.loadPostByLatest()
  //         .then((result) => {
  //           console.log(result);
  //           setFilteredPost(result.data.result);
  //         })
  //         .catch((e) => {
  //           console.log(e);
  //         });
  //     }
  //   }, [currentFilter]);

  //根據搜尋結果執行
  useEffect(() => {
    if (searchContent) {
      PostService.searching(search)
        .then((result) => {
          console.log(result);
          setSearchResult(() => {
            return result.data;
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [searchContent]);

  //ALl posts 處理區塊
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
      let result = await PostService.loadPostByTopLikes();
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
      let result = await PostService.loadPostByLatest();
    }
  };

  // 隨著分類鈕改變，重新載入內容
  useEffect(() => {
    window.scrollTo(0, 0);
    if (currentFilter == "By Popular") {
      PostService.loadPostByTopLikes()
        .then((result) => {
          console.log(result);
          setFilteredPost(result.data.result);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      PostService.loadPostByLatest()
        .then((result) => {
          console.log(result);
          setFilteredPost(result.data.result);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [currentFilter]);

  //載入文章
  const goCheckEachPost = (_id) => {
    navigate(`/post/${_id}`);
  };
  //載入商品
  const goCheckEachProduct = (_id) => {
    navigate(`/loadProduct/${_id}`);
  };

  return (
    <div className="allPostsPage">
      {/* 搜尋裝飾 */}
      {searchContent && (
        <div className="searchSection">
          <div className="searchTitle">SEARCHING:</div>
          <div className="searchingDecoration">
            <div className="first">
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
            </div>
            <div className="second">
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
              <p>#{searchContent}</p>
            </div>
          </div>
        </div>
      )}
      {/* 搜尋結果區塊 */}
      {searchResult && searchResult.msg && searchResult.msg != "noResult" && (
        <div className="searchResultSection">
          {searchResult.findResultByTitle && (
            <div className="resultByTitle">
              {
                <div className="resultPosts">
                  {searchResult.findResultByTitle.map((i) => {
                    return (
                      <div className="perPost">
                        <div className="coverSection">
                          <div
                            className="perCover"
                            style={{
                              backgroundImage: `url(${API_URL}${i.image})`,
                            }}
                            onClick={() => {
                              goCheckEachPost(i._id);
                            }}
                          ></div>
                        </div>
                        <div className="perInfo">
                          <div className="perCategory">
                            <p>{i.category}</p>
                          </div>
                          <div
                            className="perTitle"
                            onClick={() => {
                              goCheckEachPost(i._id);
                            }}
                          >
                            {i.title}
                          </div>
                          <div className="eachInfo">
                            <div className="perDate">{i.date.slice(0, 10)}</div>
                            <div className="perAuthor">{i.authorname}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              }
            </div>
          )}
          {searchResult.findProductResultByTitle && (
            <div className="resultByProduct">
              {
                <div className="resultPosts">
                  {searchResult.findProductResultByTitle.map((i) => {
                    return (
                      <div
                        className="perPost"
                        style={{
                          backgroundColor: "#ccc",
                          border: "8px solid #000",
                        }}
                      >
                        <div className="coverSection">
                          <div
                            className="perCover"
                            onClick={() => {
                              goCheckEachProduct(i._id);
                            }}
                            style={{
                              backgroundImage: `url(${API_URL}${i.image})`,
                            }}
                          ></div>
                        </div>
                        <div className="perInfo">
                          <div
                            className="perTitle"
                            onClick={() => {
                              goCheckEachProduct(i._id);
                            }}
                            style={{ color: "#000" }}
                          >
                            {i.title}
                          </div>
                          <div className="perPrice" style={{ color: "#000" }}>
                            ${i.price}NTD
                          </div>
                          <div className="eachInfo">
                            <div className="perDate" style={{ color: "#000" }}>
                              {i.date.slice(0, 10)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              }
            </div>
          )}
        </div>
      )}
      {/* 無搜尋結果 */}
      {searchResult && searchResult.msg && searchResult.msg == "noResult" && (
        <div className="noResultSection">No search results found</div>
      )}
      {/* 總文章總覽(不分類) */}
      <div className="allPosts">
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
                    <div className="postCardDate">{data.date.slice(0, 10)}</div>
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

      {/* 錯誤頁面 */}
      {!filteredPost && (
        <div className="errorPage">THERE'S SOMETHING WRONG</div>
      )}
    </div>
  );
};

export default AllPosts;
