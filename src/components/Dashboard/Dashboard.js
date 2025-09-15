import React from "react";
import "./DashboardEmbed.css";

const DashboardEmbed = () => {
  return (
    <div className="dashboard-wrapper">
      <h2 className="dashboard-title">📊 Panel de Control - Power BI</h2>
      <div className="dashboard-frame">
        <iframe
          title="Dashboard Power BI"
          src="https://app.powerbi.com/reportEmbed?reportId=80c169e7-0d44-47d1-b604-923f10e99de0&autoAuth=true&ctid=2bac32fd-d9a2-40d9-a272-3a35920f5607&actionBarEnabled=true"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default DashboardEmbed;
