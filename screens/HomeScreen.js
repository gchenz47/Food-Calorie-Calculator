import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,

} from 'react-native';
import { WebBrowser } from 'expo';
import axios from 'axios';
import {
  SearchBar,
  Text,
  Button,
} from 'react-native-elements'


const API_ID = '970d8f98';
const API_KEY = '18303197f4330ace26534a17026e5ed4';
const temp = [{
  "category": "Generic foods",
  "categoryLabel": "food",
  "foodId": "food_b0bn6w4ab49t55b1o8jsnbq6nm2g",
  "label": "Bananas, raw",
  "nutrients": {
    "CHOCDF": 22.84,
    "ENERC_KCAL": 89,
    "FAT": 0.33,
    "FIBTG": 2.6,
    "PROCNT": 1.09,
  },
  "uri": "http://www.edamam.com/ontologies/edamam.owl#Food_09040",
}];

const tempList =[
  {
    label: 'apple',
    weight: 12,
    calorie: 22,
  },
  {
   label: 'banana',
   weight: 12,
   calorie: 122,
  }
]

export default class HomeScreen extends React.Component {
static navigationOptions = {
  title: 'Calorie Counter',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      width: 300,
    },
  };

  constructor(){
    super();
    this.state={
      foodList:[],
      currentSearchText: '',
      currentFoodInfo: {},
      currentFoodItemWeight: 1,
      currentFoodUnitCalorie: 0,
      totalCalorie: 0,
      showActivityIndicator: false,
      buttonDisabled: true,
    }
  }

  handleSearchFood = () => {
    this.setState({
      showActivityIndicator: true
    })
    http: //www.edamam.com/ontologies/edamam.owl#Measure_kilogram
    axios.get(`https://api.edamam.com/api/food-database/parser?ingr=${this.state.currentSearchText}&app_id=${API_ID}&app_key=${API_KEY}`).then((response) => {
    // console.log(response.data.hints[0].food);
    const unitCalorie = parseInt(response.data.hints[0].food.nutrients.ENERC_KCAL);
    this.setState({
      currentFoodInfo: response.data.hints[0].food,
      currentFoodUnitCalorie: unitCalorie,
      showActivityIndicator: false,
      buttonDisabled: false,
    })
    }).catch(error => {
      console.log('something is wrong with the api call', error)
      alert('please enter a different food name');
      this.setState({
        showActivityIndicator: false,
        currentFoodInfo: {},
        currentFoodUnitCalorie: 0,
      })
    })
  }

  handleAddFood = () => {
    const {foodList, totalCalorie, currentFoodInfo, currentFoodItemWeight, currentFoodUnitCalorie} = this.state;
    const foodInfo = {
      label: currentFoodInfo.label,
      weight: currentFoodItemWeight,
      calorie: currentFoodItemWeight * currentFoodUnitCalorie,
    }
    let newList = [...foodList, foodInfo];
    let sum = newList.reduce((a,food) => {
      return a + food.calorie;
    }, 0);

    this.setState({
      buttonDisabled: true,
      totalCalorie: sum,
      currentFoodItemWeight: 1,
      foodList: newList,
    }, () => {console.log(this.state.foodList)})
  }

  handleWeightUpdate = (text)=> {
    const weight = parseInt(text);
    if (weight){
      this.setState({
        currentFoodItemWeight: weight,
      })
    }else{
      this.setState({
        currentFoodItemWeight: 1,
      })
    }
  }

  render() {
    const {
      container,
      searchBarView,
      foodItemDetailView,
      listTitleView,
      titleBarView,
      listItemView
    } = styles;
    // console.log(this.state.foodList);
    return (
      <View style={container}>
        <View>
          <SearchBar
            lightTheme
            onChangeText = {(text) => {
              this.setState({
                currentSearchText: text,
              })
            }}
            onSubmitEditing = {() => this.handleSearchFood()}
            placeholder = 'Type food name to get calorie information' 
          />
        </View>
        
          
        <View style={foodItemDetailView}>

        <ActivityIndicator size="large" color="#0000ff" animating={this.state.showActivityIndicator}/>
        { !this.state.showActivityIndicator?
          <View>
            <Text style ={{padding: 5}}>Current Selected Food:</Text>
            <Text style ={{padding: 5}}>Label: {this.state.currentFoodInfo.label || null}</Text>
            <Text style ={{padding: 5}}>Calorie: {this.state.currentFoodUnitCalorie || null} kcal/100 gram</Text>
            <TextInput 
              style={{padding: 5, borderColor: 'gray', borderWidth: 1}} 
              placeholder={'Please enter weight in kg'}
              onChangeText={(text) => this.handleWeightUpdate(text)}
            /> 
            <View style={{padding: 5}}>
              <Button 
                disabled={this.state.buttonDisabled}
                title={'Add food to your list'} 
                onPress={() => this.handleAddFood()} 
                titleStyle={{ fontWeight: "700" }}
                buttonStyle={{
                  backgroundColor: "rgba(92, 99,216, 1)",
                  width: 300,
                  height: 45,
                  borderColor: "transparent",
                  borderWidth: 0,
                  borderRadius: 5
                }}
              />
            </View>
          </View>
          : null}
        </View>
         
        
        <View style={{flex: 1}}>  
         <View style={listTitleView}>
            <View style={[titleBarView, {flex: 20}]}>
                <Text>Food Label</Text>
            </View>
            <View style={[titleBarView, {flex: 12}]}>
                <Text>Weight (kg)</Text>
            </View>
            <View style={[titleBarView, {flex: 12,borderRightWidth: 0}]}>
                <Text>Calorie (kcal)</Text>
            </View>
          </View>
          
          <View style={{justifyContent: 'center',}}>
            <FlatList
              data={this.state.foodList}
              extraData={this.state.foodList}
              renderItem = {({item, index}) => {
              console.log('current item',item);
              return (
              <View style = {[listItemView]} key = {index}>
                <View style={[{flex: 20, padding: 5}]}>
                    <Text>{item.label}</Text>
                </View>
                <View style={[{flex: 12, padding: 5}]}>
                    <Text>{item.weight}</Text>
                </View>
                <View style={[{flex: 12, padding: 5}]}>
                    <Text>{item.calorie}</Text>
                </View>
              </View>)
              }}
              keyExtractor = {(item, index) => index.toString()}
            />
            <View style={[{padding: 5, justifyContent:'flex-end', alignItems:'center'}]}>
                    <Text>Total Calorie: {this.state.totalCalorie} kcal</Text>
                </View>
          </View>
         
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBarView: {
    
  },
  foodItemDetailView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#89729E'
  },
  listTitleView: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    //justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CAC6BF'
  },
  titleBarView: {
    paddingLeft: 10,
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: '#CAC6BF',
    justifyContent: 'center',
  },
  listItemView: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#CAC6BF',
    flexDirection: 'row',
  }
});
