import React, { useRef, useEffect, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs";

const CameraTextDetector: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
    const [text, setText] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadModel = async () => {
            try {
                const loadedModel = await cocoSsd.load();
                setModel(loadedModel);
            } catch (error) {
                setError("Failed to load model");
            }
        };
        loadModel();
    }, []);

    useEffect(() => {
        const detectPerson = async () => {
            if (!model || !videoRef.current || !canvasRef.current) return;

            const video = videoRef.current;
            const canvas = canvasRef.current;

            try {
                // Get video stream from the camera
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });
                video.srcObject = stream;

                video.onloadedmetadata = () => {
                    video.play();
                    video.width = video.videoWidth;
                    video.height = video.videoHeight;
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    startDetection();
                };
            } catch (error) {
                setError("Failed to access camera or perform detection");
            }
        };

        const startDetection = async () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (!video || !model || !canvas) return;

            const context = canvas.getContext("2d");
            if (!context) return;

            // Start detecting
            const detectFrame = async () => {
                const predictions = await model.detect(video);

                let hasPerson = false;

                if (predictions.length != 0) {
                    console.log(predictions);
                    const filteredPredictions = await filterPredictions(
                        predictions
                    );

                    hasPerson = filteredPredictions.some(
                        (prediction) => prediction.class === "person"
                    );

                    // Clear canvas
                    context.clearRect(0, 0, canvas.width, canvas.height);

                    // Draw rectangle on top of the person if detected
                    if (hasPerson) {
                        const personPrediction = filteredPredictions.find(
                            (prediction) => prediction.class === "person"
                        );
                        if (personPrediction) {
                            const [x, y, width, height] = personPrediction.bbox;

                            // Draw the rectangle
                            context.strokeStyle = "#FF0000"; // Red color
                            context.lineWidth = 2;
                            context.strokeRect(x, y, width, height);
                        }
                    }
                }

                setText(hasPerson ? "Person detected!" : "No person detected");
                requestAnimationFrame(detectFrame);
            };
            detectFrame();
        };

        const filterPredictions = async (
            predictions: cocoSsd.DetectedObject[]
        ) => {
            if (!model || !videoRef.current) return [];

            const scores = predictions.map((prediction) => prediction.score);
            const maxScoresTensor = tf.tensor1d(scores);
            const boxes = predictions.map((prediction) => prediction.bbox);
            const selectedIndices = await tf.image.nonMaxSuppressionAsync(
                tf.tensor2d(boxes),
                maxScoresTensor,
                0.5,
                0.5
            ); // Adjusted IoU threshold
            const selectedPredictions = selectedIndices
                .arraySync()
                ?.map((index: number) => predictions[index]);
            maxScoresTensor.dispose();
            return selectedPredictions || [];
        };

        detectPerson();

        return () => {
            // Clean up
            if (videoRef.current) {
                const stream = videoRef.current.srcObject as MediaStream;
                if (stream) {
                    stream.getTracks().forEach((track) => {
                        track.stop();
                    });
                }
            }
        };
    }, [model]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ position: "relative" }}>
            <video ref={videoRef} style={{ maxWidth: "100%" }}></video>
            <canvas
                ref={canvasRef}
                style={{ position: "absolute", top: 0, left: 0 }}
            ></canvas>
            <p>{text}</p>
        </div>
    );
};

export default CameraTextDetector;
