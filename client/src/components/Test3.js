import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import "../style/test3.css";

const Test3 = () => {
  console.log(123);

  const plusRef = useRef();
  const carRef = useRef();
  const [disX, setDisX] = useState(null);
  const [disY, setDisY] = useState(null);
  const [icon, setIcon] = useState(null);
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    if (icon) {
      const newDisX =
        parseInt(carRef.current.offsetLeft) -
        parseInt(plusRef.current.offsetLeft);
      setDisX(newDisX);
      const newDisY =
        parseInt(carRef.current.offsetTop) -
        parseInt(plusRef.current.offsetTop);
      setDisY(newDisY);

      const handleAnimationEnd = (e) => {
        if (plusRef.current) {
          plusRef.current.style.display = "none";
          plusRef.current.removeEventListener(
            "animationend",
            handleAnimationEnd
          );
        }
        setAnimation(false);
        setIcon(false);
      };

      if (plusRef.current && icon) {
        plusRef.current.addEventListener("animationend", handleAnimationEnd);
      }

      return () => {
        if (plusRef.current) {
          plusRef.current.removeEventListener(
            "animationend",
            handleAnimationEnd
          );
        }
      };
    }
  }, [icon]);

  const addHandle = (e) => {
    setIcon(true);
    e.target.style.display = "block";
  };

  const addHandleToCar = (e) => {
    console.log(disX, disY);
    if (icon) {
      setAnimation((pre) => {
        return true;
      });
    }
  };

  return (
    <div
      className="container"
      style={{ display: "flex", justifyContent: "center", marginTop: "40dvh" }}
    >
      {icon && (
        <div
          ref={plusRef}
          className={animation ? "plus animationXOn" : "plus"}
          style={{
            display: "true",
            "--left": "200px",
            "--top": "200px",
            "--disX": disX && `${disX}px`,
            "--disY": disY && `${disY}px`,
            width: "50px",
            height: "50px",
          }}
        >
          <FontAwesomeIcon
            className={animation ? "plusIcon animationYOn" : "plusIcon"}
            icon={faPlus}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}
      <div
        ref={carRef}
        className="car"
        style={{
          position: "fixed",
          width: "50px",
          height: "50px",
          bottom: "300px",
          right: "150px",
        }}
      >
        <FontAwesomeIcon
          icon={faCartShopping}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <button onClick={addHandle} style={{ width: "50px", height: "50px" }}>
        Add
      </button>
      <button
        onClick={addHandleToCar}
        style={{ width: "50px", height: "50px" }}
      >
        Add to cart
      </button>
    </div>
  );
};

export default Test3;
