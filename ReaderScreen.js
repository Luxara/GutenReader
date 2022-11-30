import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import {WebView} from 'react-native-webview';
import * as SQLite from 'expo-sqlite';


export default function ReaderScreen({route, navigation }) {
    const{selectedBook}=route.params;
    let {isFavorite}= route.params;
    const [isFav, setisFav]=useState(isFavorite);
    const [addedFav, setAddedFav]=useState(false);
    const [deletedFav, setDeletedFav]=useState(false);

    const db = SQLite.openDatabase('GRdb.db');

    const showUrl=()=>{
        const url= selectedBook.uri;
        return url;
    }

    const addFavorite=()=>{
      let bookId=selectedBook.bookId;
      let title=selectedBook.title;
      let authors=selectedBook.authors;
      let image = selectedBook.image;
      let uri = selectedBook.uri;

      addToDB(bookId, title, authors, image, uri)
      setisFav(true);
      setAddedFav(true);
      setTimeout(()=>{setAddedFav(false)}, 1000);
    }


    const addToDB=(bookId, title, authors, image, uri)=>{
      db.transaction(tx => {
        tx.executeSql('insert into favorites (bookId, title, authors, image, uri) values ( ?, ?, ?, ?, ?);', [bookId, title, authors, image, uri ]);
          }, null, null)
    }
    

    const deleteFavorite = () =>{
      let id = selectedBook.bookId
      deleteFromDB(id)
      setisFav(false)
      setDeletedFav(true);
      setTimeout(()=>{setDeletedFav(false)}, 1000);
    }

    const deleteFromDB = (id) =>{
      db.transaction(tx => {
          tx.executeSql('delete from favorites where bookId=?;', [id]);
        }, null, null)
    }
    

    return (

    <View style={{ flex: 1}}>
        <WebView
    source={{uri:showUrl()}}
    style={{ flex: 1, marginTop: 20 }}
      /> 

    <View style={styles.notice}>{addedFav==true ?(<Text style={{color:'green'}}>Book was added to favorites</Text>):("")}</View>
    <View style={styles.notice}>{deletedFav==true ?(<Text style={{color:'red'}}>Book was deleted from favorites</Text>):("")}</View>

    <View style={styles.webOverlay}>
      {isFav==false ?
      (<Button type='clear' title="ADD FAV" onPress={addFavorite}><Icon name='star-outline' size={36} iconStyle={{ backgroundColor:'green',color:'white', borderRadius:5}} /></Button>):
    (<Button type='clear' title="DELETE FAV" onPress={deleteFavorite}><Icon name='star' size={36} iconStyle={{ backgroundColor:'green',color:'#B4D163', borderRadius:5}} /></Button>)}
    
    </View> 
   </View>
        
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    input:{
      width:200,
      marginBottom:20,
      borderColor:'gray',
      borderWidth:1
    },
    webOverlay: {
        position:'absolute',
        top:0,
        right:-6,
        width: Dimensions.get('window').width,
        alignItems:'flex-end', 
      },
    notice:{
      position:'absolute',
      top:0,
      left:10,
      alignItems:'center'
    }
  });