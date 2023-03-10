import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  ScrollView,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
const data = require('../../data.json');
const StockList = () => {
  console.log(data.length);

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{backgroundColor: '#f1f5f9'}}>
        {data.map((d: any, index: number) => {
          return (
            <View key={index}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{flex: 1, paddingHorizontal: 12, paddingVertical: 8}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: 'black',
                      }}>
                      {d.scripDetail.symbol}
                    </Text>

                    <Text
                      style={{
                        fontSize: 10,
                        backgroundColor: 'lightgrey',
                        paddingHorizontal: 4,
                        paddingVertical: 1,
                        alignSelf: 'center',
                        marginLeft: 4,
                        borderRadius: 2,
                      }}>
                      {d.scripDetail._ExchangeName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        alignSelf: 'center',
                        marginLeft: 4,
                        color: 'black',
                      }}>
                      {d.scripDetail._Series}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingHorizontal: 12,
                  }}>
                  <View
                    style={{
                      padding: 8,
                      flex: 1,
                      backgroundColor: d.NetChangeInRs.includes('-')
                        ? '#fee2e2'
                        : '#dcfce7',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: 'black',
                        textAlign: 'right',
                      }}>
                      {d.LTP}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: d.NetChangeInRs.includes('-') ? 'red' : 'green',
                        textAlign: 'right',
                      }}>
                      {d.NetChangeInRs + ' ' + d.PercNetChange}
                    </Text>
                  </View>
                  <View style={{alignSelf: 'center', marginLeft: 4}}>
                    <Text
                      style={{
                        borderWidth: 1,
                        borderRadius: 20,
                        width: 28,
                        height: 28,
                        textAlign: 'center',
                        padding: 6,
                        fontWeight: 'bold',
                      }}>
                      T
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  marginVertical: 8,
                  height: 1,
                  backgroundColor: '#d1d5db',
                }}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
export default StockList;
