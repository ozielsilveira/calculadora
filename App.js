import React, { useState } from "react";

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { executeSql } from "./db";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { height: 0, mass: 0, result: 0, resultText: "" }; //this.recuperaDb(); faltou achar um jeito recuperar na inicialização :/
    this.recuperaDb();
    this.calculateIMC = this.calculateIMC.bind(this);
  }

  async recuperaDb() {
    const rs = (
      await executeSql(
        "SELECT height, mass, result FROM calculos ORDER BY id DESC LIMIT 1"
      )
    ).rows._array[0];

    if (!!!rs)
      this.state = {
        height: rs.height,
        mass: rs.mass,
        result: rs.result,
        resultText: this.showResultIMC(rs.result),
      };
    else this.state = { height: 0, mass: 0, result: 0, resultText: "" };
  }

  async insertDb(height, mass, result) {
    try {
      await executeSql(
        "INSERT INTO calculos (height,mass,result) VALUES (?,?,?)",
        [height, mass, result]
      );
    } catch (err) {
      console.error(err);
    }
  }

  calculateIMC() {
    let imc = this.state.mass / (this.state.height * this.state.height);
    let s = this.state;
    s.result = imc;
    s.resultText = this.showResultIMC(imc);
    this.insertDb(s.height, s.mass, s.result);
    this.setState(s);
  }

  showResultIMC(imc) {
    let resultText = "";
    if (imc < 18.5) {
      resultText = "SLIM";
    } else if (imc < 25) {
      resultText = "NORMAL";
    } else if (imc < 30) {
      resultText = "OVERWEIGHT - 1º";
    } else if (imc < 40) {
      resultText = "OBESITY - 2°";
    } else {
      resultText = "OBESITY GRAVE - 3°";
    }
    return resultText;
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputView}>
          <TextInput
            autoCapitalize="none"
            placeholder="HEIGHT"
            keyboardType="numeric"
            style={styles.input}
            onChangeText={(height) => {
              this.setState({ height });
            }}
          />
          <TextInput
            autoCapitalize="none"
            placeholder="MASS"
            keyboardType="numeric"
            style={styles.input}
            onChangeText={(mass) => {
              this.setState({ mass });
            }}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={this.calculateIMC}>
          <Text style={styles.buttontext}>CALCULATE</Text>
        </TouchableOpacity>
        <Text style={styles.result}>{this.state.result.toFixed(2)}</Text>
        <Text style={[styles.result, { fontSize: 20 }]}>
          {this.state.resultText}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  inputView: {
    flexDirection: "row",
  },
  input: {
    height: 80,
    textAlign: "center",
    width: "50%",
    fontSize: 50,
    marginTop: 34,
  },

  button: {
    backgroundColor: "#19103B",
  },

  buttontext: {
    textAlign: "center",
    padding: 30,
    fontSize: 25,
    fontWeight: "bold",
    color: "#BFAEFE",
  },
  result: {
    alignSelf: "center",
    color: "#BFAEFE",
    fontSize: 45,
    fontWeight: "bold",
    padding: 6,
  },
});
