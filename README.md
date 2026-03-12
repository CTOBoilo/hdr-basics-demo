# HDR Gain Map Demo

Simple demo websites showcasing HDR photography with gain maps. Built for the **Understanding and Seeing in HDR** presentation.

On an HDR display, gain map JPEGs push highlights beyond reference white (203 nits), which makes the standard CSS `#ffffff` white background appear grey by comparison. These pages demonstrate that effect.

## Demo Pages

- [SDR vs HDR Comparison](https://ctoboilo.github.io/hdr-basics-demo/site1-comparison.html) — same photos side by side, SDR left, HDR right
- [HDR Gain Map](https://ctoboilo.github.io/hdr-basics-demo/site2-hdr.html) — HDR gain map images only (white background goes grey on HDR displays)
- [SDR Standard](https://ctoboilo.github.io/hdr-basics-demo/site3-sdr.html) — SDR images only (white stays white)
- [Gain Map Preview](https://ctoboilo.github.io/hdr-basics-demo/site4-gainmap-preview.html) — extracts and displays the hidden gain map layer from each JPEG

## Viewing Requirements

- An HDR-capable display (MacBook Pro, iPhone 12+, iPad Pro, LG C series TV, etc.)
- Chrome, Edge, or Safari
- SDR displays will still show the pages fine — you just won't see the HDR effect

## How It Works

Gain map JPEGs embed a secondary image (the gain map) using the MPF (Multi-Picture Format) standard. The gain map is a low-contrast image that tells the browser where and how much to boost brightness beyond SDR white. The browser applies this automatically on HDR displays — no JavaScript needed for Sites 1-3. Site 4 uses [MPFExtractor.js](https://github.com/hsnilsson/MPFExtractor) to extract and display the hidden gain map layer.

## Adding Images

Drop your images into the `images/` folder using this naming convention:

| HDR gain map version | SDR version |
|---|---|
| photo1-hdr.jpg | photo1-sdr.jpg |
| photo2-hdr.jpg | photo2-sdr.jpg |
| photo3-hdr.jpg | photo3-sdr.jpg |
| photo4-hdr.jpg | photo4-sdr.jpg |

HDR files should be JPEGs with embedded gain maps (e.g. exported from Lightroom with HDR output enabled).
