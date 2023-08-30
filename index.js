formUpdate = function () {
  const xSize = document.getElementById("xSize").value;
  const ySize = document.getElementById("ySize").value;

  const selectedFiles = Array.from(document.getElementById("fileInput").files);
  const numRows = parseInt(document.getElementById("numRows").value);
  const numColumns = parseInt(document.getElementById("numColumns").value);
  const rendering = document.getElementById("rendering").value;
  if (selectedFiles.length === 0) {
    document.getElementById("errors").style.color = "red";
    document.getElementById("errors").innerHTML =
    "Please select images and specify the number of rows and columns.";
    document.getElementById("canvas").style.display = "none";
    return;
  } else {
    document.getElementById("errors").innerHTML = "";
    if (document.getElementById("canvas") != null) {
      document.getElementById("canvas").style.display = "block";
    }
  }
  Start(
    selectedFiles,
    numRows,
    numColumns,
    rendering,
    xSize,
    ySize
  );
};

var r = document.querySelector(":root");
canvasSize = function (value) {
  r.style.setProperty("--canvasSize", value + "%");
};

Start = (selectedFiles, numRows, numColumns, rendering, xSize, ySize) => {
  if (selectedFiles.length === 0 || numRows <= 0 || numColumns <= 0) {
    document.getElementById("errors").style.color = "red";
    document.getElementById("errors").innerHTML =
      "Please select images and specify the number of rows and columns.";
    return;
  } else {
    document.getElementById("errors").innerHTML = "";
  }

  if (rendering === "pixelated") {
    r.style.setProperty("--canvasRendering", "pixelated");
    } else if (rendering === "auto") {
    r.style.setProperty("--canvasRendering", "auto");
    }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const imageDisplay = document.getElementById("imageDisplay");
  imageDisplay.innerHTML = "";
  const images = [];

  // Load images
  let loadedImages = 0;
  selectedFiles.forEach((file, index) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      images[index] = img;
      loadedImages++;

      if (loadedImages === selectedFiles.length) {
        // All images loaded, now combine them
        // canvas.width = images[0].width * numColumns;
        // canvas.height = images[0].height * numRows;

        //this happens only once, when the first image is loaded
        if (xSize === "0" || ySize === "0") {
          //set x and y size from the current image
          xSize = images[0].width;
          ySize = images[0].height;
          document.getElementById("xSize").value = xSize;
          document.getElementById("ySize").value = ySize;
          console.log("xSize: " + xSize);
        } else {
          //set x and y size from the input
          document.getElementById("xSize").value = xSize;
          document.getElementById("ySize").value = ySize;
        }

        canvas.width = xSize * numColumns;
        canvas.height = ySize * numRows;

        numRows = Math.min(numRows, images.length);
        numColumns = Math.min(numColumns, images.length);

        // Draw images to canvas in a grid using the specified number of rows and columns
        let x = 0;
        let y = 0;
        images.forEach((img, index) => {
          context.drawImage(img, x, y);
          x += img.width;
          if ((index + 1) % numColumns === 0) {
            x = 0;
            y += img.height;
          }
        });

        //if the product of the number of rows and columns is less than the number of images, display an error
        if (
          parseInt(document.getElementById("numRows").value) *
            parseInt(document.getElementById("numColumns").value) <
          images.length
        ) {
          document.getElementById("errors").style.color = "red";
          document.getElementById("errors").innerHTML =
            "The number of rows and columns specified is too low to display all images.";
        } else {
          document.getElementById("errors").innerHTML = "";

          if (
            parseInt(document.getElementById("numRows").value) *
              parseInt(document.getElementById("numColumns").value) >
            images.length
          ) {
            document.getElementById("errors").style.color = "orange";
            document.getElementById("errors").innerHTML =
              "The number of rows and columns specified is too high considering the number of images.";
          } else {
            document.getElementById("errors").innerHTML = "";
          }
        }

        // show error that the might be too many open spacs in the canvas when the number of rows and columns is too high considering the number of images

        imageDisplay.appendChild(canvas);
        canvas.id = "canvas";
      }
    };
  });
};

isOdd = (num) => {
    return num % 2;
}
