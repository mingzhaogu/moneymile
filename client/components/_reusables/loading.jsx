import React from "react";

export const Loading = ({ children, customClasses }) => (
    <div id="loading-overlay">
        <div className={`loading-content ${customClasses}`}>
            {children}
        </div>
    </div>
);