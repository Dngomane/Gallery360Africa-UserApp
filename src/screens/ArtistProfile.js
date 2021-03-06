import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, ImageBackground, StyleSheet, FlatList, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { globalStyles } from "../assets/styles/GlobalStyles";
import { Toast } from "react-native-toast-message/lib/src/Toast";
// icons
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import YoutubePlayer from 'react-native-youtube-iframe';
import WebView from 'react-native-webview';

const ArtistProfile = ({route, navigation}) => {

  const [playing, setPlaying] = useState(false);
  const [isMute, setMute] = useState(false);
  const [followingBoolean ,setFollowingBoolean] =useState(false);
  const [following, setFollowing] = useState("");
  const [photoURL, setPhotoURL] = useState(null);
  const [FullName, setFullName] = useState(null);
  const [size, setSize] = useState(0);

  const { artistUid, photoUrl, artistName, description } = route.params;



  const controlRef = useRef();
  const onStateChange = (state) => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
    if (state !== 'playing') {
      setPlaying(false);
    }
  };

  const togglePlaying = () => {
    setPlaying((prev) => !prev);
  };

  const seekBackAndForth = (control) => {
    console.log('currentTime');
    controlRef.current?.getCurrentTime().then((currentTime) => {
      control === 'forward'
        ? controlRef.current?.seekTo(currentTime + 15, true)
        : controlRef.current?.seekTo(currentTime - 15, true);
    });
  };

  const muteVideo = () => setMute(!isMute);
  const ControlIcon = ({name, onPress}) => (
    <Icon onPress={onPress} name={name} size={30} color="#fff" />
  );

  // 
  const[art, setArt] = useState(null)
  const getArt = () => {
    return firestore().collection('Market').where("ArtistUid", "==", artistUid).onSnapshot((snapshot) => {
      const allArt = snapshot.docs.map(docSnap => docSnap.data());
      setArt(allArt);
    }) 
  }

  const onFollow = () => {
    return firestore().collection("following").doc(artistUid).set({
      artistUid: artistUid,
    }).then(() => { 
      onFollowing(artistUid);
  
  }).catch((error) => console.log(error));
  
  }
  
  const onFollowing = () => {
    const uuid = auth().currentUser.uid;
    return firestore()
    .collection('following')
    .doc(artistUid)
    .collection('userFollowing')
    .doc(uuid)
    .set({
      uuid: uuid,
      artistUid: artistUid,
      photo: photoURL,
      artistPhoto: photoUrl,
      fullName:FullName,
      artistName: artistName
    })
    .then(() => {
      Toast.show({
        type: 'success',
        text2: `You're now Following ${artistName}`
      })
    }).catch((error) => {
      alert(error)
    });
  }
  
  const onUnFollowing = () => {
    const uuid = auth().currentUser.uid;
  
   return firestore()
    .collection('following')
    .doc(artistUid)
    .collection('userFollowing')
    .doc(uuid)
    .delete()
    .then(() => {
      Toast.show({
        type: 'error',
        text2: `You're no longer following ${artistName}`
      })
    }).catch((error) => {
      alert(error)
    });
  
  }
  
  const followState = () => {
    const uid = auth().currentUser.uid;
  
    return firestore().collection("following").where("artistUid", "==", artistUid).onSnapshot((snapShot1) => {
      snapShot1.docs.map((doc) => {
        doc.ref.collection("userFollowing").where("uuid", "==", uid).onSnapshot((snapShot) => {
        const follows = snapShot.docs.map((docSnap) => docSnap.data().artistUid);
        console.log(follows, "  this the following uid used");
        const flow = snapShot.docs.map((doc) => doc.exists);
        setFollowingBoolean(!followingBoolean);
        console.log(flow, " the boolean of the folloeing")
        setFollowing(follows);
      })
    })
    })
  
  }

  useEffect(() => {
    const unregister = auth().onAuthStateChanged(userExist=>{
      if(userExist) {
         firestore().collection("users").where("uid", "==",userExist.uid).onSnapshot((snapShot) => {
          const users = snapShot.docs.map((document) => document.data().photoURL);
          const uName = snapShot.docs.map((document) => document.data().fullName);
          setPhotoURL(users);
          setFullName(uName);
        }); 
    }});

    getArt();
    followState();

    return () => followState();
    return () => unregister(); 
  }, [])

  return (
    <ImageBackground 
      source={imageBg} 
      resizeMode="stretch" 
      style={globalStyles.container}
    >
      <View style={styles.TopContainer}>
       
      <View style={styles.VideoContainer}>
           <WebView
              source={{html: '<iframe width="100%" height="50%" src="https://www.youtube.com/embed/FHfIeu3Vnrc" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'}}
              videoId={'84WIaK3bl_s'}
              style={{width: 325, height: 10, borderRadius: 15}}
           />
          </View>
        </View>
        
                <View style={styles.MiddleContainer}>
                  <View style={styles.listItem} >
                    <View style={{flexDirection: "row", width: '91%'}}>

                      <Image 
                        source={{uri: `${photoUrl}`}} 
                        style={styles.img2}
                      />

                      <View style={{width: '100%'}}>
                        <Text style={{ color: "#000000", marginLeft: 10, top: 6, fontSize: 20}}>{artistName}</Text>
                        <Text style={{ color: "#ceb89e", marginLeft: 10, top: 3}}>Artist</Text>
                        
                        {following == artistUid ? (
                      <View>
                          <TouchableOpacity 
                            style={{alignSelf: 'flex-end', marginVertical: -25, marginHorizontal: 70, bottom: 10}}
                            title="following"
                            onPress={() => onUnFollowing()}
                          > 
                          <Text style={{color: '#dc143c', fontSize: 16}}>Unfollow</Text> 
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View>
                        <TouchableOpacity 
                            style={{alignSelf: 'flex-end', marginVertical: -25, marginHorizontal: 70, bottom: 10}}
                            title="following"
                            onPress={() => onFollow()}
                            >  
                             <Text style={{color: '#deb887', fontSize: 16}}>Follow</Text>     
                          </TouchableOpacity>
                      </View>
                    )
                    }
                      
                      </View>
                    </View>

                    <View style={{width: '95%', top: 15}}>
                      <Text style={{color: "#000000"}}>{description}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.BottomContainer}>
                  <Text style={styles.moreText}>More Works</Text>
                  <ScrollView
                  horizontal>
                        <SafeAreaView style={{flexDirection:'row'}}>
                        <FlatList
                          horizontal={true}
                          data={art}
                          keyExtractor={item => `${item.ImageUid}`}
                          renderItem={({ item }) => {
                            return(
                              <View style={styles.listItem2} >
                                <TouchableOpacity onPress={() => navigation.navigate('ArtPreview', {artistUid, likes: item.likes, price: item.price, description: item.description, artUrl: item.artUrl, artistPhoto: item.artistPhoto, artistName: item.artistName, ImageUid: item.ImageUid, artType: item.artType, description: description})} >
                                  <Image
                                    source={{uri:item.artUrl}}
                                    style={styles.img}
                                  />
                                  <View style={styles.priceView}>
                                    <Text style={styles.price} >{item.price}</Text>
                                  </View>
                                </TouchableOpacity>
                              </View>
                            )
                          }}
                        />
                        <TouchableOpacity onPress={() => navigation.navigate('ArtWorks',  { description:description, artistUid: artistUid, photoUrl: photoUrl, artistName: artistName})} 
                          style={{
                            borderWidth: 1,
                            borderColor: 'gray',
                            width:120, 
                            height:150,
                            borderRadius:15, 
                            marginHorizontal:15, 
                            top:20, 
                            justifyContent:'center', 
                            alignItems:'center'
                            }}
                            >
                           <Text style={{fontSize: 18, color:'gray'}}> +{size}</Text>
                           {/* <Text style={{color:'blue', fontSize:20, fontWeight:'700'}}>See All</Text> */}
                        </TouchableOpacity>
                        </SafeAreaView>
                    </ScrollView>
                </View>
      </ImageBackground>
  );
}

