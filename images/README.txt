HDR Gain Map Demo — Image Naming Convention
============================================

Drop your images into this folder using the naming pattern below.
The HTML pages expect 4 image pairs (easily expandable).

  HDR gain map versions:     SDR versions:
  ----------------------     -------------
  photo1-hdr.jpg             photo1-sdr.jpg
  photo2-hdr.jpg             photo2-sdr.jpg
  photo3-hdr.jpg             photo3-sdr.jpg
  photo4-hdr.jpg             photo4-sdr.jpg

Notes:
- HDR files should be JPEGs with embedded gain maps (e.g. exported
  from Lightroom with HDR output enabled).
- SDR files are standard sRGB JPEGs of the same photographs.
- Site 1 (comparison) uses both -hdr and -sdr versions side by side.
- Site 2 (HDR only) uses the -hdr versions.
- Site 3 (SDR only) uses the -sdr versions.

To add more images, duplicate an <img> tag in the HTML and increment
the number (photo5-hdr.jpg, photo5-sdr.jpg, etc.).
