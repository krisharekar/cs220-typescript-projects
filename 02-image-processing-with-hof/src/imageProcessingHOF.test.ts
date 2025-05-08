import assert from "assert";
import { Color, COLORS, Image } from "../include/image.js";
import {
  imageMapCoord,
  imageMapIf,
  mapWindow,
  isGrayish,
  makeGrayish,
  pixelBlur,
  imageBlur,
} from "./imageProcessingHOF.js";

// Helper function to check if a color is equal to another one with an error of 1 (default)
function expectColorToBeCloseTo(actual: Color, expected: Color, error = 1) {
  [0, 1, 2].forEach(i => expect(Math.abs(actual[i] - expected[i])).toBeLessThanOrEqual(error));
}

function changeGreen(img: Image, x: number, y: number): Color {
  const [r, , b] = img.getPixel(x, y);
  return [r, 100, b];
}

function changeBlue(c: Color): Color {
  return [c[0], c[1], 100];
}

describe("imageMapCoord", () => {
  function identity(img: Image, x: number, y: number) {
    return img.getPixel(x, y);
  }

  function avgColor(img: Image, x: number, y: number): Color {
    const left = x > 0 ? img.getPixel(x - 1, y) : img.getPixel(x, y);
    const right = x < img.width - 1 ? img.getPixel(x + 1, y) : img.getPixel(x, y);

    return [
      Math.floor((left[0] + right[0]) / 2),
      Math.floor((left[1] + right[1]) / 2),
      Math.floor((left[2] + right[2]) / 2),
    ];
  }

  it("should not modify based on updated pixels", () => {
    const img = Image.create(3, 1, COLORS.BLACK);
    img.setPixel(0, 0, [10, 20, 30]);
    img.setPixel(1, 0, [100, 110, 120]);
    img.setPixel(2, 0, [200, 210, 220]);

    const newImg = imageMapCoord(img, avgColor);

    expectColorToBeCloseTo(newImg.getPixel(0, 0), [55, 65, 75]);
    expectColorToBeCloseTo(newImg.getPixel(1, 0), [105, 115, 125]);
    expectColorToBeCloseTo(newImg.getPixel(2, 0), [150, 160, 170]);
  });

  it("should return a different image", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = imageMapCoord(input, identity);
    assert(input !== output);
  });

  it("should return a different image with same color", () => {
    const input = Image.create(5, 5, COLORS.WHITE);
    const output = imageMapCoord(input, identity);
    expectColorToBeCloseTo(input.getPixel(1, 3), output.getPixel(1, 3));
  });

  // More tests for imageMapCoord go here.

  it("should not change orignal image", () => {
    const img = Image.create(15, 10, COLORS.WHITE);
    imageMapCoord(img, changeGreen);
    const color = img.getPixel(5, 5);
    assert(color[1] === 255);
  });

  it("should change the only pixels green channel to 100", () => {
    const img = Image.create(1, 1, COLORS.WHITE);
    const newImg = imageMapCoord(img, changeGreen);
    const color = newImg.getPixel(0, 0);
    assert(color[1] === 100);
  });

  it("should be new image with same dimensions", () => {
    const img = Image.create(5, 5, COLORS.WHITE);
    const newImg = imageMapCoord(img, changeGreen);
    assert(img.height === newImg.height && img.width === newImg.width);
  });

  it("should change big image", () => {
    const img = Image.create(100, 100, COLORS.WHITE);
    const newImg = imageMapCoord(img, changeGreen);
    const color = newImg.getPixel(50, 50);
    assert(color[1] === 100);
  });

  it("should apply function to all pixels in a 3x3 image", () => {
    const img = Image.create(3, 3, COLORS.WHITE);
    const newImg = imageMapCoord(img, changeGreen);

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        const color = newImg.getPixel(x, y);
        assert(color[1] === 100);
      }
    }
  });

  it("should correctly change all pixels", () => {
    const img = Image.create(2, 2, COLORS.BLACK);
    img.setPixel(0, 0, [50, 50, 50]);
    img.setPixel(0, 1, [100, 100, 100]);
    img.setPixel(1, 0, [150, 150, 150]);
    img.setPixel(1, 1, [200, 200, 200]);

    const newImg = imageMapCoord(img, changeGreen);
    expectColorToBeCloseTo(newImg.getPixel(0, 0), [50, 100, 50]);
    expectColorToBeCloseTo(newImg.getPixel(0, 1), [100, 100, 100]);
    expectColorToBeCloseTo(newImg.getPixel(1, 0), [150, 100, 150]);
    expectColorToBeCloseTo(newImg.getPixel(1, 1), [200, 100, 200]);
  });
});

