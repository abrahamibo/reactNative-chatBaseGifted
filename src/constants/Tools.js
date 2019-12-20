import {
  Platform,
} from 'react-native';
let port,adress ;
// @TODO: Heroku
if ('android' == Platform.OS) {
  port = ":8888";
  port = ":8000";
  adress = "192.168.1.17";
  adress = "192.168.43.105";
  // adress = "192.168.1.49";
} else {
  port = ":8000";
  adress = "127.0.0.1";
  adress = "192.168.43.105";

  // adress = "192.168.1.49";
}

export default {
  // ajax:"https://shocking-mansion-17917.herokuapp.com",
  ajax:"http://"+ adress+port
};

export function checkerror(data, navigation) {
  if(data.error && data.error.code == 10){
    navigation.push('SignIn');
  }
}