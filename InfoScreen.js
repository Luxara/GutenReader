import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { Button, Icon, Card } from '@rneui/themed';
import * as SQLite from 'expo-sqlite';

export default function InfoScreen({route, navigation }) {
    const {selectedBook}=route.params;
    const db = SQLite.openDatabase('GRdb.db');
    const [favlist, setFavlist]= useState(route.params.favlist); 
  

    const showBook = () =>{
        checkFavs()
      ;
    }

    const compareId=(array)=>{
        let isFavorite = '';
        for (let i = 0; i < array.length; i++) {  
            if(array[i].bookId==selectedBook.bookId){
                isFavorite=true;
                break
            }
            else{
                isFavorite=false;
            }
        }
        navigation.navigate('Reader',{selectedBook:selectedBook, isFavorite:isFavorite})
    }

    const checkFavs =()=>{
        db.transaction(tx=>{
           tx.executeSql('select * from favorites;',[],(_,{rows}) => 
           compareId(rows._array)
           );
        }, null, null);
    }

    const showHome = () =>{
      navigation.navigate('Home');
    }

    const showFavorites = () =>{
      db.transaction(tx => {
        tx.executeSql('select * from favorites;', [], (_, { rows }) => setFavlist(rows._array)
        ); 
      }, null, null);
      navigation.navigate('Favorites', {favlist:favlist});
    }

    let author;
    if (selectedBook.authors=="") {
        author = "Uknown author"
    } else {
        author = selectedBook.authors
    }

    
    return (
    <View style={styles.container}>

    <View style={{flex:1, flexDirection:'column', alignItems:'center', marginTop: 30}}>
       
      <Card >
          <Card.Title style={{width:260}}>{selectedBook.title} </Card.Title>
          <Card.Divider />
          <Card.Image  source={{uri: selectedBook.image}} resizeMode='contain' style={{height:160, marginBottom:20}}/>
          <Text style={{marginBottom:30, alignSelf:'center', fontWeight:'bold', color:'grey'}}>{author}</Text>
          
          <Button onPress={showBook} title='READ' buttonStyle={{backgroundColor:'green'}}/>
      </Card>    

    </View>


    <View style={styles.footer}>
      <Button onPress={showHome} type='clear' titleStyle={{ color: 'white' }}
      containerStyle={{width: 120, marginHorizontal: 20, marginVertical: 0,}}>
        <Icon name="home" color="white"/>HOME</Button>

      <Button type='clear' onPress={showFavorites} titleStyle={{ color: 'white' }}
      containerStyle={{width: 120, marginHorizontal: 20, marginVertical: 0,}}>
        <Icon name='grade' color='white'/>FAVORITES</Button>
    </View>

    <StatusBar style="auto" />
    </View>     
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#CAD0BB',
      alignItems: 'center',
      justifyContent: 'center',
    },
    input:{
      width:200,
      marginBottom:20,
      borderColor:'gray',
      borderWidth:1
    },
    footer:{
      flex: 0,
      flexDirection:'row',
      backgroundColor:'#004107',
      height:50,
      width:'100 %',
      justifyContent:'space-evenly',
      alignItems:'center'
    }
  });