// //******Websocket ready state info*******
// //------Ready state = 0 : Connection not yet established.
// //------Ready state = 1 : Websocket connection is established and ready for communication.
// //------Ready state = 2 : Connection going through closing handshake.
// //------Ready state = 3 : Connection has been closed or could not be opened.

// var objSocket;
// var Global = {};
// Global.Constants = {};
// Global.Constants.C_S_CHANNEL_INTERACTIVE = 'Interactive';
// Global.Constants.C_S_ON = 'ON';
// Global.Constants.C_S_CHAR0 = '\u0000';
// Global.Constants.C_S_CHAR2 = '\u0002';
// var _selfSocCom = {};
// _selfSocCom.SocketChannelId = 'Broadcast';
// _selfSocCom.CompressStatus = 'ON';

// //mode : ws or wss
// function ConnectSocket(mode, ip, port) {
//   try {
//     objSocket = null;
//     UpdateConnectionStatus(
//       'Conecting web socket to server[' +
//         ip +
//         '] on port[' +
//         port +
//         '], mode[' +
//         mode +
//         ']',
//     );
//     objSocket = new WebSocket(mode + '://' + ip + ':' + port);
//     objSocket.binaryType = 'arraybuffer';

//     objSocket.onopen = socketOnOpen;
//     objSocket.onclose = socketOnClose;
//     objSocket.onerror = socketOnError;
//     objSocket.onmessage = socketOnMessage;
//     UpdateConnectionStatus('Opening websocket . . .');
//   } catch (ex) {
//     UpdateConnectionStatus(
//       'Failed to connect to server. Reason : ' +
//         ex.message +
//         ' | Stack trace : ' +
//         ex.stack,
//     );
//   }
// }

// function OpenSocket(event) {
//   try {
//     if (objSocket != null) {
//       objSocket.open();
//     }
//   } catch (ex) {
//     UpdateConnectionStatus(
//       'Failed to open socket. Reason : ' +
//         ex.message +
//         ' | Stack trace : ' +
//         ex.stack,
//     );
//   }
// }

// function CloseSocket() {
//   try {
//     if (objSocket != null) {
//       UpdateConnectionStatus('Disconnecting websocket');
//       objSocket.close();
//     }
//   } catch (ex) {
//     UpdateConnectionStatus(
//       'Failed to close socket. Reason : ' +
//         ex.message +
//         ' | Stack trace : ' +
//         ex.stack,
//     );
//   }
// }

// function SendMessageOnSocket(msg) {
//   try {
//     if (objSocket.readyState == 1) {
//       objSocket.send(AddHTTPHeader(msg));
//       UpdateConnectionStatus('Message sent on socket successfully');
//       UpdateConnectionStatus('Message: ' + msg);
//     } else {
//       UpdateConnectionStatus(
//         'Websocket connection not open. Ready state : ' +
//           getreadyStateDesc(objSocket.readyState),
//       );
//     }
//   } catch (ex) {
//     UpdateConnectionStatus(
//       'Error occurred while sending message on socket. Reason : ' +
//         ex.message +
//         ' | Stack trace : ' +
//         ex.stack,
//     );
//   }
// }

// var socketOnMessage = function (msg) {
//   try {
//     //UpdateServerReceivedMessage('Data received from server');
//     OnSocketDataReceive(msg);
//   } catch (ex) {}
// };

// var socketOnOpen = function () {
//   UpdateConnectionStatus(
//     'Websocket Event Open Successfully. Ready state : ' +
//       getreadyStateDesc(objSocket.readyState),
//   );
//   var sUsedId = document.getElementById('txtUserId').value;
//   var sApiKey = document.getElementById('txtApiKey').value;
//   var sLoginRequest = '';
//   if (sApiKey == '') {
//     sLoginRequest =
//       '63=FT3.0|64=101|65=74|66=14:59:22|67=' +
//       sUsedId +
//       '|68=|4=|400=0|401=1|396=HO|51=4|395=127.0.0.1';
//   } else {
//     sLoginRequest =
//       '63=FT3.0|64=101|65=74|66=14:59:22|67=' +
//       sUsedId +
//       '|68=' +
//       sApiKey +
//       '|4=|400=0|401=2|396=HO|51=4|395=127.0.0.1';
//   }
//   SendMessageOnSocket(sLoginRequest);
// };

