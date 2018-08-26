import React from 'react';
import { Button, StatusBar, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, SafeAreaView, createBottomTabNavigator} from 'react-navigation';
import { RNCamera } from 'react-native-camera';

var ImagePicker = require('react-native-image-picker');

class ImagesScreen extends React.Component {

  componentDidMount(){
    // More info on all the options is below in the README...just some common use cases shown here
    var options = {
      title: 'Select Avatar',
      customButtons: [
        {name: 'fb', title: 'Choose Photo from Facebook'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    var _this = this;

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source
        });
      }
    });
  }
  render() {
    return (
      <View style={styles.container}>
      </View>
    );
  }

  takePicture = async function() {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options)
      console.log(data.uri);
    }
  };
}

// class ImagesScreen extends React.Component {
//   static navigationOptions = {
//     title: 'Images',
//   };

//   takePicture = async function() {
//     if (this.camera) {
//       const options = { quality: 0.5, base64: true };
//       const data = await this.camera.takePictureAsync(options)
//       console.log(data.uri);
//     }
//   };

//   render() {
//     return (
//       <View style={styles.container}>
//       <RNCamera
//           ref={ref => {
//             this.camera = ref;
//           }}
//           style = {styles.preview}
//           type={RNCamera.Constants.Type.back}
//           flashMode={RNCamera.Constants.FlashMode.on}
//           permissionDialogTitle={'Permission to use camera'}
//           permissionDialogMessage={'We need your permission to use your camera phone'}
//       />
//       <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center',}}>
//       <TouchableOpacity
//           onPress={this.takePicture.bind(this)}
//           style = {styles.capture}
//       >
//       <Text style={{fontSize: 14}}> SNAP </Text>
//       </TouchableOpacity>
//       </View>
//       <Text>Details Screen</Text>
//         <Button
//           title="Home"
//           onPress={() => this.props.navigation.navigate('Home')}
//         />
//         <Button
//           title="List"
//           onPress={() => this.props.navigation.navigate('List')}
//         />
//         <Button
//           title="Images"
//           onPress={() => this.props.navigation.navigate('Images')}
//         />
//       </View>
//     );
//   }
// }

class ListScreen extends React.Component {
  static navigationOptions = {
    title: 'List',
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>List Screen</Text>
        <Button
          title="Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <Button
          title="List"
          onPress={() => this.props.navigation.navigate('List')}
        />
        <Button
          title="Images"
          onPress={() => this.props.navigation.navigate('Images')}
        />
      </View>
    );
  }
}

class HomeScreen extends React.Component {
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
        <Text>Home Screen</Text>
        <Button
          title="Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <Button
          title="List"
          onPress={() => this.props.navigation.navigate('List')}
        />
        <Button
          title="Images"
          onPress={() => this.props.navigation.navigate('Images')}
        />
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


const RootStack = createBottomTabNavigator(
  {
    Home: HomeScreen,
    List: ListScreen,
    Images: ImagesScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}