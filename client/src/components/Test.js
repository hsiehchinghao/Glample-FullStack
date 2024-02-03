import React, { useEffect, useState, useRef } from "react";
import * as PIXI from "pixi.js";
import { KawaseBlurFilter } from "@pixi/filter-kawase-blur";
import { createNoise2D } from "simplex-noise";
// import SimplexNoise from "https://cdn.skypack.dev/simplex-noise";
import hsl from "hsl-to-hex";
import debounce from "debounce";

const Test = () => {
  const canvasRef = useRef();

  useEffect(() => {}, []);

  // Create PixiJS app
  const app = new PIXI.Application({
    // render to <canvas class="orb-canvas"></canvas>
    view: canvasRef.current,
    // auto adjust size to fit the current window
    resizeTo: window,
    // transparent background, we will be creating a gradient background later using CSS
    transparent: true,
  });

  // return a random number within a range
  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  // map a number from 1 range to another
  function map(n, start1, end1, start2, end2) {
    return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
  }

  const simplex = new createNoise2D();

  // Orb class
  class Orb {
    // Pixi takes hex colors as hexidecimal literals (0x rather than a string with '#')
    constructor(fill = 0x000000) {
      // bounds = the area an orb is "allowed" to move within
      this.bounds = this.setBounds();
      // initialise the orb's { x, y } values to a random point within it's bounds
      this.x = random(this.bounds["x"].min, this.bounds["x"].max);
      this.y = random(this.bounds["y"].min, this.bounds["y"].max);

      // how large the orb is vs it's original radius (this will modulate over time)
      this.scale = 1;

      // what color is the orb?
      this.fill = fill;

      // the original radius of the orb, set relative to window height
      this.radius = random(window.innerHeight / 6, window.innerHeight / 3);

      // starting points in "time" for the noise/self similar random values
      this.xOff = random(0, 1000);
      this.yOff = random(0, 1000);
      // how quickly the noise/self similar random values step through time
      this.inc = 0.002;

      // PIXI.Graphics is used to draw 2d primitives (in this case a circle) to the canvas
      this.graphics = new PIXI.Graphics();
      this.graphics.alpha = 0.825;

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
        window.innerWidth < 1000
          ? window.innerWidth / 3
          : window.innerWidth / 5;
      // the { x, y } origin for each orb (the bottom right of the screen)
      const originX = window.innerWidth / 1.25;
      const originY =
        window.innerWidth < 1000
          ? window.innerHeight
          : window.innerHeight / 1.375;

      // allow each orb to move x distance away from it's { x, y }origin
      return {
        x: {
          min: originX - maxDist,
          max: originX + maxDist,
        },
        y: {
          min: originY - maxDist,
          max: originY + maxDist,
        },
      };
    }

    update() {
      // self similar "psuedo-random" or noise values at a given point in "time"
      const xNoise = simplex.noise2D(this.xOff, this.xOff);
      const yNoise = simplex.noise2D(this.yOff, this.yOff);
      const scaleNoise = simplex.noise2D(this.xOff, this.yOff);

      // map the xNoise/yNoise values (between -1 and 1) to a point within the orb's bounds
      this.x = map(xNoise, -1, 1, this.bounds["x"].min, this.bounds["x"].max);
      this.y = map(yNoise, -1, 1, this.bounds["y"].min, this.bounds["y"].max);
      // map scaleNoise (between -1 and 1) to a scale value somewhere between half of the orb's original size, and 100% of it's original size
      this.scale = map(scaleNoise, -1, 1, 0.5, 1);

      // step through "time"
      this.xOff += this.inc;
      this.yOff += this.inc;
    }
  }

  return (
    <>
      <canvas className="orb-canvas" ref={canvasRef}></canvas>
    </>
  );
};

export default Test;
