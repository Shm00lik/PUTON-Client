import { useEffect, useRef, useState } from "react";
import * as posenet from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs"; // Import TensorFlow.js library
import { Product } from "../utils/Product";
import { MovingAverage } from "../utils/Utils";

// Define the keypoints for the shirt (adjust as needed)
const KEYPOINTS = {
    leftEye: "left_eye",
    rightEye: "right_eye",
};

interface Props {
    product: Product | null;
}

const movingAverageRX = new MovingAverage(5);
const movingAverageRY = new MovingAverage(5);
const movingAverageLX = new MovingAverage(5);
const movingAverageLY = new MovingAverage(5);

const PoseDetectionComponent = ({ product }: Props) => {
    if (!product) {
        return null;
    }

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

                // Clear canvas
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                // Draw keypoints
                finalPose.keypoints.forEach(({ x, y, name }) => {
                    if (name === KEYPOINTS.leftEye) {
                        movingAverageLX.add(x);
                        movingAverageLY.add(y);
                    }

                    if (name === KEYPOINTS.rightEye) {
                        movingAverageRX.add(x);
                        movingAverageRY.add(y);
                    }

                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, Math.PI * 2);
                    ctx.fillStyle = "#FF0000";
                    ctx.fill();
                });

                if (product.image) {
                    const imageParams = getImageParams(finalPose.keypoints);

                    drawImage(
                        ctx,
                        product.image,
                        imageParams.pointOnImage,
                        imageParams.pointOnCanvas,
                        imageParams.width,
                        imageParams.height,
                        imageParams.angle
                    );
                }
            } catch (error) {
                console.error("Pose estimation error:", error);
            }

            requestAnimationFrame(detectPose);
        };

        detectPose();
    }, [net, ctx]);

    const getImageParams = (
        poseData: posenet.Keypoint[]
    ): {
        width: number;
        height: number;
        pointOnImage: { x: number; y: number };
        pointOnCanvas: { x: number; y: number };
        angle: number;
    } => {
        // Calculate glasses position based on pose data
        const leftEye = {
            x: movingAverageLX.calculate(),
            y: movingAverageLY.calculate(),
        };

        const rightEye = {
            x: movingAverageRX.calculate(),
            y: movingAverageRY.calculate(),
        };

        if (leftEye && rightEye) {
            const detectedEyeToEye = Math.hypot(
                leftEye.x - rightEye.x,
                leftEye.y - rightEye.y
            );

            const imageEyesWidth = Math.hypot(
                product.leftEye.x - product.rightEye.x,
                product.leftEye.y - product.rightEye.y
            );

            const ratio = detectedEyeToEye / imageEyesWidth;

            const rotation = Math.atan2(
                leftEye.y - rightEye.y,
                leftEye.x - rightEye.x
            );

            return {
                width: ratio * product.image.width,
                height: ratio * product.image.height,
                pointOnImage: {
                    x: (product.rightEye.x + product.leftEye.x) / 2,
                    y: (product.rightEye.y + product.leftEye.y) / 2,
                },
                pointOnCanvas: {
                    x: (rightEye.x + leftEye.x) / 2,
                    y: (rightEye.y + leftEye.y) / 2,
                },
                angle: rotation,
            };
        }

        return {
            width: 0,
            height: 0,
            pointOnImage: {
                x: 0,
                y: 0,
            },
            pointOnCanvas: {
                x: 0,
                y: 0,
            },
            angle: 0,
        };
    };

    const drawImage = (
        ctx: CanvasRenderingContext2D,
        image: HTMLImageElement,
        pointOnImage: { x: number; y: number },
        pointOnCanvas: { x: number; y: number },
        width: number,
        height: number,
        angle: number
    ) => {
        // Save the current transformation matrix
        ctx.save();

        // Translate the canvas origin to the desired position on the canvas
        ctx.translate(pointOnCanvas.x, pointOnCanvas.y);

        // Rotate the canvas context by the desired angle
        ctx.rotate(angle);

        // Calculate the scale factors to fit the image to the desired width and height
        const scaleX = width / image.width;
        const scaleY = height / image.height;

        // Calculate the position of the image point relative to the canvas point
        const offsetX = pointOnImage.x * scaleX - width; // Offset of the image point from the center of the scaled image
        const offsetY = pointOnImage.y * scaleY - height; // Offset of the image point from the center of the scaled image

        // Draw the scaled and rotated image at the desired position on the canvas
        ctx.drawImage(image, offsetX, offsetY, width, height);

        // Restore the original transformation matrix
        ctx.restore();
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
