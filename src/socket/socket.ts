import Zlib from '../zlib';
import SocketListener from './socket_listener';
import SocketStatus from './socket_status';

const C_S_CHANNEL_INTERACTIVE = 'Interactive';
const C_S_ON = 'ON';
const _selfSocCom = {
  SocketChannelId: 'Broadcast',
  CompressStatus: 'ON',
};

export default class Socket {
  socket?: any;
  mode;
  ip;
  port;
  listener;
  constructor(
    mode: string,
    ip: string,
    port: string,
    listener: SocketListener,
  ) {
    this.mode = mode;
    this.ip = ip;
    this.port = port;
    this.listener = listener;
    // listener.onMessage('ag');
    // this.listener = listener;
    // this.connect();
  }
  connect = () => {
    try {
      this.socket = null;
      const url = `${this.mode}://${this.ip}:${this.port}`;
      console.log('Connecting To Web Socket: ', url);

      this.socket = new WebSocket(url);

      this.socket.onopen = this.onOpen;
      this.socket.onclose = this.onClose;
      this.socket.onerror = this.onError;
      this.socket.onmessage = this.onMessage;
      console.log('Opening websocket . . .');
    } catch (ex: any) {
      console.log(
        'Failed to connect to server. Reason : ',
        ex.message,
        ' | Stack trace : ',
        ex.stack,
      );
    }
  };
  disconnect = () => {
    try {
      if (this.socket != null) {
        console.log('Disconnecting websocket');
        this.listener.onStatusChange(SocketStatus.DISCONNECTED);
        this.socket.close();
      } else {
        this.listener.onStatusChange(SocketStatus.DISCONNECTED);
      }
    } catch (ex: any) {
      console.log(
        'Failed to close socket. Reason : ',
        ex.message,
        ' | Stack trace : ',
        ex.stack,
      );
    }
  };

  onOpen = () => {
    console.log('onOpen');
    this.login();
  };

  private login = async () => {
    var sUsedId = 'TEXT';
    var sApiKey = '';
    var sLoginRequest = '';
    if (sApiKey === '') {
      sLoginRequest =
        '63=FT3.0|64=101|65=74|66=14:59:22|67=' +
        sUsedId +
        '|68=|4=|400=0|401=1|396=HO|51=4|395=127.0.0.1';
    } else {
      sLoginRequest =
        '63=FT3.0|64=101|65=74|66=14:59:22|67=' +
        sUsedId +
        '|68=' +
        sApiKey +
        '|4=|400=0|401=2|396=HO|51=4|395=127.0.0.1';
    }
    await this.sendMessage(sLoginRequest);
    this.listener.onStatusChange(SocketStatus.CONNECTED);
  };

  sendMessage = async (message: any) => {
    if (this.socket) {
      try {
        if (this.socket.readyState === 1) {
          await this.socket.send(this.AddHTTPHeader(message));
          console.log('Message sent on socket successfully');
          console.log('Message: ' + message);
          //
        } else {
          console.log(
            'Websocket connection not open. Ready state : ',
            this.getReadyStateDescription(this.socket.readyState),
          );
        }
      } catch (ex: any) {
        console.log(ex);
      }
    }
  };

  private getReadyStateDescription = function (readyState: any) {
    switch (readyState) {
      case 0:
        return '0 (Connection not yet established.)';
      case 1:
        return '1 (Websocket connection is established and ready for communication.)';
      case 2:
        return '2 (Connection going through closing handshake.)';
      case 3:
        return '3 (Connection has been closed or could not be opened.)';
    }
  };

  AddHTTPHeader = (_requestPacket: any) => {
    try {
      if (typeof ArrayBuffer === 'undefined') {
        if (_selfSocCom.SocketChannelId !== C_S_CHANNEL_INTERACTIVE) {
          var strHead = String.fromCharCode(2);
          var length = _requestPacket.length;
          var lenLength = length.toString().length;
          var LengthString = '';
          for (i = 0; i < 5 - lenLength; i++) {
            LengthString += '0';
          }
          LengthString += length.toString();
          _requestPacket = strHead + LengthString + _requestPacket;
          return _requestPacket;
        } else {
          var strHead = String.fromCharCode(2);
          _requestPacket = strHead + _requestPacket;
          return _requestPacket;
        }
      } else {
        var _strHead = String.fromCharCode(2); //No compression
        if (_selfSocCom.CompressStatus === C_S_ON)
          _strHead = String.fromCharCode(5); //5 comprression char
        var i;
        var _data = new ArrayBuffer(_strHead.length);
        var _headerBytes = new Uint8Array(_data);
        for (i = 0; i < _strHead.length; i += 1) {
          _headerBytes[i] = _strHead.charCodeAt(i);
        }
        var _baRequest;
        if (_selfSocCom?.CompressStatus === C_S_ON) {
          _baRequest = this.HandleCompressedData(_requestPacket);
        } else {
          _baRequest = this.HandleConvertToByteArray(_requestPacket);
        }
        var _length = _baRequest.length;
        if (_selfSocCom.SocketChannelId !== C_S_CHANNEL_INTERACTIVE)
          _length += 4;
        var _lenLength = _length.toString().length;
        var _lengthString = '';
        for (i = 0; i < 5 - _lenLength; i++) {
          _lengthString += '0';
        }
        _lengthString += _length.toString();
        _data = new ArrayBuffer(_lengthString.length);
        var _lenBytes = new Uint8Array(_data);
        for (i = 0; i < _lengthString.length; i += 1) {
          _lenBytes[i] = _lengthString.charCodeAt(i);
        }
        var _baActualSend = new Uint8Array(5 + _length);
        _baActualSend.set(_lenBytes);
        _baActualSend.set(_baRequest, 5);
        var _outputStream = new Uint8Array(
          _headerBytes.length + _baActualSend.length,
        );
        _outputStream.set(_headerBytes);
        _outputStream.set(_baActualSend, 1);
        return _outputStream.buffer;
      }
    } catch (e) {
      console.log(e);
    }
  };

  private HandleConvertToByteArray = (_data: any) => {
    try {
      var _arrbufData = new ArrayBuffer(_data.length);
      var _uint8buf = new Uint8Array(_arrbufData);
      for (var i = 0; i < _data.length; i += 1) {
        _uint8buf[i] = _data.charCodeAt(i) & 0xff;
      }
      var _baData = new Uint8Array(_arrbufData);
      return _baData;
    } catch (e) {
      console.log(e);
      return '';
    }
  };

  HandleCompressedData = (_rawData: any) => {
    try {
      var _data = new ArrayBuffer(_rawData.length);
      var _uint8buf = new Uint8Array(_data);
      for (var i = 0; i < _rawData.length; i += 1) {
        _uint8buf[i] = _rawData.charCodeAt(i) & 0xff;
      }
      //alert('CompressData');
      var _compData = Zlib.compress(new Uint8Array(_data), 6);
      //alert('CompressData - After Compress' );
      return _compData;
    } catch (e) {
      console.log(e);
      return '';
    }
  };

  onClose = (event: any) => {
    console.log('onClose');
    console.log(event);
  };

  onError = (error: any) => {
    console.log('onError');
    console.log(error);
    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.onmessage = null;
      this.socket = null;
    }
  };

  onMessage = (message: any) => {
    console.log('onMessage');
    console.log(message);
    this.listener.onMessage(message);
  };
}
