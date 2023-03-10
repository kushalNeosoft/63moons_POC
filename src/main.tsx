import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  ScrollView,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import Socket from './socket/socket';
import SocketStatus from './socket/socket_status';
import {CommonActions} from '@react-navigation/native';
const data = require('../data.json');

interface MainProps {
  navigation: any;
  route: any;
}
const Main = ({navigation, route}: MainProps) => {
  const [loading, setLoading] = useState(false);
  const [socketStatus, setSocketStatus] = useState<SocketStatus>();
  const [messages, setMessages] = useState<string[]>([]);

  const [socket, setSocket] = useState(
    new Socket('wss', 'odindemo.63moons.com', '4510', {
      onMessage: (message: string) => {
        console.log(message);
      },
      onStatusChange: (status: SocketStatus) => {
        setLoading(false);
        setSocketStatus(status);
        // const temp = [...messages];
        // console.log(messages);

        // temp.push(status.toString());
        // console.log(status.toString());
        // messages.push(status);
        setMessages(prev => [...prev, status.toString()]);
        // setMessages(prev => {
        //   prev.push(status.toString());
        //   return prev;
        // });
        // if (status === SocketStatus.CONNECTED)
        //   socket.sendMessage(JSON.stringify(data));
      },
    }),
  );

  return (
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'column', flex: 1}}>
        <View
          style={{
            margin: 16,
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: 'lightgrey',
            borderRadius: 30,
          }}>
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple('#90CAF9', true)}
            onPress={() => {
              setLoading(true);
              socket.connect();
            }}
            // disabled={socketStatus === SocketStatus.CONNECTED}
          >
            <View
              style={{
                flex: 2,
                padding: 16,
                backgroundColor:
                  socketStatus == SocketStatus.CONNECTED
                    ? 'lightgrey'
                    : 'transparent',
              }}>
              <Text style={{textAlign: 'center', fontSize: 16}}>CONNECT</Text>
            </View>
          </TouchableNativeFeedback>
          <View
            style={{
              width: 1,
              backgroundColor: '#90CAF9',
            }}
          />
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple('#90CAF9', true)}
            onPress={() => {
              setLoading(true);
              socket.disconnect();
            }}>
            <View
              style={{
                flex: 2,
                padding: 16,
                backgroundColor:
                  socketStatus == SocketStatus.DISCONNECTED
                    ? 'lightgrey'
                    : 'transparent',
              }}>
              <Text style={{textAlign: 'center', fontSize: 16}}>
                DISCONNECT
              </Text>
            </View>
          </TouchableNativeFeedback>
          <View
            style={{
              width: 1,
              backgroundColor: '#90CAF9',
            }}
          />
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple('#90CAF9', true)}
            onPress={() => {
              navigation.dispatch(
                CommonActions.navigate({
                  name: 'StockList',
                }),
              );
            }}>
            <View
              style={{
                flex: 1,
                padding: 16,
                backgroundColor:
                  socketStatus == SocketStatus.DISCONNECTED
                    ? 'lightgrey'
                    : 'transparent',
              }}>
              <Text style={{textAlign: 'center', fontSize: 16}}>UI</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <ScrollView style={{backgroundColor: '#f1f5f9'}}>
          {messages.map((message, index) => {
            return (
              <View key={index}>
                <View style={{paddingHorizontal: 16, paddingVertical: 8}}>
                  <Text style={{color: '#0c4a6e'}}>{message}</Text>
                </View>
                <View style={{height: 1, backgroundColor: 'white'}} />
              </View>
            );
          })}
        </ScrollView>
      </View>
      {loading && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0A000000',
            shadowOpacity: 0.2,
            zIndex: 10,
          }}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
};
export default Main;
