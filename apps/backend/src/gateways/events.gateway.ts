import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('driver:location:update')
  handleDriverLocation(
    @MessageBody() data: { driverId: string; latitude: number; longitude: number; bearing?: number },
    @ConnectedSocket() client: Socket,
  ) {
    // Broadcast live driver location to tracking subscribers
    this.server.emit(`driver:location:${data.driverId}`, data);
    return { received: true };
  }

  @SubscribeMessage('trip:subscribe')
  handleTripSubscribe(@MessageBody() data: { tripId: string }, @ConnectedSocket() client: Socket) {
    client.join(`trip:${data.tripId}`);
    return { subscribed: true, room: `trip:${data.tripId}` };
  }
}
