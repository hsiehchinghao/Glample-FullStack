import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostService from "../services/PostService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const Homepage1 = () => {
  const navigate = useNavigate();
  const [postData, setPostData] = useState([]);
  console.log(123);

  //亂碼效果
  const scrambleRef = useRef(null);
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = "!<>-_\\/[]{}—=+*^?#___";
      this.update = this.update.bind(this);
    }
    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => (this.resolve = resolve));
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || "";
        const to = newText[i] || "";
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }
    update() {
      let output = "";
      let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `${char}`;
        } else {
          output += from;
        }
      }
      this.el.innerText = output;
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }
  //亂碼文字
  const phrases = ["WELCOME", "^_^", "TO Glample.", ":)"];

  //螢幕監聽滑動
  const popPostRef = useRef(null);
  const bannerSectionRef = useRef(null);

  useEffect(() => {
    //初始載入
    window.scrollTo(0, 0);

    //載入最新文章
    PostService.loadPostByLatest()
      .then((result) => {
        setPostData(result.data.result);
      })
      .catch((e) => {
        console.log(e);
      });

    //實際滾動動作
    // console.log(scrambleRef.current.offsetTop);
    const scrollIt = (e) => {
      if (window.pageYOffset >= bannerSectionRef.current.offsetHeight / 3) {
        window.scrollTo({
          top: scrambleRef.current.offsetTop,
          behavior: "smooth",
        });

        window.removeEventListener("scroll", scrollIt);
      }
    };

    //設定滑動邏輯
    const scrollOutBanner = (e) => {
      //回到頂部啟用滾動監聽
      if (window.pageYOffset < window.innerHeight / 5) {
        window.addEventListener("scroll", scrollIt);
      }
    };

    //滾動監聽
    window.addEventListener("scroll", scrollOutBanner);

    //亂數效果執行
    let counter = 0;
    const fx = scrambleRef.current && new TextScramble(scrambleRef.current);
    const next = () => {
      fx.setText(phrases[counter]).then(() => {
        setTimeout(next, 1500);
      });
      counter = (counter + 1) % phrases.length;
    };
    next();

    return () => {
      window.removeEventListener("scroll", scrollOutBanner);
      window.removeEventListener("scroll", scrollIt);
    };
  }, []);

  const handleClick = async (_id) => {
    navigate(`post/${_id}`);
  };

  return (
    <>
      <div className="homePage">
        <div className="homePageBannerSection" ref={bannerSectionRef}>
          <div className="bannerBar">
            {postData &&
              postData.map((data) => {
                return (
                  <div
                    key={data._id}
                    className="homePagePerBanner"
                    style={{
                      backgroundImage: `url(${data.image})`,
                    }}
                  >
                    <div
                      className="homePagePerBannerInfo"
                      style={{
                        backgroundImage: `url(${data.image})`,
                      }}
                    >
                      <div className="homePagePerBannerTitle">
                        <p
                          onClick={(e) => {
                            handleClick(data._id);
                          }}
                        >
                          {data.title}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="scrambleSection" ref={scrambleRef}></div>
        <div ref={popPostRef} className="homePagePopSection">
          <div className="homePagePopPost"></div>
          <div className="homePagePopPost"></div>
          <div className="homePagePopPost"></div>
          <div className="homePagePopPost"></div>
        </div>
      </div>
    </>
  );
};

export default Homepage1;
