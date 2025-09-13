import React from "react";
import "./ImageGrid.css";

/**
 * Simple 2x2 image grid
 * @param {Array} images - array of objects { src, alt }
 */
function ImageGrid({ images }) {
  return (
    <div className="image-grid">
      {images.map((img, index) => (
        <div key={index} className="grid-card">
          <img src={img.src} alt={img.alt || `img-${index}`} className="grid-img" />
        </div>
      ))}
    </div>
  );
}

export default ImageGrid;