// var socketOnClose = function (event) {
//   try {
//     var reason;
//     // See http://tools.ietf.org/html/rfc6455#section-7.4.1
//     if (event.code == 1000)
//       reason =
//         'Normal closure, meaning that the purpose for which the connection was established has been fulfilled.';
//     else if (event.code == 1001)
//       reason =
//         'An endpoint is "going away", such as a server going down or a browser having navigated away from a page.';
//     else if (event.code == 1002)
//       reason =
//         'An endpoint is terminating the connection due to a protocol error';
//     else if (event.code == 1003)
//       reason =
//         'An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).';
//     else if (event.code == 1004)
//       reason = 'Reserved. The specific meaning might be defined in the future.';
//     else if (event.code == 1005)
//       reason = 'No status code was actually present.';
//     else if (event.code == 1006)
//       reason =
//         'The connection was closed abnormally, e.g., without sending or receiving a Close control frame';
//     else if (event.code == 1007)
//       reason =
//         'An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).';
//     else if (event.code == 1008)
//       reason =
//         'An endpoint is terminating the connection because it has received a message that "violates its policy". This reason is given either if there is no other suitable reason, or if there is a need to hide specific details about the policy.';
//     else if (event.code == 1009)
//       reason =
//         'An endpoint is terminating the connection because it has received a message that is too big for it to process.';
//     else if (event.code == 1010)
//       // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
//       reason =
//         "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " +
//         event.reason;
//     else if (event.code == 1011)
//       reason =
//         'A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.';
//     else if (event.code == 1015)
//       reason =
//         "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
//     else reason = 'Unknown reason';

//     UpdateConnectionStatus(
//       'Websocket Event Close Called. Code : ' +
//         event.code +
//         ', Reason : ' +
//         reason,
//     );
//   } catch (ex) {
//     UpdateConnectionStatus(
//       'Failed in close event. Reason : ' +
//         ex.message +
//         ' | Stack trace : ' +
//         ex.stack,
//     );
//   }
// };

// var socketOnError = function (error) {
//   objSocket.onopen = null;
//   objSocket.onclose = null;
//   objSocket.onerror = null;
//   objSocket.onmessage = null;
//   objSocket = null;
//   //UpdateConnectionStatus('Websocket Event OnError Called. Ready State : ' + getreadyStateDesc(objSocket.readyState));
//   /*
// 	 setTimeout(function(){
// 	 	ConnectSocket('ws','172.25.92.67',4509)
// 	 	},1000);
// 	 	*/
// };

// var getreadyStateDesc = function (readyState) {
//   if (readyState == 0) return '0 (Connection not yet established.)';
//   else if (readyState == 1)
//     return '1 (Websocket connection is established and ready for communication.)';
//   else if (readyState == 2)
//     return '2 (Connection going through closing handshake.)';
//   else if (readyState == 3)
//     return '3 (Connection has been closed or could not be opened.)';
// };

// const AddHTTPHeader = function (_requestPacket) {
//   /// <summary>
//   /// Function to add the HTTP header and tail to the data packet
//   /// </summary>
//   /// <param name="_requestPacket" type="String">
//   /// Request Packet string to be sent over the socket
//   /// </param>
//   /// <returns type="Array" elementType="Number" elementInteger="true"></returns>
//   try {
//     if (typeof ArrayBuffer == 'undefined') {
//       if (
//         _selfSocCom.SocketChannelId !== Global.Constants.C_S_CHANNEL_INTERACTIVE
//       ) {
//         var strHead = String.fromCharCode('2');
//         var length = _requestPacket.length;
//         var lenLength = length.toString().length;
//         var LengthString = '';
//         for (i = 0; i < 5 - lenLength; i++) {
//           LengthString += '0';
//         }
//         LengthString += length.toString();
//         _requestPacket = strHead + LengthString + _requestPacket;
//         return _requestPacket;
//       } else {
//         var strHead = String.fromCharCode('2');
//         _requestPacket = strHead + _requestPacket;
//         return _requestPacket;
//       }
//     } else {
//       var _strHead = String.fromCharCode('2'); //No compression
//       if (_selfSocCom.CompressStatus == Global.Constants.C_S_ON)
//         _strHead = String.fromCharCode('5'); //5 comprression char

//       var i;
//       var _data = new ArrayBuffer(_strHead.length);
//       var _headerBytes = new Uint8Array(_data);

