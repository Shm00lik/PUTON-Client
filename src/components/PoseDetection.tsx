import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs"; // Import TensorFlow.js library
import * as posenet from "@tensorflow-models/pose-detection";

interface Props {
    onDetection: (poses: posenet.Pose) => void;
}

const PoseDetectionComponent: React.FC<Props> = ({ onDetection }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [net, setNet] = useState<posenet.PoseDetector>();
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const loadPoseNet = async () => {
            await tf.ready();

            const net = await posenet.createDetector(
                posenet.SupportedModels.PoseNet,
                {
                    quantBytes: 4,
                    architecture: "MobileNetV1",
                    outputStride: 16,
                    inputResolution: { width: 500, height: 500 },
                    multiplier: 0.75,
                }
            );

            setNet(net);
        };

        loadPoseNet();

        // Cleanup function
        return () => {
            if (net) {
                net.dispose(); // Dispose the model when the component unmounts
            }
        };
    }, []);

    useEffect(() => {
        if (!videoRef.current) return;

        navigator.mediaDevices
            .getUserMedia({ video: {} })
            .then((stream) => {
                videoRef.current!.srcObject = stream;
                videoRef.current!.onloadedmetadata = () => {
                    videoRef.current!.play();
                    videoRef.current!.width = videoRef.current!.videoWidth;
                    videoRef.current!.height = videoRef.current!.videoHeight;
                    canvasRef.current!.width = videoRef.current!.videoWidth;
                    canvasRef.current!.height = videoRef.current!.videoHeight;
                };
            })
            .catch((error) => {
                console.error("Error accessing webcam:", error);
            });
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return;

        const context = canvasRef.current.getContext("2d");

        if (context) {
            setCtx(context);
        }
    }, []);

    useEffect(() => {
        const detectPose = async () => {
            if (!net || !videoRef.current || !ctx) return;

            const video = videoRef.current;

            try {
                const poses = await net.estimatePoses(video, {
                    maxPoses: 1,
                    flipHorizontal: false,
                });

                const finalPose = [...poses].sort(
                    (a, b) => b.score! - a.score!
                )[0];

                onDetection(finalPose);
                console.log(finalPose);

                // Clear canvas
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                // Draw keypoints
                finalPose.keypoints.forEach(({ x, y }) => {
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, Math.PI * 2);
                    ctx.fillStyle = "#FF0000";
                    ctx.fill();
                });
            } catch (error) {
                console.error("Pose estimation error:", error);
            }

            requestAnimationFrame(detectPose);
        };

        detectPose();
    }, [net, ctx, onDetection]);

    return (
        <div style={{ position: "relative" }}>
            <video
                ref={videoRef}
                style={{ maxWidth: "100%" }}
                width={100}
                height={500}
                autoPlay
            />
            <canvas
                ref={canvasRef}
                style={{ position: "absolute", top: 0, left: 0 }}
            />
        </div>
    );
};

export default PoseDetectionComponent;