const imageBg = require('../assets/images/home.png')

export default ArtistProfile;

const styles = StyleSheet.create({
  TopContainer: {
    top: 50,
    flex: 2,
  },
    MiddleContainer: {
        flex: 2,
        top: 90
        // backgroundColor: "red"
    },
    BottomContainer: {
      flex: 2,
       top: 20
    },
    moreText: {
        color: "#000000",
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 20
    },
    img: {
        height: 150,
        width: 120,
        borderRadius: 15
      },
      listItem2: {
        paddingLeft: 15,
        paddingTop: 20,
        flexDirection: "column",
        marginBottom: 45
      },
      price: {
        color: "#ffffff", 
        textAlign: "center", 
        fontWeight: "bold"
    },
    priceView: {
        backgroundColor: 'rgba(16, 18, 27, 0.4)', 
        marginVertical: -25, 
        borderRadius: 20,
        alignSelf: 'center',
        height: 20,
        width: '90%'
      },
      listItem: {
        // paddingTop: 20,
        marginLeft: 15,
        width: '100%',
        height: 100,
      },
      img2: {
        height: 50,
        width: 50,
        borderRadius: 25,
        // borderColor: 'rgba(196, 196, 196, 0.51)',
        // borderWidth: 4,
        marginLeft: 3
      },
      BackButton: {
        padding: 5,
        borderWidth: 1,
        borderRadius: 10,
        width: 50,
        height: 50,
        alignItems: "center",
        marginHorizontal: 15,
        marginTop: 10
      },
      Heart: {
        alignSelf: "flex-end",
        marginHorizontal: 160,
        bottom: 15
      },
      VideoContainer: {
        borderRadius: 15, 
        width: 325, 
        height: 490, 
        backgroundColor: "blue", 
        alignSelf: "center",
        marginTop: 10
    }
})