describe("imageMapIf", () => {
  // More tests for imageMapIf go here
  function cond(img: Image, x: number, y: number): boolean {
    const [r, g, b] = img.getPixel(x, y);
    return r === 0 && g === 0 && b === 0;
  }

  it("should change a single black pixel's blue channel to 100", () => {
    const img = Image.create(10, 10, COLORS.WHITE);
    img.setPixel(1, 4, COLORS.BLACK);
    const newImg = imageMapIf(img, cond, changeBlue);
    const color = newImg.getPixel(1, 4);
    assert(color[2] === 100);
  });
});

describe("mapWindow", () => {
  // More tests for mapWindow go here
  it("should change blue to 100 at the start of boundary of interval", () => {
    const img = Image.create(10, 10, COLORS.WHITE);
    const newImg = mapWindow(img, [2, 4], [4, 6], changeBlue);
    const color = newImg.getPixel(2, 4);
    assert(color[2] === 100);
  });

  it("should change blue to 100 at the end of boundary of interval", () => {
    const img = Image.create(10, 10, COLORS.WHITE);
    const newImg = mapWindow(img, [2, 4], [4, 6], changeBlue);
    const color = newImg.getPixel(4, 6);
    assert(color[2] === 100);
  });

  it("should change blue to 100 inside boundary of interval", () => {
    const img = Image.create(10, 10, COLORS.WHITE);
    const newImg = mapWindow(img, [2, 4], [4, 6], changeBlue);
    const color = newImg.getPixel(3, 5);
    assert(color[2] === 100);
  });

  it("should not change adjacent to boundary of interval", () => {
    const img = Image.create(10, 10, COLORS.WHITE);
    const newImg = mapWindow(img, [2, 4], [4, 6], changeBlue);
    const color = newImg.getPixel(1, 3);
    assert(color[2] === 255);
  });

  it("should not change partly outside boundary of interval", () => {
    const img = Image.create(10, 10, COLORS.WHITE);
    const newImg = mapWindow(img, [2, 4], [4, 6], changeBlue);
    const color = newImg.getPixel(2, 3);
    assert(color[2] === 255);
  });

  it("should not change for incorrect interval", () => {
    const img = Image.create(10, 10, COLORS.WHITE);
    const newImg = mapWindow(img, [11, 13], [12, 15], changeBlue);
    const color = newImg.getPixel(2, 3);
    assert(color[2] === 255);
  });

  it("should change for all pixels", () => {
    const img = Image.create(10, 10, COLORS.WHITE);
    const newImg = mapWindow(img, [-1, 10], [-1, 10], changeBlue);
    const color = newImg.getPixel(9, 9);
    assert(color[2] === 100);
  });

  it("should change one pixel", () => {
    const img = Image.create(1, 1, COLORS.WHITE);
    const newImg = mapWindow(img, [0, 0], [0, 0], changeBlue);
    const color = newImg.getPixel(0, 0);
    assert(color[2] === 100);
  });

  it("should not change if interval is reversed", () => {
    const img = Image.create(10, 10, COLORS.WHITE);
    const newImg = mapWindow(img, [4, 2], [6, 4], changeBlue);
    const color = newImg.getPixel(3, 5);
    assert(color[2] === 255);
  });

  it("should not change outside the edge", () => {
    const img = Image.create(10, 10, COLORS.WHITE);
    const newImg = mapWindow(img, [3, 4], [2, 3], changeBlue);
    const color1 = newImg.getPixel(2, 1);
    const color2 = newImg.getPixel(3, 1);
    const color3 = newImg.getPixel(4, 1);
    const color4 = newImg.getPixel(2, 2);
    const color5 = newImg.getPixel(2, 3);
    const color6 = newImg.getPixel(2, 4);
    const color7 = newImg.getPixel(3, 4);
    const color8 = newImg.getPixel(4, 4);
    const color9 = newImg.getPixel(5, 1);
    const color10 = newImg.getPixel(5, 2);
    const color11 = newImg.getPixel(5, 3);
    const color12 = newImg.getPixel(5, 4);
    assert(color1[2] === 255);
    assert(color2[2] === 255);
    assert(color3[2] === 255);
    assert(color4[2] === 255);
    assert(color5[2] === 255);
    assert(color6[2] === 255);
    assert(color7[2] === 255);
    assert(color8[2] === 255);
    assert(color9[2] === 255);
    assert(color10[2] === 255);
    assert(color11[2] === 255);
    assert(color12[2] === 255);
  });

  it("should change inside boundary of interval", () => {
    const img = Image.create(10, 10, COLORS.WHITE);
    const newImg = mapWindow(img, [2.5, 4], [4, 5.5], changeBlue);
    const color = newImg.getPixel(3, 5);
    assert(color[2] === 100);
  });
});

