import assert from "assert";
import { Color, COLORS, Image } from "../include/image.js";
import { flipColors, saturateGreen, mapLine, imageMap, mapToGreen, mapFlipColors } from "./imageProcessing.js";

function changeColor(c: Color): Color {
  c[1] = 100;
  return c;
}

describe("saturateGreen", () => {
  it("should maximize green in the upper left corner", () => {
    const blackImage = Image.create(10, 15, COLORS.BLACK);
    const gbImage = saturateGreen(blackImage);
    const p = gbImage.getPixel(0, 0);

    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 0, "The blue channel should be 0.");

    // or alternatively, using jest, if you'd like
    // https://jestjs.io/docs/expect#toequalvalue
    // Use expect with .toEqual to compare recursively all properties of object instances (also known as "deep" equality).

    expect(p).toEqual([0, 255, 0]);

    // This will produce output showing the exact differences between the two objects, which is really helpful
    // for debugging. However, again, please use the simpler assert syntax if this is too confusing.
    // Focus on making your tests well written and correct, rather than using one syntax or another.
  });

  it("should maximize green in the center", () => {
    const blackImage = Image.create(10, 15, COLORS.BLACK);
    const gbImage = saturateGreen(blackImage);
    const p = gbImage.getPixel(5, 7);

    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 0, "The blue channel should be 0.");
  });

  // More tests for saturateGreen go here.
  it("should maximize green in the bottom right corner", () => {
    const blackImage = Image.create(10, 15, COLORS.BLACK);
    const gbImage = saturateGreen(blackImage);
    const p = gbImage.getPixel(9, 14);

    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 0, "The blue channel should be 0.");
  });
});

describe("flipColors", () => {
  it("should correctly flip top left corner", () => {
    const whiteImage = Image.create(10, 10, COLORS.WHITE);
    // A white image is not particularly helpful in this context
    whiteImage.setPixel(0, 0, [100, 0, 150]);
    const flippedWhiteImage = flipColors(whiteImage);
    const p = flippedWhiteImage.getPixel(0, 0);

    assert(p[0] === 75);
    assert(p[1] === 125);
    assert(p[2] === 50);
  });

  // More tests for flipColors go here.

  it("should correctly flip bottom right corner", () => {
    const whiteImage = Image.create(10, 10, COLORS.WHITE);
    // A white image is not particularly helpful in this context
    whiteImage.setPixel(9, 9, [100, 0, 150]);
    const flippedWhiteImage = flipColors(whiteImage);
    const p = flippedWhiteImage.getPixel(9, 9);

    assert(p[0] === 75);
    assert(p[1] === 125);
    assert(p[2] === 50);
  });
});

describe("mapLine", () => {
  // Tests for mapLine go here.
  it("should correctly change green to 100 on line 5", () => {
    const blackImage = Image.create(10, 10, COLORS.BLACK);
    mapLine(blackImage, 5, changeColor);

    for (let x = 0; x < blackImage.width; x++) {
      const [, g] = blackImage.getPixel(x, 5);
      assert(g === 100);
    }
  });

  it("should not change anything", () => {
    const blackImage = Image.create(10, 10, COLORS.BLACK);
    mapLine(blackImage, 10, changeColor);

    for (let x = 0; x < blackImage.width; x++) {
      for (let y = 0; y < blackImage.height; y++) {
        const [r, g, b] = blackImage.getPixel(x, y);
        assert(r === 0);
        assert(g === 0);
        assert(b === 0);
      }
    }
  });
});

describe("imageMap", () => {
  // Tests for imageMap go here.
  it("should correctly change green to 100", () => {
    const blackImage = Image.create(10, 10, COLORS.BLACK);
    const newImg = imageMap(blackImage, changeColor);

    for (let x = 0; x < newImg.width; x++) {
      for (let y = 0; y < newImg.height; y++) {
        const [r, g, b] = newImg.getPixel(x, y);
        assert(r === 0);
        assert(g === 100);
        assert(b === 0);
      }
    }
  });
});

describe("mapToGreen", () => {
  // Tests for mapToGreen go here.
  it("should maximize green in the center", () => {
    const blackImage = Image.create(10, 15, COLORS.BLACK);
    const gbImage = mapToGreen(blackImage);
    const p = gbImage.getPixel(5, 7);

    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 0, "The blue channel should be 0.");
  });

  // More tests for saturateGreen go here.
  it("should maximize green in the bottom right corner", () => {
    const blackImage = Image.create(10, 15, COLORS.BLACK);
    const gbImage = mapToGreen(blackImage);
    const p = gbImage.getPixel(9, 14);

    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 0, "The blue channel should be 0.");
  });
});

describe("mapFlipColors", () => {
  // Tests for mapFlipColors go here.
  it("should correctly flip top left corner", () => {
    const whiteImage = Image.create(10, 10, COLORS.WHITE);
    // A white image is not particularly helpful in this context
    whiteImage.setPixel(0, 0, [100, 0, 150]);
    const flippedWhiteImage = mapFlipColors(whiteImage);
    const p = flippedWhiteImage.getPixel(0, 0);

    assert(p[0] === 75);
    assert(p[1] === 125);
    assert(p[2] === 50);
  });

  // More tests for flipColors go here.

  it("should correctly flip bottom right corner", () => {
    const whiteImage = Image.create(10, 10, COLORS.WHITE);
    // A white image is not particularly helpful in this context
    whiteImage.setPixel(9, 9, [100, 0, 150]);
    const flippedWhiteImage = mapFlipColors(whiteImage);
    const p = flippedWhiteImage.getPixel(9, 9);

    assert(p[0] === 75);
    assert(p[1] === 125);
    assert(p[2] === 50);
  });
});
