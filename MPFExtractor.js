(function () {
  "use strict";

  /*
   * MPF Extractor (Multi Picture Format Extractor)
   * By Henrik S Nilsson 2019
   * https://github.com/hsnilsson/MPFExtractor
   *
   * Extracts secondary images (e.g. gain maps) stored in JPEGs
   * using the MPF format (CIPA DC-007).
   */

  class MPFExtractor {
    constructor() {
      this.options = {
        debug: false,
        extractFII: false,
        extractNonFII: true,
      };
    }

    extract(imageArrayBuffer, options) {
      return new Promise((resolve, reject) => {
        for (let option in options) {
          if (this.options.hasOwnProperty(option)) {
            this.options[option] = options[option];
          }
        }
        const debug = this.options.debug;

        const dataView = new DataView(imageArrayBuffer);
        if (dataView.getUint16(0) != 0xffd8) {
          reject("Not a valid JPEG");
          return;
        }

        let offset = 2,
          length = dataView.byteLength,
          loops = 0,
          marker;

        while (offset < length) {
          if (++loops > 250) {
            reject("No MPF marker found");
            return;
          }
          if (dataView.getUint8(offset) != 0xff) {
            reject("Not a valid marker at offset 0x" + offset.toString(16));
            return;
          }

          marker = dataView.getUint8(offset + 1);

          if (marker == 0xe2) {
            const formatPt = offset + 4;

            if (dataView.getUint32(formatPt) == 0x4d504600) {
              let bigEnd,
                tiffOffset = formatPt + 4;

              if (dataView.getUint16(tiffOffset) == 0x4949) {
                bigEnd = false;
              } else if (dataView.getUint16(tiffOffset) == 0x4d4d) {
                bigEnd = true;
              } else {
                reject("No valid endianness marker found in TIFF header");
                return;
              }

              if (dataView.getUint16(tiffOffset + 2, !bigEnd) != 0x002a) {
                reject("Not valid TIFF data");
                return;
              }

              const firstIFDOffset = dataView.getUint32(
                tiffOffset + 4,
                !bigEnd
              );

              if (firstIFDOffset < 0x00000008) {
                reject("Not valid TIFF data (first offset less than 8)");
                return;
              }

              const dirStart = tiffOffset + firstIFDOffset,
                count = dataView.getUint16(dirStart, !bigEnd);

              let entriesStart = dirStart + 2,
                numberOfImages = 0;

              for (
                let i = entriesStart;
                i < entriesStart + 12 * count;
                i += 12
              ) {
                if (dataView.getUint16(i, !bigEnd) == 0xb001) {
                  numberOfImages = dataView.getUint32(i + 8, !bigEnd);
                }
              }

              const nextIFDOffsetLen = 4,
                MPImageListValPt =
                  dirStart + 2 + count * 12 + nextIFDOffsetLen,
                images = [];

              for (
                let i = MPImageListValPt;
                i < MPImageListValPt + numberOfImages * 16;
                i += 16
              ) {
                const image = {};
                image.MPType = dataView.getUint32(i, !bigEnd);
                image.size = dataView.getUint32(i + 4, !bigEnd);
                image.dataOffset = dataView.getUint32(i + 8, !bigEnd);
                image.dependantImages = dataView.getUint32(i + 12, !bigEnd);

                if (!image.dataOffset) {
                  image.start = 0;
                  image.isFII = true;
                } else {
                  image.start = tiffOffset + image.dataOffset;
                  image.isFII = false;
                }
                image.end = image.start + image.size;
                images.push(image);
              }

              if (this.options.extractNonFII && images.length) {
                const bufferBlob = new Blob([dataView]),
                  imgs = [];

                for (const image of images) {
                  if (image.isFII && !this.options.extractFII) {
                    continue;
                  }
                  const imageBlob = bufferBlob.slice(
                    image.start,
                    image.end + 1,
                    { type: "image/jpeg" }
                  );
                  const imageUrl = URL.createObjectURL(imageBlob);
                  image.img = document.createElement("img");
                  image.img.src = imageUrl;
                  imgs.push(image.img);
                }
                resolve(imgs);
              }
            }
          }
          offset += 2 + dataView.getUint16(offset + 2);
        }
        reject("No MPF data found — this JPEG may not contain a gain map");
      });
    }
  }

  if (typeof exports === "object") {
    module.exports = MPFExtractor;
  } else {
    window.MPFExtractor = MPFExtractor;
  }
})();
