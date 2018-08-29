import React from "react";

const PredictButton = props => (
  <a className={`button is-link ${props.isLoading}`} onClick={props.predict}>
    Prediction
  </a>
);

export default PredictButton;
