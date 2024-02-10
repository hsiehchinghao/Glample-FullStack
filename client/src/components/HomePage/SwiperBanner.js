import React, { useEffect, useState, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import PostService from "../../services/PostService";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Mousewheel,
  Keyboard,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const SwiperBanner = forwardRef((props, bannerSectionRef) => {
  const API_URL = "http://localhost:8081";
  const navigate = useNavigate();
  const [postData, setPostData] = useState([]);
  //   const bannerSectionRef = useRef(null);

  useEffect(() => {
    //載入最新文章
    PostService.loadPostByLatest()
      .then((result) => {
        // console.log(result.data.result);
        setPostData(result.data.result);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleClick = async (_id) => {
    navigate(`post/${_id}`);
  };

  return (
    <Swiper
      ref={bannerSectionRef}
      navigation={true}
      pagination={true}
      mousewheel={{ forceToAxis: true }}
      keyboard={true}
      speed={800}
      slidesPerGroup={1}
      loop={true}
      autoplay={true}
      effect={"coverflow"}
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={"auto"}
      coverflowEffect={{
        rotate: 30,
        stretch: 30,
        depth: 120,
        modifier: 2,
        slideShadows: true,
      }}
      modules={[
        Navigation,
        Pagination,
        Mousewheel,
        Keyboard,
        Autoplay,
        EffectCoverflow,
      ]}
      className="bannerSwiperSection bannerActive"
    >
      {postData &&
        postData.map((data) => {
          // console.log(data.title);
          return (
            <SwiperSlide
              key={data._id}
              className="homePagePerBanner"
              data-swiper-autoplay="2000"
            >
              <div
                className="homePagePerBannerInfo"
                style={{
                  backgroundImage: `url(${API_URL}${data.image})`,
                }}
                onClick={(e) => {
                  handleClick(data._id);
                }}
              >
                <div
                  className="homePagePerBannerTitle"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <p
                    onClick={(e) => {
                      handleClick(data._id);
                    }}
                  >
                    {data.title}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
});

export default SwiperBanner;
