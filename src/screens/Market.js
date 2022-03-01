import { Text, View, FlatList, TouchableOpacity, Image, SafeAreaView, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { globalStyles } from '../assets/styles/GlobalStyles';
import firestore from '@react-native-firebase/firestore';
import Carousel from 'react-native-snap-carousel'

const Market = ({navigation, route}) => {

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 6 / 4);

  // 
  const [artist, setArtist] = useState([]);
  
  const getArtist = () => {
    return firestore().collection('artists').onSnapshot((snapShot) => {
      const allArtists = snapShot.docs.map(docSnap => docSnap.data());
      
      setArtist(allArtists)
    })
  }
  useEffect(() => {
    let isMounted = true;
     getArtist();
    return () => {
      isMounted = false;
    }
  }, [])

  //
  const [state, setState] = useState()

  //
  const _renderItem = ({item, index}) => {
    return (
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('ArtPreview', {artistUid: item.artistUid})}>
          <Image
            source={{uri: item.artUrl}}
            style={{width: ITEM_WIDTH, height: ITEM_HEIGHT, borderRadius: 16}}
          />
          <View style={{backgroundColor: 'rgba(16, 18, 27, 0.5)', height: 65, position: 'absolute', borderRadius: 16, bottom: 8, left: 8, right: 8, justifyContent: 'center'}}>
            <Text style={globalStyles.artNameTxt}>{item.artName}</Text>
            <Text style={globalStyles.artTypeTxt}>{item.artType}</Text>
          </View>
        
        </TouchableOpacity>
      </View>
    )
  }

  // 
  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.homeBody}>
      <SafeAreaView style={{
          width: '100%',
          alignItems: 'center',
          alignSelf: 'center',
        }}
      >
        <Carousel
          data = {artist}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          renderItem= {_renderItem}
          onSnapToItem={(index) => setState({ index })}
          useScrollView={true}
        />
      </SafeAreaView>
  </View>
  
        {/*  */}
        <View style={globalStyles.homeFooter}>
            <FlatList
              horizontal
              // bounces={false}
              showsHorizontalScrollIndicator={false}
              data={artist}
              keyExtractor={item => `${item.artistUid}`}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity onPress={() => navigation.navigate('ArtistProfile', { artistDescription: item.description, artistUid: item.artistUid, artistPhoto: item.artistPhoto, artistName: item.artistName})}>
                    <View style={{paddingHorizontal: 10}}>
                      <Image 
                        source={{uri: item.artistPhoto}} 
                        style={globalStyles.artistImage}
                      />
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
        </View>
    </View>
  );
};

export default Market;