//       for (i = 0; i < _strHead.length; i += 1) {
//         _headerBytes[i] = _strHead.charCodeAt(i);
//       }
//       var _baRequest;
//       if (_selfSocCom.CompressStatus == Global.Constants.C_S_ON)
//         _baRequest = HandleCompressedData(_requestPacket);
//       else _baRequest = HandleConvertToByteArray(_requestPacket);

//       var _length = _baRequest.length;
//       if (
//         _selfSocCom.SocketChannelId !== Global.Constants.C_S_CHANNEL_INTERACTIVE
//       )
//         _length += 4;
//       var _lenLength = _length.toString().length;
//       var _lengthString = '';

//       for (i = 0; i < 5 - _lenLength; i++) {
//         _lengthString += '0';
//       }

//       _lengthString += _length.toString();

//       _data = new ArrayBuffer(_lengthString.length);
//       var _lenBytes = new Uint8Array(_data);

//       for (i = 0; i < _lengthString.length; i += 1) {
//         _lenBytes[i] = _lengthString.charCodeAt(i);
//       }

//       var _baActualSend = new Uint8Array(5 + _length);
//       _baActualSend.set(_lenBytes);
//       _baActualSend.set(_baRequest, 5);

//       var _outputStream = new Uint8Array(
//         _headerBytes.length + _baActualSend.length,
//       );
//       _outputStream.set(_headerBytes);
//       _outputStream.set(_baActualSend, 1);
//       return _outputStream.buffer;
//     }
//   } catch (e) {}
// };

// const HandleCompressedData = function (_rawData) {
//   /// <summary>
//   /// Function to handle compressed data and send it to respective parser function for publishing it
//   /// </summary>
//   /// <param name="_rawData" type="Array" elementType="Number" elementInteger="true">
//   /// packet byte[] as received on socket
//   /// </param>
//   try {
//     var _data = new ArrayBuffer(_rawData.length);
//     var _uint8buf = new Uint8Array(_data);
//     for (var i = 0; i < _rawData.length; i += 1) {
//       _uint8buf[i] = _rawData.charCodeAt(i) & 0xff;
//     }
//     //alert('CompressData');
//     var _compData = Zlib.compress(new Uint8Array(_data), 6);
//     //alert('CompressData - After Compress' );
//     return _compData;
//   } catch (e) {}
// };

// const HandleConvertToByteArray = function (_data) {
//   /// <summary>
//   /// Function to handle plain data and send it to respective parser function for publishing it
//   /// </summary>
//   /// <param name="_data" type="String">
//   /// plain packet string as received on socket
//   /// </param>
//   try {
//     var _arrbufData = new ArrayBuffer(_data.length);
//     var _uint8buf = new Uint8Array(_arrbufData);
//     for (var i = 0; i < _data.length; i += 1) {
//       _uint8buf[i] = _data.charCodeAt(i) & 0xff;
//     }
//     var _baData = new Uint8Array(_arrbufData);
//     return _baData;
//   } catch (e) {}
// };

// var baOldData = null;

// const OnSocketDataReceive = function (_event) {
//   /// <summary>
//   /// Event is called when successful aysnchronous data is received
//   /// </summary>
//   /// <param name="_event" type="event Object">
//   try {
//     var baProcessData = null;
//     var intRawPktLen;
//     var intCompLen = 0;
//     var _response,
//       isBroken = false;
//     var totalPacketLength = 0;

//     if (_event.data instanceof ArrayBuffer) {
//       var dataReceived = null;
//       var dataPacketLengthList = [];
//       if (baOldData == null) dataReceived = new Uint8Array(_event.data);
//       else {
//         dataReceived = AppendOrCopyBuffer(baOldData, _event.data);
//         baOldData = null;
//       }

//       intRawPktLen = dataReceived.byteLength;
//       var i = 0;
//       if (intRawPktLen > 5) {
//         while (i < intRawPktLen) {
//           if (dataReceived[i] == 5 || dataReceived[i] == 2) {
//             var strPacketLength = String.fromCharCode.apply(
//               null,
//               dataReceived.subarray(i + 1, i + 6),
//             );
//             if (strPacketLength.length == 5) {
//               var packetLength = parseInt(strPacketLength, 10);
//               dataPacketLengthList.push(packetLength + 6);
//               totalPacketLength += packetLength + 6;
//               i = i + 6 + packetLength;
//             } else {
//               baOldData = dataReceived.subarray(i, intRawPktLen);
//               isBroken = true;
//               break;
//             }
//           } else alert();
//         }
//       } else baOldData = dataReceived;

