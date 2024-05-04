import { useEffect, useRef, useState } from "react";
import * as posenet from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs"; // Import TensorFlow.js library

// Define the keypoints for the shirt (adjust as needed)
const SHIRT_KEYPOINTS = {
    leftShoulder: "left_ear",
    rightShoulder: "right_ear",
    leftHip: "left_ear",
    rightHip: "right_ear",
};

const RATIO = 0.34;

interface Props {
    onDetection: (poses: posenet.Pose) => void;
}

const PoseDetectionComponent = ({ onDetection }: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [net, setNet] = useState<posenet.PoseDetector>();
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const [image, setImage] = useState<HTMLImageElement>();

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
                    console.log(
                        videoRef.current!.width,
                        videoRef.current!.videoWidth,
                        canvasRef.current!.width
                    );
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

        let image = new Image();
        image.src = "/glasses.png";
        image.onload = () => {
            setImage(image);
            console.warn("Image loaded");
        };
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
                // console.log(finalPose);

                // Clear canvas
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                // Draw keypoints
                finalPose.keypoints.forEach(({ x, y }) => {
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, Math.PI * 2);
                    ctx.fillStyle = "#FF0000";
                    ctx.fill();
                });

                if (image) {
                    console.warn("Adding image");
                    const style = getImageParams(finalPose.keypoints);
                    ctx.drawImage(
                        image,
                        style.left,
                        style.top,
                        style.width,
                        style.height
                    );
                }
            } catch (error) {
                console.error("Pose estimation error:", error);
            }

            requestAnimationFrame(detectPose);
        };

        detectPose();
    }, [net, ctx, onDetection]);

    const getImageParams = (
        poseData: posenet.Keypoint[]
    ): {
        width: number;
        height: number;
        top: number;
        left: number;
        transform: number;
    } => {
        // Calculate shirt position based on pose data
        const leftShoulder = poseData.find(
            (keypoint) => keypoint.name === SHIRT_KEYPOINTS.leftShoulder
        );
        const rightShoulder = poseData.find(
            (keypoint) => keypoint.name === SHIRT_KEYPOINTS.rightShoulder
        );
        const leftHip = poseData.find(
            (keypoint) => keypoint.name === SHIRT_KEYPOINTS.leftHip
        );
        const rightHip = poseData.find(
            (keypoint) => keypoint.name === SHIRT_KEYPOINTS.rightHip
        );

        if (leftShoulder && rightShoulder && leftHip && rightHip) {
            const shirtWidth = Math.abs(rightShoulder.x - leftShoulder.x) * 1;
            const shirtHeight = Math.abs(rightShoulder.y - leftHip.y) * 1;

            const shirtTop = Math.min(leftShoulder.y, rightShoulder.y);
            const shirtLeft = Math.min(leftShoulder.x, rightShoulder.x);

            const shirtRotation = Math.atan2(
                rightShoulder.y - leftShoulder.y,
                rightShoulder.x - leftShoulder.x
            );

            return {
                width: shirtWidth,
                height: RATIO * shirtWidth,
                top: shirtTop,
                left: shirtLeft,
                transform: shirtRotation,
            };
        }

        return {
            width: 0,
            height: 0,
            top: 0,
            left: 0,
            transform: 0,
        };
    };

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
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    maxWidth: "100%",
                }}
            />
        </div>
    );
};

export default PoseDetectionComponent;
