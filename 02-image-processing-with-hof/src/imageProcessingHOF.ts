import type { Image, Color } from "../include/image.js";

export function imageMapCoord(img: Image, func: (img: Image, x: number, y: number) => Color): Image {
  // TODO
  const newImg = img.copy();
  for (let x = 0; x < newImg.width; x++) {
    for (let y = 0; y < newImg.height; y++) {
      newImg.setPixel(x, y, func(img, x, y));
    }
  }
  return newImg;
}

export function imageMapIf(
  img: Image,
  cond: (img: Image, x: number, y: number) => boolean,
  func: (p: Color) => Color
): Image {
  // TODO
  return imageMapCoord(img, (image, x, y) => {
    const color = image.getPixel(x, y);
    return cond(image, x, y) ? func(color) : color;
  });
}

export function mapWindow(
  img: Image,
  xInterval: number[], // Assumed to be a two element array containing [x_min, x_max]
  yInterval: number[], // Assumed to be a two element array containing [y_min, y_max]
  func: (p: Color) => Color
): Image {
  // TODO
  return imageMapIf(
    img,
    (_image, x, y) => {
      return xInterval[0] <= x && x <= xInterval[1] && yInterval[0] <= y && y <= yInterval[1];
    },
    func
  );
}

export function isGrayish(p: Color): boolean {
  // TODO
  const [min, , max] = [...p].sort((a, b) => a - b);
  return max - min <= 85;
}

export function makeGrayish(img: Image): Image {
  // TODO
  return imageMapIf(
    img,
    (image, x, y) => !isGrayish(image.getPixel(x, y)),
    color => {
      const average = Math.floor(color.reduce((acc, num) => acc + num, 0) / 3);
      return [average, average, average];
    }
  );
}

export function pixelBlur(img: Image, x: number, y: number): Color {
  // TODO
  let count = 0;
  let avgColor: Color = [0, 0, 0];
  [-1, 0, 1].forEach(i => {
    [-1, 0, 1].forEach(j => {
      const xCoord = x + i;
      const yCoord = y + j;
      if (xCoord >= 0 && xCoord < img.width && yCoord >= 0 && yCoord < img.height) {
        const color = img.getPixel(xCoord, yCoord);
        avgColor = avgColor.map((sum, i) => sum + color[i]);
        count++;
      }
    });
  });
  return avgColor.map(sum => Math.floor(sum / count));
}

export function imageBlur(img: Image): Image {
  // TODO
  return imageMapCoord(img, pixelBlur);
}
