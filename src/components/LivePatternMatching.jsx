// import { useRef, useState, useEffect } from "react";
// import Tesseract from "tesseract.js";

// export default function LivePatterMatching() {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const overlayCanvasRef = useRef(null);

//   const [text, setText] = useState("");
//   let isProcessing = false;

//   useEffect(() => {
//     const startCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: { facingMode: "environment" },
//         });
//         videoRef.current.srcObject = stream;
//         videoRef.current.play();
//       } catch (error) {
//         console.error("Error accessing the camera:", error);
//       }
//     };

//     startCamera();
//     const intervalId = setInterval(processFrames, 500); // Process frames at 500ms intervals
//     return () => clearInterval(intervalId);
//   }, []);

//   const processFrames = async () => {
//     if (
//       isProcessing ||
//       !videoRef.current ||
//       !canvasRef.current ||
//       !overlayCanvasRef.current
//     )
//       return;
//     isProcessing = true;

//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");
//     const video = videoRef.current;

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);

//     const dataUrl = canvas.toDataURL("image/png");

//     try {
//       const { data } = await Tesseract.recognize(dataUrl, "eng");
//       const words = data.words;

//       // Define the target pattern to detect
//       const targetPattern = /\b\d{3}-\d{3}-\d{3}\b/; // Matches "100-085-050" pattern
//       const matchedWord = words.find((word) => targetPattern.test(word.text));

//       if (matchedWord) {
//         console.log("Matched Pattern:", matchedWord.text);
//         drawBoundingBoxes([matchedWord]); // Draw bounding box for the matched word
//         setText(matchedWord.text); // Update detected text
//       } else {
//         clearBoundingBoxes();
//         setText(""); // Clear text if no match
//       }
//     } catch (error) {
//       console.error("Error in Tesseract recognition:", error);
//     }

//     isProcessing = false;
//   };

//   const drawBoundingBoxes = (words) => {
//     const overlayCanvas = overlayCanvasRef.current;
//     const overlayContext = overlayCanvas.getContext("2d");
//     overlayCanvas.width = videoRef.current.videoWidth;
//     overlayCanvas.height = videoRef.current.videoHeight;

//     overlayContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

//     words.forEach((word) => {
//       const { x0, y0, x1, y1 } = word.bbox;

//       // Draw bounding box
//       overlayContext.strokeStyle = "yellow"; // Yellow color for matched pattern
//       overlayContext.lineWidth = 12;
//       overlayContext.strokeRect(x0, y0, x1 - x0, y1 - y0);

//       // Draw text label
//       overlayContext.font = "16px Arial";
//       overlayContext.fillStyle = "blue";
//       overlayContext.fillText(word.text, x0, y0 - 5);
//     });
//   };

//   const clearBoundingBoxes = () => {
//     const overlayCanvas = overlayCanvasRef.current;
//     const overlayContext = overlayCanvas.getContext("2d");
//     overlayContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       <video ref={videoRef} style={{ width: "100%", height: "auto" }} />
//       <canvas
//         ref={overlayCanvasRef}
//         style={{ position: "absolute", top: 0, left: 0 }}
//       />
//       <canvas ref={canvasRef} style={{ display: "none" }} />
//       <div style={{ marginTop: "10px", fontSize: "18px", fontWeight: "bold" }}>
//         Detected Text: {text || "No text detected"}
//       </div>
//     </div>
//   );
// }

import { useRef, useState } from "react";
import Tesseract from "tesseract.js";

export default function LivePatternMatching() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);

  const [text, setText] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  let isProcessing = false; // Prevent overlapping processing

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: { exact: "environment" } },
        })
        .catch(() =>
          navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        );
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setIsCameraActive(true);

      // Start processing frames every 500ms
      setInterval(processFrames, 500);
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    videoRef.current.srcObject = null;
    setIsCameraActive(false);
  };

  const processFrames = async () => {
    if (
      isProcessing ||
      !videoRef.current ||
      !canvasRef.current ||
      !overlayCanvasRef.current
    )
      return;
    isProcessing = true;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/png");

    try {
      const { data } = await Tesseract.recognize(dataUrl, "eng");
      const words = data.words;

      // Define the target pattern to detect
      const targetPattern = /\b\d{3}-\d{3}-\d{3}\b/; // Matches "100-085-050" pattern
      const matchedWord = words.find((word) => targetPattern.test(word.text));

      if (matchedWord) {
        console.log("Matched Pattern:", matchedWord.text);
        drawBoundingBoxes([matchedWord]);
        setText(matchedWord.text);
      } else {
        clearBoundingBoxes();
        setText("");
      }
    } catch (error) {
      console.error("Error in Tesseract recognition:", error);
    }

    isProcessing = false;
  };

  const drawBoundingBoxes = (words) => {
    const overlayCanvas = overlayCanvasRef.current;
    const overlayContext = overlayCanvas.getContext("2d");
    overlayCanvas.width = videoRef.current.videoWidth;
    overlayCanvas.height = videoRef.current.videoHeight;

    overlayContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    words.forEach((word) => {
      const { x0, y0, x1, y1 } = word.bbox;

      overlayContext.strokeStyle = "yellow";
      overlayContext.lineWidth = 12;
      overlayContext.strokeRect(x0, y0, x1 - x0, y1 - y0);

      overlayContext.font = "16px Arial";
      overlayContext.fillStyle = "blue";
      overlayContext.fillText(word.text, x0, y0 - 5);
    });
  };

  const clearBoundingBoxes = () => {
    const overlayCanvas = overlayCanvasRef.current;
    const overlayContext = overlayCanvas.getContext("2d");
    overlayContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
  };

  return (
    <div style={{ position: "relative" }}>
      {!isCameraActive ? (
        <button onClick={startCamera} style={{ margin: "10px" }}>
          Open Camera
        </button>
      ) : (
        <button onClick={stopCamera} style={{ margin: "10px" }}>
          Close Camera
        </button>
      )}
      <video
        ref={videoRef}
        style={{
          width: "100%",
          height: "auto",
          display: isCameraActive ? "block" : "none",
        }}
      />
      <canvas
        ref={overlayCanvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: isCameraActive ? "block" : "none",
        }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div style={{ marginTop: "10px", fontSize: "18px", fontWeight: "bold" }}>
        Detected Text: {text || "No text detected"}
      </div>
    </div>
  );
}
