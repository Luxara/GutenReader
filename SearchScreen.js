import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, FlatList, Image, Keyboard, TouchableOpacity, } from 'react-native';
import { Input, Button, Icon } from '@rneui/themed';
import * as SQLite from 'expo-sqlite';

export default function SearchScreen({ navigation }) {
    const[keyword, setKeyword]=useState('');
    const[results, setResults]=useState([]);
    const[selectedBook, setSelectedBook]=useState('');
    const db = SQLite.openDatabase('GRdb.db');
    const [favlist, setFavlist] = useState();
    const [noResults, setNoResults]=useState(false);
    
  
    const searchBooks = () =>{
      Keyboard.dismiss()
      fetch('https://gutendex.com/books/?search='+keyword)
      .then(response=> response.json())
      .then (data => setData(data.results))
      .catch(error =>{
        Alert.alert('Error occurred', error);
      });
    }

    const setData=(data) =>{
      if (data.length>0){
        setNoResults(false)
      } else{
        setNoResults(true)
      }
      setResults(data)
    }

  const showInfo = (item) =>{
    let authors='';
    for (let i = 0; i < item.authors.length; i++) {
      authors=authors+' '+item.authors[i].name
    }

    let book={
      bookId:item.id,
      title:item.title,
      authors:authors,
      image:item.formats['image/jpeg'],
      uri: item.formats['text/html'],
    }
    setSelectedBook(book);
  navigation.navigate('Info',{selectedBook:book},{favlist:favlist});
}

    const showFavorites = () =>{
      db.transaction(tx => {
        tx.executeSql('select * from favorites;', [], (_, { rows }) => setFavlist(rows._array)
        ); 
      }, null, null);
      navigation.navigate('Favorites', {favlist:favlist});
    }


    const dbCreated=()=>{
        db.transaction(tx => {
          tx.executeSql('select * from favorites;', [], (_, { rows }) => setFavlist(rows._array)
          ); 
        }, null, null);
      }
    

    useEffect(() => {  
      db.transaction(tx => {
        tx.executeSql('create table if not exists favorites (id INTEGER PRIMARY KEY AUTOINCREMENT, bookId INT, title TEXT, authors TEXT, image TEXT, uri TEXT);');  
      }, null, dbCreated);
    }, []);

    
    return (
    <View style={styles.container}>
    
    <View style={{flex:1}}>
    <View style={{flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center', marginTop:30}}>
      <Input inputContainerStyle={styles.input} placeholder='Search books by keyword'
       rightIcon={<Icon name='search'size={30}color='gray'/>} onChangeText={keyword =>setKeyword(keyword)} value={keyword}/>
      <Button onPress={searchBooks} title='SEARCH' buttonStyle={{backgroundColor:'#004107'}}/>
    </View>
    
    
    <View style={{flex:3, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
      {noResults?(<Text style={{marginTop:20, fontWeight:'bold'}}>Your search yielded no results.</Text>):(null)}
    <FlatList
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) =>
        <View style={{marginLeft:10, marginTop:20}}>
            <TouchableOpacity style={{flexDirection:'row', padding:10, borderRadius:7, backgroundColor:'#EAEEE3'}} onPress={()=>showInfo(item)} activeOpacity={0.8}>
          <Image source={{uri: item.formats['image/jpeg']}}
            style={{width: 70, height: 100, objectFit:'cover'}}  />
          <Text
            style={{maxWidth:240, marginLeft:10, fontSize: 14, textAlign:'justify', flexShrink:1,  fontWeight: "bold"}}>{item.title}
          </Text>
          </TouchableOpacity>  
        </View>}
        data={results} />
    </View>
    </View>

    <View style={styles.footer}>
      <Button disabled={true}  type='clear' titleStyle={{ color: 'white' }}
      disabledTitleStyle={{color:'#B4D163'}}
      containerStyle={{width: 120, marginHorizontal: 20, marginVertical: 0,}}>
        <Icon name="home" color="#B4D163"/>HOME</Button>

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
      alignSelf:'center',
      width:250,
      marginBottom:20,
      borderColor:'gray',
      borderWidth:1,
      borderRadius:5,
      backgroundColor:'white',
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