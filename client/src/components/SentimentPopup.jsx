// D:\MiniProject\CampusConnectAi\client\src\components\SentimentPopup.jsx

import React, { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./SentimentPopup.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const SentimentPopup = ({ popupData, onClose }) => {
  useEffect(() => {
    try {
      console.log("SentimentPopup mounted with popupData:", popupData);
      if (!popupData) {
        console.warn("No popupData provided");
      } else if (!popupData.stats) {
        console.warn("popupData.stats is missing or invalid");
      }
    } catch (error) {
      console.error("Error during SentimentPopup mount check:", error);
    }
  }, [popupData]);

  if (!popupData || !popupData.stats) {
    console.error("SentimentPopup rendering aborted: missing popupData or stats");
    return null;
  }

  try {
    const { stats, message, event, filePath } = popupData;

    if (
      typeof stats.positive !== "number" ||
      typeof stats.neutral !== "number" ||
      typeof stats.negative !== "number"
    ) {
      console.error("Invalid stats data:", stats);
      return (
        <div className="sentiment-popup-error">
          <p>Error: Invalid sentiment stats data received.</p>
          <button onClick={onClose}>Close</button>
        </div>
      );
    }

    const total = stats.positive + stats.neutral + stats.negative;
    if (total === 0) {
      console.warn("Sentiment stats total is zero, cannot compute percentages");
    }
    const success = total > 0 ? ((stats.positive / total) * 100).toFixed(0) > 65 : false;

    const data = {
      labels: ["Positive", "Neutral", "Negative"],
      datasets: [
        {
          data: [stats.positive, stats.neutral, stats.negative],
          backgroundColor: ["#00ffab", "#ffea00", "#ff4b5c"],
          borderColor: ["#00ffab", "#ffea00", "#ff4b5c"],
          borderWidth: 1,
        },
      ],
    };

    return (
      <div className="sentiment-popup-overlay">
        <div className="sentiment-popup-card">
          <button className="popup-close-btn" onClick={onClose}>
            ✖
          </button>
          <h2>Sentiment Analysis for {event}</h2>
          <p>{message}</p>
          <div className="chart-container">
            <Pie data={data} />
          </div>
          {success && <p className="success-msg">Event was a success!</p>}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error while rendering SentimentPopup:", error);
    return (
      <div className="sentiment-popup-error">
        <p>An unexpected error occurred while displaying sentiment analysis.</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  }
};
export default SentimentPopup;
