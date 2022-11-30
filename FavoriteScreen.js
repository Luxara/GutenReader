import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, FlatList, Image, Keyboard, TouchableOpacity, DrawerLayoutAndroidBase } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import * as SQLite from 'expo-sqlite';

export default function FavoriteScreen({ route, navigation }) {
    const db = SQLite.openDatabase('GRdb.db');
    const [favlist, setFavlist]= useState(route.params.favlist);
    const[selectedBook, setSelectedBook]=useState('');

    const deleteFav = (id) =>{
      db.transaction(tx => {
          tx.executeSql('delete from favorites where id=?;', [id]);}, null, updateFavList
      )
    }

    const updateFavList = () =>{
      db.transaction(tx => {
        tx.executeSql('select * from favorites;', [], (_, { rows }) => setFavlist(rows._array)
        ); 
      }, null, null);
    }

    const showHome = () =>{
      navigation.navigate('Home');
    }

    const showInfo = (item) =>{
      setSelectedBook(item);
    navigation.navigate('Info',{selectedBook:item},{favlist:favlist});
  }

    useEffect(()=>{
        db.transaction(tx => {
            tx.executeSql('select * from favorites;', [], (_, { rows }) => setFavlist(rows._array)
            ); 
          }, null, null);
    })
      
    return (
    <View style={styles.container}>

    <View style={{flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center', marginTop:30}}>
      <Text>List of your favorites!</Text>
    

    <View style={{flex:3, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
    <FlatList
        keyExtractor={(item=> item.id.toString())}
        renderItem={({item}) =>
        <View style={{marginLeft:10, marginTop:20}}>

        <TouchableOpacity style={{flexDirection:'row', padding:10, borderRadius:7, backgroundColor:'#EAEEE3'}} onPress={()=>showInfo(item)} activeOpacity={0.8}>
          <Image source={{uri: item.image}}
            style={{width: 70, height: 100, objectFit:'cover'}}  />
          <Text
            style={{maxWidth:240, marginLeft:10, fontSize: 14, textAlign:'justify', flexShrink:1,  fontWeight: "bold"}}>{item.title}
          </Text>
          </TouchableOpacity>

          <Text style={{color: 'red'}} onPress={() => deleteFav(item.id)}>DELETE</Text>
          
        </View>}
        data={favlist} />
    </View>
    </View>

    <View style={styles.footer}>
      <Button onPress={showHome} type='clear' titleStyle={{ color: 'white' }}
      containerStyle={{width: 120, marginHorizontal: 20, marginVertical: 0,}}>
        <Icon name="home" color="white"/>HOME</Button>

      <Button disabled={true} type='clear' disabledTitleStyle={{color:'#B4D163'}}
      containerStyle={{width: 120, marginHorizontal: 20, marginVertical: 0,}}>
        <Icon name='grade' color='#B4D163'/>FAVORITES</Button>
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