import React from 'react';
// import { Button, StatusBar, Image, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, SafeAreaView, createBottomTabNavigator} from 'react-navigation';
import { RNCamera } from 'react-native-camera';
import RNFetchBlob from 'rn-fetch-blob'

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

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
// window.Blob = Blob;

var ImagePicker = require('react-native-image-picker');
var firebase = require("firebase");
var c = require("./src/constants");

const config = {
  apiKey: c.FIREBASE_API_KEY,
  authDomain: c.FIREBASE_AUTH_DOMAIN,
  databaseURL: c.FIREBASE_DATABASE_URL,
  projectId: c.FIREBASE_PROJECT_ID,
  storageBucket: c.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: c.FIREBASE_MESSAGING_SENDER_ID
};

firebase.initializeApp(config);

function uploadImage(path) {
  const imageFile = RNFetchBlob.wrap(path);

  // 'path/to/image' is where you wish to put your image in
  // the database, if you would like to put it in the folder
  // 'subfolder' inside 'mainFolder' and name it 'myImage', just 
  // replace it with 'mainFolder/subfolder/myImage'
  const ref = firebase.storage().ref('image');
  var uploadBlob = null;

  Blob.build(imageFile, { type: 'image/jpg;' })
      .then((imageBlob) => {
          uploadBlob = imageBlob;
          return ref.put(imageBlob, { contentType: 'image/jpg' });
      })
      .then(() => {
          uploadBlob.close();
          return ref.getDownloadURL();
      })
      .then((url) => {
        console.log(url)
          // do something with the url if you wish to
      })
      .catch((error) => {
          console.log(error)
      });
}

class ImagesScreen2 extends React.Component {
  state = {avatarSource: null}

  loadData = (uri) => {
    fetch('http://127.0.0.1:8080/test?file=' + uri)
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

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
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

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        console.log(source)
        this.setState({
          avatarSource: source
        });
        this.loadData(response.uri)
        // uploadImage(response.uri);
        // ref.putString(message, 'data_url').then(function(snapshot) {
        //   console.log('Uploaded a data_url string!');
        // });
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
    Images: ImagesScreen2,
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