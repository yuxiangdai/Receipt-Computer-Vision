// //Camera component
import Camera from 'react-native-camera';

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const test = search => fetch(`${baseUrl.API_URL}/hotels/search/${search}`, {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
});
export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>

     <Camera 
        ref={cam => {
        this.camera = cam;
        }}
        style={styles.preview}
        aspect={Camera.constants.Aspect.fill}
      >
        <Text style={styles.capture} onPress={this.takePicture.bind(this)}>
          [CAPTURE]
        </Text>
      </Camera>

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