describe("isGrayish", () => {
  // More tests for isGrayish go here
  it("should return true for grayish colors", () => {
    assert(isGrayish([95, 110, 105]));
    assert(isGrayish([255, 255, 255]));
    assert(isGrayish([0, 0, 0]));
  });

  it("should return false for non grayish colors", () => {
    assert(!isGrayish([200, 0, 0]));
    assert(!isGrayish([100, 250, 50]));
  });

  it("should return false for outside boundary case", () => {
    assert(!isGrayish([100, 14, 14]));
  });

  it("should return true for inside boundary case", () => {
    assert(isGrayish([100, 15, 15]));
  });
});

describe("makeGrayish", () => {
  // More tests for makeGrayish go here
  it("should convert pixels to grayish", () => {
    const img = Image.create(10, 10, [255, 0, 0]);
    const newImg = makeGrayish(img);
    const color = newImg.getPixel(5, 5);
    assert.deepEqual(color, [85, 85, 85]);
  });

  it("should leave grayish pixels unchanged", () => {
    const img = Image.create(10, 10, [90, 105, 110]);
    const newImg = makeGrayish(img);
    assert.deepStrictEqual(newImg.getPixel(5, 5), [90, 105, 110]);
  });

  it("should change pixels", () => {
    const img = Image.create(10, 10, [86, 0, 0]);
    const newImg = makeGrayish(img);
    expectColorToBeCloseTo(newImg.getPixel(5, 5), [28, 28, 28]);
  });
});

describe("pixelBlur", () => {
  // Tests for pixelBlur go here
  it("should blur the pixel correctly", () => {
    const img = Image.create(10, 10, COLORS.BLACK);
    img.setPixel(5, 5, COLORS.WHITE);
    const blurredColor = pixelBlur(img, 5, 5);
    expectColorToBeCloseTo(blurredColor, [28, 28, 28]);
  });

  it("should change nothing", () => {
    const img = Image.create(10, 10, COLORS.BLACK);
    const blurredColor = pixelBlur(img, 5, 5);
    expectColorToBeCloseTo(blurredColor, [0, 0, 0]);
  });

  it("should not change the one pixel", () => {
    const img = Image.create(1, 1, [200, 50, 10]);
    const blurredColor = pixelBlur(img, 0, 0);
    expectColorToBeCloseTo(blurredColor, [200, 50, 10]);
  });
});

describe("imageBlur", () => {
  // Tests for imageBlur go here
  it("should blue the center pixel correctly", () => {
    const img = Image.create(9, 9, COLORS.BLACK);
    img.setPixel(4, 4, COLORS.WHITE);
    const blurredImg = imageBlur(img);
    expectColorToBeCloseTo(blurredImg.getPixel(4, 4), [28, 28, 28]);
  });
});
