import React from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import SignaturePad from "react-signature-pad-wrapper";
import "bulma/css/bulma.css";
import Jimp from "jimp";
import PredictButton from "./components/PredictButton";

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
      "https://raw.githubusercontent.com/yukagil/tfjs-mnist-cnn/master/model/model.json"
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
    const data = this.signaturePad.toDataURL();
    console.log(data);
  }

  predict() {
    const imageData = this.getImageData();
    const accuracyScores = this.getAccuracyScores(imageData);
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
  }

  reset() {
    this.signaturePad.clear();
  }

  render() {
    return (
      <div className="container">
        <h1 className="title" style={{ textAlign: "center" }}>
          MNIST recognition with TensorFlow.js
        </h1>
        <div className="columns is-centered">
          <div className="column is-narrow">
            <SignaturePad
              ref={this.onRef}
              width={280}
              height={280}
              options={{ penColor: "white", backgroundColor: "black" }}
            />
            <div className="field is-grouped">
              <p className="control">
                <PredictButton
                  isLoading={this.state.is_loading}
                  predict={this.predict}
                />
              </p>
              <p className="control">
                <a className="button" onClick={this.reset}>
                  Reset
                </a>
              </p>
            </div>
          </div>
          <div className="column is-3">
            <table className="table">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Accuracy</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>0</th>
                  <td className="accuracy" data-row-index="0">
                    -
                  </td>
                </tr>
                <tr>
                  <th>1</th>
                  <td className="accuracy" data-row-index="1">
                    -
                  </td>
                </tr>
                <tr>
                  <th>2</th>
                  <td className="accuracy" data-row-index="2">
                    -
                  </td>
                </tr>
                <tr>
                  <th>3</th>
                  <td className="accuracy" data-row-index="3">
                    -
                  </td>
                </tr>
                <tr>
                  <th>4</th>
                  <td className="accuracy" data-row-index="4">
                    -
                  </td>
                </tr>
                <tr>
                  <th>5</th>
                  <td className="accuracy" data-row-index="5">
                    -
                  </td>
                </tr>
                <tr>
                  <th>6</th>
                  <td className="accuracy" data-row-index="6">
                    -
                  </td>
                </tr>
                <tr>
                  <th>7</th>
                  <td className="accuracy" data-row-index="7">
                    -
                  </td>
                </tr>
                <tr>
                  <th>8</th>
                  <td className="accuracy" data-row-index="8">
                    -
                  </td>
                </tr>
                <tr>
                  <th>9</th>
                  <td className="accuracy" data-row-index="9">
                    -
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
