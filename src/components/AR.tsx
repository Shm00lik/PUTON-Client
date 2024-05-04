import React, { useEffect, useState } from "react";
import { Keypoint } from "@tensorflow-models/pose-detection";

// Define the keypoints for the shirt (adjust as needed)
const SHIRT_KEYPOINTS = {
    leftShoulder: "left_shoulder",
    rightShoulder: "right_shoulder",
    leftHip: "left_hip",
    rightHip: "right_hip",
};

interface Props {
    poseData: Keypoint[];
}

const ARShirtComponent = ({ poseData }: Props) => {
    const [shirtStyle, setShirtStyle] = useState({});

    useEffect(() => {
        if (!poseData) return;

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
            const shirtWidth = Math.abs(rightShoulder.x - leftShoulder.x) * 1.5;
            const shirtHeight = Math.abs(rightShoulder.y - leftHip.y) * 1.2;

            const shirtTop = Math.min(leftShoulder.y, rightShoulder.y);
            const shirtLeft = Math.min(leftShoulder.x, rightShoulder.x);

            const shirtRotation = Math.atan2(
                rightShoulder.y - leftShoulder.y,
                rightShoulder.x - leftShoulder.x
            );

            setShirtStyle({
                width: `${shirtWidth}px`,
                height: `${shirtHeight}px`,
                top: `${shirtTop}px`,
                left: `${shirtLeft}px`,
                transform: `rotate(${shirtRotation}rad)`,
            });
        }
    }, [poseData]);

    return (
        <div className="ar-shirt-container">
            <img
                src="/shirt.png"
                alt="Shirt"
                className="ar-shirt"
                style={shirtStyle}
            />
        </div>
    );
};

export default ARShirtComponent;
