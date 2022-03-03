import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import { globalStyles } from '../assets/styles/GlobalStyles';
import AppLoader from '../screens/AppLoader';
import Toast from 'react-native-toast-message';
const SignIn = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errortext, setErrortext] = useState("");
  const [loading, setLoading] = useState(false);
  const validate = () => {
     const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     if (email == "" && password == "") {
       Toast.show({
          type: 'error',
          text1: 'Hello user',
          text2: 'Both fields are empty',
       })
     } else  if (!reg.test(email)) {
       Toast.show({
         type: 'error',
         text1: 'Hello user',
         text2: 'Email is not valid',
      })
    } else if (password == "") {
      Toast.show({
         type: 'error',
         text1: 'Hello user',
         text2: 'Password cannot be empty',
      })
    } else {
       signIn()
    }
  }
  const signIn = async () => {
       setLoading(true)
       if(email !== "" && password !== "") {
       await auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
        console.log(user);
        Toast.show({
          type: 'success',
          text1: 'Hello user',
          text2: 'You have successfully loged in ',
       })
        if (user) navigation.replace("Home");
      })
      .catch((error) => {
        console.log(error);
        if (error.code === "auth/invalid-email")
        Toast.show({
          type: 'error',
          text1: 'Hello user',
          text2: 'Email is not valid',
       })
        else if (error.code === "auth/user-not-found")
         {
           Toast.show({
            type: 'error',
            text1: 'Hello user',
            text2: 'No User Found',
         });
        setLoading(false)
        }
        else {
            Toast.show({
              type: 'error',
              text1: 'Hello user',
              text2: 'Please check your email id or password',
           })
           setLoading(false)
        }
      });
       }
    }
  return (
    <>
    {loading ? <AppLoader/> : (
    <KeyboardAvoidingView behavior='position'>
    <ImageBackground
      source={require('../assets/images/signIn/bg.png')}
      style={styles.imageBack}
    >
    <View style={{flex: 1}}>
    <View style={styles.gallery360logo}>
      <Image source={require('../assets/images/signIn/SignInLogo.png')}/>
      </View>
    </View>
      <View style={{flex: 1, marginBottom: 18}}>
        <View>
              <View  style={{marginLeft: 33, marginBottom: 15}}>
                  <Text style={{fontSize: 36, color: '#22180E'}}>Welcome Back !</Text>
                  <Text style={{color: '#FFFFFF'}}>Login to your account</Text>
              </View>
        </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={email => setEmail(email)}
              value={email}
              underlineColorAndroid="#f000"
              placeholder="Email"
              placeholderTextColor="#FFFFFF"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={password => setPassword(password)}
              value={password}
              underlineColorAndroid="#f000"
              placeholder="Password"
              placeholderTextColor="#FFFFFF"
              returnKeyType="next"
              secureTextEntry={true}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              validate()
            }}
            activeOpacity={0.5}
            >
           <LinearGradient start={{x: 1, y: 0}} end={{x: 1, y: 1}} colors={['#0E1822', '#181818']} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Sign In</Text>
            </LinearGradient>
          </TouchableOpacity>
        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
           <Text style={{}}>
              Don't have an account?
           </Text>
           <Text>
           <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={{color: '#22180E'}}>
                  {' '}
                  Sign Up
                </Text>
              </TouchableOpacity>
           </Text>
        </View>
        </View>
    </ImageBackground>
    </KeyboardAvoidingView>
    )}
    </>
  );
};
const bg = require('../assets/images/signIn/bg.png')
export default SignIn;
const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 17,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#0E1822',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 50,
    alignItems: 'center',
    borderRadius: 14,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 25,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 13,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#FFFFFF',
  },
  imageBack: {
    height: Dimensions.get('window').height / 1,
  },
  gallery360logo: {
      height: 226,
      width: 166,
      alignSelf: 'center',
      alignItems: 'center',
      marginTop: 45,
  },
  errors: {
    fontSize: 12,
    color: 'red',
    fontWeight: 'bold',
    marginTop: 5,
    marginHorizontal: 35
  }
});