//       if (intRawPktLen == totalPacketLength) {
//         // split and pass to zlib to uncompress
//         for (
//           var i = 0,
//             j = 0,
//             k = dataPacketLengthList[0],
//             len = dataPacketLengthList.length;
//           i < len;
//           i++
//         ) {
//           var uncompData = dataReceived.subarray(j, k);
//           ProcessSocketMessage(uncompData);

//           j = k;
//           k = k + dataPacketLengthList[i + 1];
//         }
//         baOldData = null;
//       } else {
//         var i = 0,
//           j = 0;
//         var k = dataPacketLengthList.length > 0 ? dataPacketLengthList[0] : 0;

//         if (!isBroken) {
//           for (var len = dataPacketLengthList.length; i < len - 1; i++) {
//             var uncompData = dataReceived.subarray(j, k);
//             ProcessSocketMessage(uncompData);

//             j = k;
//             k = k + dataPacketLengthList[i + 1];
//           }

//           if (i == dataPacketLengthList.length - 1) {
//             if (dataReceived.subarray(j, k)[0] != 5) alert();

//             baOldData = null;
//             baOldData = dataReceived.subarray(j, k);
//             if (baOldData[0] != 5 && baOldData[0] != 2) alert();
//           } else alert();
//         } else {
//           for (var len = dataPacketLengthList.length; i < len; i++) {
//             var uncompData = dataReceived.subarray(j, k);
//             ProcessSocketMessage(uncompData);

//             j = k;
//             k = k + dataPacketLengthList[i + 1];
//           }
//           isBroken = false;
//         }
//       }
//     } else ProcessPacketString(_event.data);
//   } catch (e) {}
// };

// const AppendOrCopyBuffer = function (buffer1, buffer2) {
//   //var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
//   //tmp.set(new Uint8Array(buffer1), 0);
//   //tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
//   var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
//   tmp.set(new Uint8Array(buffer1), 0);
//   tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
//   return tmp;
// };

// const ProcessSocketMessage = function (uncompData) {
//   if (_selfSocCom.CompressStatus == Global.Constants.C_S_ON)
//     _response = DeCompressData(uncompData);
//   else _response = HandleNormalData(uncompData);

//   if (_response == undefined) {
//     console.log(_response);
//   }
//   //remove End of response char
//   var intTmtrIndex = _response.indexOf(Global.Constants.C_S_CHAR0);
//   if (intTmtrIndex != -1) {
//     _response = _response.substr(0, intTmtrIndex);
//   }

//   //split multi response packet with Start of response char C_S_CHAR2
//   var arrData = _response.split(Global.Constants.C_S_CHAR2);
//   var intDataCount = arrData.length;

//   for (var intDataCntr = 0; intDataCntr < intDataCount; intDataCntr++) {
//     if (arrData[intDataCntr] != '') {
//       ProcessPacketString(arrData[intDataCntr]);
//     }
//   }
// };

// const ProcessPacketString = function (data) {
//   UpdateServerReceivedMessage('Data From Server : ' + data);
// };

// const DeCompressData = function (_pktData) {
//   /// <summary>
//   /// Function to decompress the packet string using ZLib
//   /// </summary>
//   /// <param name="_pktData" type="Array" elementType="Number" elementInteger="true">
//   /// Compressed packet byte[] as received on the socket
//   /// </param>
//   /// <returns type="String"></returns>
//   try {
//     var _compData = new Uint8Array(_pktData);
//     //first 6 bytes will be special char and length of data
//     //so need to take after it
//     _compData = _compData.subarray(6, _compData.length);
//     var _uncompData = Zlib.uncompress(new Uint8Array(_compData));
//     var _sResp = [];
//     for (i = 0, len = _uncompData.length; i < len; i += 1) {
//       _sResp.push(String.fromCharCode(_uncompData[i]));
//     }
//     return _sResp.join('');
//   } catch (e) {}
// };

// const HandleNormalData = function (_plainData) {
//   /// <summary>
//   /// Function to handle plain data and send it to respective parser function for publishing it
//   /// </summary>
//   /// <param name="_plainData" type="String">
//   /// plain packet string as received on socket
//   /// </param>
//   try {
//     var data = new Uint8Array(_plainData);
//     var sResp = [];
//     for (i = 0; i < data.length; i += 1) {
//       sResp.push(String.fromCharCode(data[i]));
//     }
//     return sResp.join('');
//   } catch (e) {}
// };
