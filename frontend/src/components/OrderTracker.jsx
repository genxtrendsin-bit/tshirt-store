import React from "react";
import "../styles/orderTracker.css";

export default function OrderTracker({ status }) {

  const steps = [
    "Pending",
    "Confirmed",
    "Shipped",
    "Out for Delivery",
    "Delivered"
  ];

  const currentStep = steps.indexOf(status);

  return (

    <div className="order-tracker">

      {steps.map((step, index) => {

        const completed = index <= currentStep;

        return (

          <div key={step} className="tracker-step">

            <div className={`tracker-circle ${completed ? "active" : ""}`}>
              {completed ? "✓" : ""}
            </div>

            <p>{step}</p>

          </div>

        );

      })}

    </div>

  );

}