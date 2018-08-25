import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import './stdlib/lib';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state ={ res: "None"};
    this.loadData = this.loadData.bind(this);
  }


  loadData = () => {
    fetch('http://10.0.2.2:8080/test')
    .then(function(response) {
      // console.log(response.body)
      return response.json();
    })
    .then((myJson) => {
      console.log(myJson.zheng)
      console.log(JSON.stringify(myJson.zheng));
      this.setState({ res: JSON.stringify(myJson.zheng) });
    })
    .catch((error) =>{
      console.error(error);
    });
  }
  componentDidMount(){
    this.loadData();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.res}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
