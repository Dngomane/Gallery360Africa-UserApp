import { View, Text, FlatList, Dimensions, TouchableWithoutFeedback, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { globalStyles } from '../assets/styles/GlobalStyles';
import CommentsModal from './CommentsModal';
import firestore from '@react-native-firebase/firestore';
// icons
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ArtPreview = ({route, navigation}) => {

  const [isModalVisible, setModalVisible] = React.useState(false);

  const { artistUid } = route.params;

  const [post, setPost] = useState(null);
  const [like, setLike] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

    const onLikePress = (likes, artKey) => {
    const likesToAdd = isLiked ? -1 : 1;
    // setPost({
    //   ...post,
    //   likes: likes + likesToAdd,
    // });
  firestore().collection("Market").doc(artKey).update({
      likes: likes + likesToAdd,
    }).then(() =>{
      if(artKey) {
        setIsLiked(!isLiked);
      }
      if (!artKey) {
        setIsLiked(isLiked);
      }
      }).catch((error) => alert(error));
    
  };
  // 
  const getArtDetails = () => {
  
    return firestore()
      .collection('Market')
      .where("ArtistUid", "==", artistUid).onSnapshot((snapShot) => {
        const query = snapShot.docs.map((documentSnap) =>
          documentSnap.data()
        );
        setPost(query);
      });
    }
  useEffect(() => {
    let isMounted = true;
    getArtDetails();
    return () => {
      isMounted = false;
    }
}, []);

  return (
    <View
      style={{ height: Dimensions.get('window').height - 1}}
    >
      <FlatList
        data={post}
        keyExtractor={item => `${item.ImageUid}`}
        renderItem={({item}) => {
          return (
            <View style={globalStyles.tikTokContainer}>
              <TouchableWithoutFeedback>
                 <Image 
                  source={{uri: item.artUrl}} 
                  resizeMode="cover" 
                  style={globalStyles.video}
                />
              </TouchableWithoutFeedback>

              <View style={globalStyles.topIconView}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Market')}
                  style={globalStyles.topLeftIcon}
                >
                  <Entypo 
                    name="chevron-thin-left"
                    size={22}
                    color={'#FFFFFF'}
                    style={{alignSelf: 'center', marginVertical: 10}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Cart')}
                  style={globalStyles.cartIcon}
                >
                  <MaterialCommunityIcons
                    name="cart"
                    size={24}
                    color={'#FFFFFF'}
                    style={{alignSelf: 'center', marginVertical: 10}}
                  />
                </TouchableOpacity>
              </View>             
        
              <View style={globalStyles.uiContainer}>
              {isModalVisible &&
                 <CommentsModal
                 post={artistUid}
                   isVisible={isModalVisible}
                   onClose={() => setModalVisible(false)}
                />
              }
                <View style={globalStyles.rightContainer}>
                  <TouchableOpacity 
                    style={{marginVertical: 12}}
                  >
                    <SimpleLineIcons name="user-follow" size={24} color={'#FFFFFF'} />
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={{marginVertical: 12}}
                    onPress={() => setModalVisible(true)} 
                    activeOpacity={0.5}
                  >
                    <Fontisto name="comments" size={24} color={'#FFFFFF'} />
                    <Text style={{color: '#FFFFFF'}}>12.5K</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{marginVertical: 12}}  onPress={() => onLikePress(item.likes, item.ImageUid)}>
                  <AntDesign name="heart" size={24} color={isLiked ? 'red' : 'white'} />
                  <Text style={{color: '#FFFFFF'}}>{item.likes}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{marginVertical: 12}}>
                    <MaterialIcons
                      name="add-shopping-cart"
                      size={34}
                      color={'#FFFFFF'}
                    />
                  </TouchableOpacity>
                </View>
        
                <View style={globalStyles.bottomContainer}>
                  <View
                    blur="51"
                    transparant={true}
                    style={globalStyles.secondBottomContainer}
                  >
                    <View style={globalStyles.viewArtist}>
                      <Image 
                        source={{uri: item.artistPhoto}} 
                        style={globalStyles.artistImg} 
                      />
                      <View
                        style={{marginHorizontal: 10, marginVertical: 6, width: '80%'}}
                      >
                        <TouchableOpacity>
                          <Text style={globalStyles.artistName}>{item.artistName}</Text>
                          <Text 
                            style={{fontFamily: 'Poppins', color: '#F5F5F5'}}
                          >
                            {item.artType}
                          </Text>
                        </TouchableOpacity>

                        <Text style={globalStyles.price}>{item.price}</Text>
                      </View>
                    </View>
                    
                    <View style={globalStyles.viewDescription}>
                      <Text 
                        style={{color: '#F5F5F5'}}
                      >
                        {item.description}
                      </Text>
                    </View>
                  </View>         
                </View>
            </View>
        </View>
        );}}

        showsVerticalScrollIndicator={false}
        snapToInterval={Dimensions.get('window').height}
        snapToAlignment={'start'}
        decelerationRate={'fast'}
      />
  </View>
  );
}

export default ArtPreview;
