import React, { useState, useEffect } from "react";

function App() {
  const [numRows, setNumRows] = useState(1);
  const [numColumns, setNumColumns] = useState(1);
  const [xSize, setXSize] = useState(0);
  const [ySize, setYSize] = useState(0);
  const [rendering, setRendering] = useState("pixelated");
  const [canvasSize, setCanvasSize] = useState(50);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loadedImages, setLoadedImages] = useState([]);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    if (selectedFiles.length > 0 && numRows > 0 && numColumns > 0) {
      renderCanvas();
    }
  }, [selectedFiles, numRows, numColumns]);

  const formUpdate = (e) => {
    console.log("formUpdate");
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const canvasSizeHandler = (value) => {
    setCanvasSize(value);
    console.log(value);
    const canvasElement = document.getElementById("canvas");
    if (canvasElement) {
      canvasElement.style.width = `${value}%`;
    }
  };

  const clearCanvas = () => {
    const canvasElement = document.getElementById("canvas");
    if (canvasElement) {
      canvasElement.remove();
    }
  };

  const renderCanvas = () => {
    clearCanvas();
    setErrors("");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const imageDisplay = document.getElementById("imageDisplay");
    imageDisplay.innerHTML = "";

    const newLoadedImages = [];

    Promise.all(
      selectedFiles.map((file) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = URL.createObjectURL(file);
          img.onload = () => {
            newLoadedImages.push(img);
            resolve();
          };
        });
      })
    ).then(() => {
      setLoadedImages(newLoadedImages);

      // canvas.width = newLoadedImages[0].width * numColumns;
      // canvas.height = newLoadedImages[0].height * numRows;

      // add offset
      canvas.width = 
        newLoadedImages[0].width * numColumns + xSize * numColumns;
      canvas.height =
        newLoadedImages[0].height * numRows + ySize * numRows;


      let x = 0;
      let y = 0;
      newLoadedImages.forEach((img, index) => {
        context.drawImage(img, x, y);
        x += img.width;
        if ((index + 1) % numColumns === 0) {
          x = 0;
          y += img.height;
        }
      });

      imageDisplay.appendChild(canvas);
      canvas.id = "canvas";
    });
  };

  return (
    <div>
      <div className="container">
        <form id="myForm">
          <input
            type="file"
            id="fileInput"
            name="file"
            multiple
            onChange={formUpdate}
          />
          <br />
          <label htmlFor="numRows">Number of Rows:</label>
          <input
            type="number"
            id="numRows"
            value={numRows}
            min="1"
            onChange={(e) => {
              setNumRows(e.target.value);
            }}
          />
          <br />
          <label htmlFor="numColumns">Number of Columns:</label>
          <input
            type="number"
            id="numColumns"
            value={numColumns}
            min="1"
            onChange={(e) => {
              setNumColumns(e.target.value);
            }}
          />
          <br />
          <label htmlFor="offset">Image Offset:</label> <br />
          x:{" "}
          <input
            type="number"
            id="xSize"
            value={xSize}
            onChange={(e) => {
              setXSize(e.target.value)
            }}
          />
          y:{" "}
          <input
            type="number"
            id="ySize"
            value={ySize}
            onChange={(e) => {
              setYSize(e.target.value)
            }}
          />
          <br />
          <label htmlFor="padding">Image-Render:</label>
          <select
            id="rendering"
            value={rendering}
            onChange={(e) => setRendering(e.target.value)}
          >
            <option value="pixelated">pixelated</option>
            <option value="auto">auto</option>
          </select>
          <small>*won't affect downloaded image</small>
        </form>
        <h3>Canvas Size:</h3>
        <input
          type="range"
          min="1"
          max="140"
          step="1"
          onChange={(e) => canvasSizeHandler(e.target.value)}
          value={canvasSize}
          id="canvasSize"
        />
        <br />
        <div id="errors" style={{ color: errors === "" ? "inherit" : "red" }}>
          {errors}
        </div>
      </div>
        <div id="imageDisplay"></div>
    </div>
  );
}

export default App;

