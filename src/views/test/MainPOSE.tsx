// MainComponent.jsx
import React, { useState } from "react";
import PoseDetectionComponent from "../../components/PoseDetection";
import ARComponent from "../../components/AR";
import { Pose } from "@tensorflow-models/pose-detection";

const MainComponent = () => {
    const [pose, setPose] = useState<Pose>();

    const handlePoseDetection = (pose: Pose) => {
        setPose(pose);
    };

    return (
        <div>
            <PoseDetectionComponent onDetection={handlePoseDetection} />
            {pose && <ARComponent poseData={pose!.keypoints} />}
        </div>
    );
};

export default MainComponent;
