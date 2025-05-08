import type { Color, Image } from "../include/image.js";

/**
 * Saturates green color in each pixel of an image
 * @param img An image
 * @returns A new image where each pixel has the green channel set to its maximum.
 */
export function saturateGreen(img: Image): Image {
  // TODO
  const newImg = img.copy();
  for (let x = 0; x < newImg.width; x++) {
    for (let y = 0; y < newImg.height; y++) {
      const [r, , b] = newImg.getPixel(x, y);
      newImg.setPixel(x, y, [r, 255, b]);
    }
  }
  return newImg;
}

/**
 * Flips the colors of an image
 * @param img An image
 * @returns A new image where each pixel's channel has been
 *  set as the truncated average of the other two
 */
export function flipColors(img: Image): Image {
  // TODO
  const newImg = img.copy();
  for (let x = 0; x < newImg.width; x++) {
    for (let y = 0; y < newImg.height; y++) {
      const [r, g, b] = newImg.getPixel(x, y);
      newImg.setPixel(x, y, [Math.floor((g + b) / 2), Math.floor((r + b) / 2), Math.floor((r + g) / 2)]);
    }
  }
  return newImg;
}

/**
 * Modifies the given `img` such that the value of each pixel
 * in the given line is the result of applying `func` to the
 * corresponding pixel of `img`. If `lineNo` is not a valid line
 * number, then `img` should not be modified.
 * @param img An image
 * @param lineNo A line number
 * @param func A color transformation function
 */
export function mapLine(img: Image, lineNo: number, func: (c: Color) => Color): void {
  // TODO
  if (lineNo < 0 || lineNo >= img.height || lineNo % 1 != 0) return;
  for (let x = 0; x < img.width; x++) {
    const pixel = img.getPixel(x, lineNo);
    img.setPixel(x, lineNo, func(pixel));
  }
}

/**
 * The result must be a new image with the same dimensions as `img`.
 * The value of each pixel in the new image should be the result of
 * applying `func` to the corresponding pixel of `img`.
 * @param img An image
 * @param func A color transformation function
 */
export function imageMap(img: Image, func: (c: Color) => Color): Image {
  // TODO
  const newImg = img.copy();
  for (let y = 0; y < img.height; y++) mapLine(newImg, y, func);
  return newImg;
}

/**
 * Saturates green color in an image
 * @param img An image
 * @returns A new image where each pixel has the green channel has been set to its maximum.
 */
export function mapToGreen(img: Image): Image {
  // TODO
  return imageMap(img, function (c: Color): Color {
    return [c[0], 255, c[2]];
  });
}

/**
 * Flips the colors of an image
 * @param img An image
 * @returns A new image where each pixels channel has been
 *  set as the truncated average of the other two
 */
export function mapFlipColors(img: Image): Image {
  // TODO
  return imageMap(img, function (c: Color): Color {
    return [Math.floor((c[1] + c[2]) / 2), Math.floor((c[0] + c[2]) / 2), Math.floor((c[0] + c[1]) / 2)];
  });
}
