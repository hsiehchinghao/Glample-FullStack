import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import PostService from "../services/PostService";
import likeIcon from "../svg/icons8-like-64 2.png";

const Category = ({ currentSub, setCurrentSub }) => {
  const API_URL = "http://localhost:8081";
  const [loadData, setLoadData] = useState(null);
  const { category } = useParams();
  const navigate = useNavigate();

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

  const handleCheckEachPost = (_id) => {
    navigate(`/post/${_id}`);
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
              style={{ backgroundImage: `url(${API_URL}${loadData[0].image})` }}
            ></div>
            <div className="postInfo">
              <p>{loadData[0].title}</p>
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
              <p>グランプル.</p>
            </p>
            <p className="productBannerSecond">
              <p>Glample.</p>
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
                  style={{
                    backgroundImage: `url(${API_URL}${loadData[1].image})`,
                  }}
                ></div>
                <div className="secondPostInfo">
                  <div className="postTitle">{loadData[1].title}</div>
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
                ></div>
                <div className="secondPostInfo">
                  <div className="postTitle">{loadData[2].title}</div>
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
                style={{
                  backgroundImage: `url(${API_URL}${loadData[3].image})`,
                }}
              ></div>
              <div className="postContent">
                <p>{loadData[3].title}</p>
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
              <p>グランプル.</p>
            </p>
            <p className="productBannerSecond">
              <p>Glample.</p>
              <p>グランプル.</p>
              <p>Glample.</p>
              <p>グランプル.</p>
              <p>Glample.</p>
              <p>グランプル.</p>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
