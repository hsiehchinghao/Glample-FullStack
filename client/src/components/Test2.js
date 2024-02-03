import React, { useEffect, useRef } from "react";
import * as PIXI from "https://cdn.skypack.dev/pixi.js@5.x";
import { KawaseBlurFilter } from "https://cdn.skypack.dev/@pixi/filter-kawase-blur@3.2.0";
import { createNoise2D } from "simplex-noise";
import hsl from "https://cdn.skypack.dev/hsl-to-hex";
import debounce from "https://cdn.skypack.dev/debounce";

// 將所有先前定義的函數和類（比如 random, map, ColorPalette, Orb）放在這裡或導入它們

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function map(n, start1, end1, start2, end2) {
  return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}

// Create a new simplex noise instance
const simplex = new createNoise2D();

// ColorPalette class
class ColorPalette {
  constructor() {
    this.setColors();
    this.setCustomProperties();
  }

  setColors() {
    this.complimentaryHue1 = this.hue + 10; //在基本色調的基礎上增加30°，得到第一個補充色調。
    this.complimentaryHue2 = this.hue + 30; //定義兩個補充色調，分別比基本色調高30度和60度。

    this.complimentaryColor1 = hsl(this.complimentaryHue1);
    // define a second complimentary color, 60 degrees away from the base
    this.complimentaryColor2 = hsl(this.complimentaryHue2);

    // store the color choices in an array so that a random one can be picked later
    this.colorChoices = [
      this.baseColor,
      this.complimentaryColor1,
      this.complimentaryColor2,
    ];
  }

  setCustomProperties() {
    // set CSS custom properties so that the colors defined here can be used throughout the UI
    document.documentElement.style.setProperty("--hue", this.hue);
    document.documentElement.style.setProperty(
      "--hue-complimentary1",
      this.complimentaryHue1
    );
    document.documentElement.style.setProperty(
      "--hue-complimentary2",
      this.complimentaryHue2
    );
  }
}

// Orb class
class Orb {
  constructor(fill = 0x000000) {
    this.bounds = this.setBounds();
    this.x = random(this.bounds["x"].min, this.bounds["x"].max); //初始化 Orb 的位置：
    this.y = random(this.bounds["y"].min, this.bounds["y"].max);

    // how large the orb is vs it's original radius (this will modulate over time)
    this.scale = 1.2;

    // what color is the orb?
    this.fill = fill;

    // the original radius of the orb, set relative to window height
    this.radius = random(window.innerHeight / 6, window.innerHeight / 3); //random 函數在一個範圍內隨機選擇 Orb 的半徑大小

    // starting points in "time" for the noise/self similar random values
    this.xOff = random(0, 1000);
    this.yOff = random(0, 1000); //x 和 y 軸上的噪聲函數設置隨機起始點
    // how quickly the noise/self similar random values step through time
    this.inc = 0.001;

    // PIXI.Graphics is used to draw 2d primitives (in this case a circle) to the canvas
    this.graphics = new PIXI.Graphics();
    this.graphics.alpha = 0.825;

    //console.log(this.graphics);

    // 250ms after the last window resize event, recalculate orb positions.
    window.addEventListener(
      "resize",
      debounce(() => {
        this.bounds = this.setBounds();
      }, 250)
    );
  }

  setBounds() {
    // how far from the { x, y } origin can each orb move
    const maxDist =
      window.innerWidth < 1000 ? window.innerWidth / 3 : window.innerWidth / 5;
    // the { x, y } origin for each orb (the bottom right of the screen)
    const originX = window.innerWidth / 2; //const originX = window.innerWidth / 1.25;：這行代碼設置 Orb 的 x 軸原點為窗口寬度的 1.25 分之一，大致位於窗口右側。
    const originY =
      window.innerWidth < 1000 ? window.innerHeight : window.innerHeight / 2; // window.innerHeight / 1.375;這行代碼根據窗口寬度設置 y 軸原點。如果窗口寬度小於1000像素，y 軸原點為窗口的底部；否則，為窗口高度的 1.375 分之一，大致位於窗口下方的中部。

    // allow each orb to move x distance away from it's x / y origin
    return {
      x: {
        min: originX - maxDist,
        max: originX + maxDist,
      },
      y: {
        min: originY - maxDist,
        max: originY + maxDist,
      },
      //這行代碼返回一個包含 x 和 y 坐標範圍的對象。對於每個坐標軸，它設置了最小值（origin - maxDist）和最大值（origin + maxDist），確定了 Orb 對象可以移動的區域。
    };
  }

  update() {
    // self similar "psuedo-random" or noise values at a given point in "time"
    const xNoise = simplex(this.xOff, this.xOff);
    const yNoise = simplex(this.yOff, this.yOff);
    const scaleNoise = simplex(this.xOff, this.yOff);

    // map the xNoise/yNoise values (between -1 and 1) to a point within the orb's bounds
    this.x = map(xNoise, -1, 1, this.bounds["x"].min, this.bounds["x"].max);
    this.y = map(yNoise, -1, 1, this.bounds["y"].min, this.bounds["y"].max);
    // map scaleNoise (between -1 and 1) to a scale value somewhere between half of the orb's original size, and 100% of it's original size
    this.scale = map(scaleNoise, -1, 1, 0.5, 1);

    // step through "time"
    this.xOff += this.inc;
    this.yOff += this.inc;
  }

  render() {
    // update the PIXI.Graphics position and scale values
    this.graphics.x = this.x;
    this.graphics.y = this.y;
    this.graphics.scale.set(this.scale);
    console.log(123);
    // clear anything currently drawn to graphics
    this.graphics.clear();

    // tell graphics to fill any shapes drawn after this with the orb's fill color
    this.graphics.beginFill(this.fill);
    // draw a circle at { 0, 0 } with it's size set by this.radius
    this.graphics.drawCircle(0, 0, this.radius);
    // let graphics know we won't be filling in any more shapes
    this.graphics.endFill();

    console.log(this.graphics);
  }
}

const Test2 = () => {
  const canvasRef = useRef(null);
  const orbsRef = useRef([]);

  useEffect(() => {
    //console.log(canvasRef.current);
    const app = new PIXI.Application({
      view: canvasRef.current,
      resizeTo: window,
      transparent: true,
    });

    app.stage.filters = [new KawaseBlurFilter(30, 10, true)];

    //const colorPalette = new ColorPalette();
    const predefinedColors = [0xffe9e9, 0xffb6b5, 0xffe9e9];
    const orbs = [];

    for (let i = 0; i < 10; i++) {
      const color = predefinedColors[i % predefinedColors.length];
      const orb = new Orb(color);
      app.stage.addChild(orb.graphics);
      orbsRef.current.push(orb);
    }
    //app.ticker.add(animate);

    // app.ticker.add(() => {
    //     orbs.forEach((orb) => {
    //         orb.update();
    //         orb.render();
    //         console.log(orb);
    //     });
    // });

    const animate = () => {
      orbsRef.current.forEach((orb) => {
        console.log(orb);
        orb.update();
        orb.render();
      });
    };

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      app.ticker.add(animate);
    } else {
      animate();
    }

    return () => {
      app.ticker.remove(animate);
      app.destroy(true, { children: true });
    };
  }, []);

  return <canvas ref={canvasRef} className="orb-canvas" />;
};

export default Test2;
