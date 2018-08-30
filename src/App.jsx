import React from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import SignaturePad from "react-signature-pad-wrapper";
import "bulma/css/bulma.css";
import { BrowserView, MobileView } from "react-device-detect";
import PredictButton from "./components/PredictButton";
import ResetButton from "./components/ResetButton";
import AccuracyTable from "./components/AccuracyTable";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      is_loading: "is-loading",
      model: null
    };
    this.onRef = this.onRef.bind(this);
    this.getImageData = this.getImageData.bind(this);
    this.getAccuracyScores = this.getAccuracyScores.bind(this);
    this.predict = this.predict.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    tf.loadModel(
      "https://raw.githubusercontent.com/tsu-nera/tfjs-mnist-study/master/model/model.json"
    ).then(model => {
      this.setState({
        is_loading: "",
        model
      });
    });
  }

  onRef(ref) {
    this.signaturePad = ref;
  }

  getAccuracyScores(imageData) {
    const scores = tf.tidy(() => {
      // convert to tensor (shape: [width, height, channels])
      const channels = 1;
      let input = tf.fromPixels(imageData, channels);

      // normalized
      input = tf.cast(input, "float32").div(tf.scalar(255));

      // reshape input format (shape: [batch_size, width, height, channels])
      input = input.expandDims();
      // predict
      return this.state.model.predict(input).dataSync();
    });
    return scores;
  }

  getImageData() {
    return new Promise(resolve => {
      const context = document.createElement("canvas").getContext("2d");

      const image = new Image();
      const width = 28;
      const height = 28;

      image.onload = () => {
        context.drawImage(image, 0, 0, width, height);
        const imageData = context.getImageData(0, 0, width, height);

        for (let i = 0; i < imageData.data.length; i += 4) {
          const avg =
            (imageData.data[i] +
              imageData.data[i + 1] +
              imageData.data[i + 2]) /
            3;
          imageData.data[i] = avg;
          imageData.data[i + 1] = avg;
          imageData.data[i + 2] = avg;
        }
        resolve(imageData);
      };

      image.src = this.signaturePad.toDataURL();
    });
  }

  predict() {
    this.getImageData()
      .then(imageData => this.getAccuracyScores(imageData))
      .then(accuracyScores => {
        const maxAccuracy = accuracyScores.indexOf(
          Math.max.apply(null, accuracyScores)
        );
        const elements = document.querySelectorAll(".accuracy");
        elements.forEach(el => {
          el.parentNode.classList.remove("is-selected");
          const rowIndex = Number(el.dataset.rowIndex);
          if (maxAccuracy === rowIndex) {
            el.parentNode.classList.add("is-selected");
          }
          el.innerText = accuracyScores[rowIndex];
        });
      });
  }

  reset() {
    this.signaturePad.instance.clear();
    const elements = document.querySelectorAll(".accuracy");
    elements.forEach(el => {
      el.parentNode.classList.remove("is-selected");
      el.innerText = "-";
    });
  }

  render() {
    return (
      <div className="container">
        <h1 className="title" style={{ textAlign: "center" }}>
          MNIST recognition with TensorFlow.js
        </h1>
        <div className="columns is-centered">
          <div className="column is-3">
            <BrowserView>
              <SignaturePad
                ref={this.onRef}
                width={280}
                height={280}
                options={{
                  minWidth: 6,
                  maxWidth: 6,
                  penColor: "white",
                  backgroundColor: "black"
                }}
              />
            </BrowserView>
            <MobileView>
              <SignaturePad
                width={100}
                height={100}
                ref={this.onRef}
                options={{
                  minWidth: 6,
                  maxWidth: 6,
                  penColor: "white",
                  backgroundColor: "black"
                }}
              />
            </MobileView>
            <div className="field is-grouped">
              <PredictButton
                className="control"
                isLoading={this.state.is_loading}
                predict={this.predict}
              />
              <ResetButton className="control" reset={this.reset} />
            </div>
          </div>
          <div className="column is-3">
            <AccuracyTable />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
