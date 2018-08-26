import React from 'react';
// import { Button, StatusBar, Image, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, SafeAreaView, createBottomTabNavigator} from 'react-navigation';
import { RNCamera } from 'react-native-camera';
import RNFetchBlob from 'rn-fetch-blob'
//import FirebaseClient from 'FirebaseClient';
var ImagePicker = require('react-native-image-picker');

import {
  Button,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PixelRatio,
  TouchableOpacity,
  Image,
} from 'react-native';

// const Blob = RNFetchBlob.polyfill.Blob;
// const fs = RNFetchBlob.fs;
// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
// window.Blob = Blob;

// var ImagePicker = require('react-native-image-picker');
// // var firebase = require("firebase");

// function uploadImage(uri, mime = 'application/octet-stream') {
//   return new Promise((resolve, reject) => {
//     const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
//     let uploadBlob = null

//     const imageRef = FirebaseClient.storage().ref('images').child('image_001')

//     fs.readFile(uploadUri, 'base64')
//       .then((data) => {
//         return Blob.build(data, { type: `${mime};BASE64` })
//       })
//       .then((blob) => {
//         uploadBlob = blob
//         return imageRef.put(blob, { contentType: mime })
//       })
//       .then(() => {
//         uploadBlob.close()
//         return imageRef.getDownloadURL()
//       })
//       .then((url) => {
//         resolve(url)
//       })
//       .catch((error) => {
//         reject(error)
//     })
//   })
// }


class ImagesScreen extends React.Component {
  state = {avatarSource: null}

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };
        //github.com/dailydrip/react-native-firebase-storage.git
        var data = new FormData();  
        data.append('my_photo', {  
          uri: String(response.uri), // your file path string
          name: 'my_photo.jpg',
          type: 'image/jpg'
        });

          fetch('http://127.0.0.1:8080/asdf', {  
            method: 'POST',
            body: data,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data'
            }
            }).catch((e)=> {
              console.log("error", e);
            });
        
        // uploadImage(response.uri);
        this.setState({
          avatarSource: source
        });
      }
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
          <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
          { this.state.avatarSource === null ? <Text>Select a Photo</Text> :
            <Image style={styles.avatar} source={this.state.avatarSource} />
          }
          </View>
        </TouchableOpacity>
        <Text> {this.state.avatarSource === null ? <Text>zhengli</Text> : this.state.avatarSource.uri } </Text>  
        <Text> {this.state.res } </Text>
        <Text> {this.state.res } </Text>   
      </View>
    );
  }
}

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
    fetch('http://127.0.0.1:8080/test')
    // fetch('http://10.254.194.2:8080/test')
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  }
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