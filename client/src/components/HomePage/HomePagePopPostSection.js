import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostService from "../../services/PostService";

const HomePagePopPostSection = () => {
  const navigate = useNavigate();
  const [popTitle, setPopTitle] = useState(0);
  const [popPostData, setPopPostData] = useState(null);
  const popTitleRef = useRef(null);

  useEffect(() => {
    //載入最熱門文章
    PostService.loadPostByTopLikes()
      .then((result) => {
        console.log(result.data.result);
        setPopPostData(result.data.result);
      })
      .catch((e) => {
        console.log(e);
      });
    //大人氣寬度取得
    if (popTitleRef.current) {
      console.log(popTitleRef.current.offsetWidth);
      setPopTitle(popTitleRef.current.offsetWidth);
      window.addEventListener("resize", (e) => {
        setPopTitle(e.target.innerWidth);
      });
    }
  }, []);

  const handleClick = async (_id) => {
    navigate(`post/${_id}`);
  };

  return (
    <div className="homePagePopSection">
      <div className="homePagePopTitle ">
        <p
          className="first"
          ref={popTitleRef}
          style={{
            "--pWidth": `${popTitle}px`,
            "--pWidthLetter": `${popTitle / 40}px`,
          }}
        >
          MOST POPULAR!
        </p>
        <p
          className="second"
          style={{
            "--pWidth": `${popTitle}px`,
            "--pWidthLetter": `${popTitle / 40}px`,
          }}
        >
          大人気!
        </p>
      </div>
      <div className="homePagePopPosts">
        <div className="homePagePopPost1">
          {popPostData && (
            <>
              <div className="popPostCoverCategory">
                {popPostData[0].category}
              </div>
              <div
                className="popPostCoverImg1"
                style={{
                  backgroundImage: `url(${popPostData[0].image})`,
                }}
              ></div>

              <div
                className="popPostCoverTitle"
                onClick={(e) => {
                  handleClick(popPostData[0]._id);
                }}
              >
                {popPostData[0].title}
              </div>
              <div className="popPostCoverAuthor">
                {popPostData[0].authorname}
              </div>
            </>
          )}
        </div>
        <div className="homePagePopPost2">
          {popPostData && (
            <>
              <div className="popPostCoverCategory">
                {popPostData[1].category}
              </div>
              <div
                className="popPostCoverImg1"
                style={{
                  backgroundImage: `url(${popPostData[1].image})`,
                }}
              ></div>

              <div
                className="popPostCoverTitle"
                onClick={(e) => {
                  handleClick(popPostData[1]._id);
                }}
              >
                {popPostData[1].title}
              </div>
              <div className="popPostCoverAuthor">
                {popPostData[1].authorname}
              </div>
            </>
          )}
        </div>
        <div className="homePagePopPost3">
          {popPostData && (
            <>
              <div className="popPostCoverCategory">
                {popPostData[2].category}
              </div>
              <div
                className="popPostCoverImg1"
                style={{
                  backgroundImage: `url(${popPostData[2].image})`,
                }}
              ></div>

              <div
                className="popPostCoverTitle"
                onClick={(e) => {
                  handleClick(popPostData[2]._id);
                }}
              >
                {popPostData[2].title}
              </div>
              <div className="popPostCoverAuthor">
                {popPostData[2].authorname}
              </div>
            </>
          )}
        </div>
        <div className="homePagePopPost4">
          {popPostData && (
            <>
              <div className="popPostCoverCategory">
                {popPostData[3].category}
              </div>
              <div
                className="popPostCoverImg1"
                style={{
                  backgroundImage: `url(${popPostData[3].image})`,
                }}
              ></div>

              <div
                className="popPostCoverTitle"
                onClick={(e) => {
                  handleClick(popPostData[3]._id);
                }}
              >
                {popPostData[3].title}
              </div>
              <div className="popPostCoverAuthor">
                {popPostData[3].authorname}
              </div>
            </>
          )}
        </div>
        <div className="homePagePopPost5">
          {popPostData && (
            <>
              <div className="popPostCoverCategory">
                {popPostData[4].category}
              </div>
              <div
                className="popPostCoverImg1"
                style={{
                  backgroundImage: `url(${popPostData[4].image})`,
                }}
              ></div>

              <div
                className="popPostCoverTitle"
                onClick={(e) => {
                  handleClick(popPostData[4]._id);
                }}
              >
                {popPostData[4].title}
              </div>
              <div className="popPostCoverAuthor">
                {popPostData[4].authorname}
              </div>
            </>
          )}
        </div>
        <div className="homePagePopPost6">
          {popPostData && (
            <>
              <div className="popPostCoverCategory">
                {popPostData[5].category}
              </div>
              <div
                className="popPostCoverImg1"
                style={{
                  backgroundImage: `url(${popPostData[5].image})`,
                }}
              ></div>

              <div
                className="popPostCoverTitle"
                onClick={(e) => {
                  handleClick(popPostData[5]._id);
                }}
              >
                {popPostData[5].title}
              </div>
              <div className="popPostCoverAuthor">
                {popPostData[5].authorname}
              </div>
            </>
          )}
        </div>
        <div className="homePagePopPost7">
          {popPostData && (
            <>
              <div className="popPostCoverCategory">
                {popPostData[6].category}
              </div>
              <div
                className="popPostCoverImg1"
                style={{
                  backgroundImage: `url(${popPostData[6].image})`,
                }}
              ></div>

              <div
                className="popPostCoverTitle"
                onClick={(e) => {
                  handleClick(popPostData[6]._id);
                }}
              >
                {popPostData[6].title}
              </div>
              <div className="popPostCoverAuthor">
                {popPostData[6].authorname}
              </div>
            </>
          )}
        </div>
        <div className="homePagePopPost8">
          {popPostData && (
            <>
              <div className="popPostCoverCategory">
                {popPostData[7].category}
              </div>
              <div
                className="popPostCoverImg1"
                style={{
                  backgroundImage: `url(${popPostData[7].image})`,
                }}
              ></div>

              <div
                className="popPostCoverTitle"
                onClick={(e) => {
                  handleClick(popPostData[7]._id);
                }}
              >
                {popPostData[7].title}
              </div>
              <div className="popPostCoverAuthor">
                {popPostData[7].authorname}
              </div>
            </>
          )}
        </div>
        <div className="loadAll">
          <p>View All</p>
        </div>
      </div>
    </div>
  );
};

export default HomePagePopPostSection;
