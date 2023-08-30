document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission
  const fileInput = document.getElementById("fileInput");
  const selectedFiles = Array.from(fileInput.files);
  const numRows = parseInt(document.getElementById("numRows").value);
  const numColumns = parseInt(document.getElementById("numColumns").value);
  Start(selectedFiles, fileInput, numRows, numColumns);
});

onchange = function (type) {
    const fileInput = document.getElementById("fileInput");
    const selectedFiles = Array.from(fileInput.files);
    const numRows = parseInt(document.getElementById("numRows").value);
    const numColumns = parseInt(document.getElementById("numColumns").value);
    
    //if the 
    
    Start(selectedFiles, fileInput, numRows, numColumns);
};

Start = (selectedFiles, fileInput, numRows, numColumns) => {
  if (selectedFiles.length === 0 || numRows <= 0 || numColumns <= 0) {
    return;
  }
  console.log(selectedFiles);

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
        canvas.width = images[0].width * numColumns;
        canvas.height = images[0].height * numRows;

        // Set the number of rows and columns to the number of images if the specified number is too high
        if (numRows > images.length) {
          numRows = images.length;
        }

        numRows = Math.min(numRows, images.length);
        numColumns = Math.min(numColumns, images.length);
        
        // Draw images to canvas in a grid usingh the specified number of rows and columns
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

        // Create a ZIP archive
        // const zip = new JSZip();
        // const imagesFolder = zip.folder("images");

        // // Convert the combined image to a Blob
        // canvas.toBlob((blob) => {
        //   imagesFolder.file("combined_image.png", blob);

        //   // Generate ZIP and display download link
        //   zip.generateAsync({ type: "blob" }).then(function (content) {
        //     const downloadLink = document.getElementById("downloadLink");
        //     downloadLink.href = URL.createObjectURL(content);
        //     downloadLink.download = "images.zip";
        //     downloadLink.style.display = "block";
        //   });
        // });
        //show the combined image
        imageDisplay.appendChild(canvas);
      }
    };
  });
};
