import SocketStatus from './socket_status';

interface SocketListener {
  onMessage: (message: string) => void;
  onStatusChange: (status: SocketStatus) => void;
}
export default SocketListener;
