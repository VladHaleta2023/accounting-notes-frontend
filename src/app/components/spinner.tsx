'use client';

import React from "react";
import "@/styles/spinner.css";

export default function Spinner() {
    return (
        <div className="spinner-container" aria-label="Loading...">
            <div className="spinner" />
        </div>
    );
}