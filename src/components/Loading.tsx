import React from "react";
import { Spin } from "antd";

export default function Loading() {
    return (
        <div className="loading-spinner">
            <Spin size="default" />
        </div>
    );
}
