import React from 'react';
import { Button, StatusBar, StyleSheet, Text, View, FlatList, Image} from 'react-native';
import { createStackNavigator, SafeAreaView, createBottomTabNavigator} from 'react-navigation';

class ImagesScreen extends React.Component {
  static navigationOptions = {
    title: 'Images',
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
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

class ListScreen extends React.Component {
  static navigationOptions = {
    title: 'List',
  };

  render() {

    // let data = [
    //   {piece: 'Beef', price: 1.00},
    //   {piece: 'Salmon', price: 5.36},
    //   {piece: 'Mango Juice', price: 3.21},
    //   {piece: 'Beer', price: 100.00}
    // ];

    return (
      //<View>
        /* <View style = {styles.container}>
          <Text>List Screen</Text>
        </View> */
          
        <View style={{flex: 1, 
                      alignItems: 'center', 
                      justifyContent: 'flex-start',
                      width: 500, height: 500
                      }}>
          <FlatList
            data={[
              {piece: 'Beef', price: 1.00},
              {piece: 'Salmon', price: 5.36},
              {piece: 'Mango Juice', price: 3.21},
              {piece: 'Beer', price: 100.00}
            ]}
            renderItem={({item}) => <Text style={styles.item}>{item.piece}</Text>}
          /> 

        </View>


      //</View>
        
        /* <View style = {styles.pricecontainer}>
          <FlatList
            data={[
              {piece: 'Beef', price: 1.00},
              {piece: 'Salmon', price: 5.36},
              {piece: 'Mango Juice', price: 3.21},
              {piece: 'Beer', price: 100.00}
            ]}
            renderItem={({item}) => <Text style={styles.item}> -- $ {item.price}</Text>}
          /> 
        </View> */

      //</View> 
  
    );
  }
}

class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.state ={ res: null};
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
        <Image style={styles.logo}
          source={require('./logo.png')}
        />
        {this.state.res ? <Text>{this.state.res}</Text> : null}
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
  logo:{
    height:100,
    width:100
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