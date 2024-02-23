import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostService from "../services/PostService";
import SwiperBanner from "./HomePage/SwiperBanner";
import HomePagePopPostSection from "./HomePage/HomePagePopPostSection";
import GlampleBanner from "./HomePage/GlampleBanner";
import TextScramble from "../services/TextScramble";
import ProductBanner from "./HomePage/ProductBanner";

const Homepage = () => {
  // console.log(123);
  const bannerSectionRef = useRef(null);
  //亂碼效果
  const scrambleRef = useRef(null);

  //亂碼文字
  const phrases = ["WELCOME!", "Glample.", ":)"];

  useEffect(() => {
    //初始載入
    window.scrollTo(0, 0);

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
        setTimeout(next, 1000);
      });
      counter = (counter + 1) % phrases.length;
    };
    next();

    return () => {
      window.removeEventListener("scroll", scrollOutBanner);
      window.removeEventListener("scroll", scrollIt);
    };
  }, []);

  return (
    <>
      <div className="homePage">
        <SwiperBanner ref={bannerSectionRef} />
        <div className="scrambleSection" ref={scrambleRef}></div>
        <HomePagePopPostSection />
        <ProductBanner />
        <GlampleBanner />
      </div>
    </>
  );
};

export default Homepage;
