import { Injectable } from '@nestjs/common';
import { Neos } from 'neos-client/dist';

@Injectable()
export class NeosService {
  private neos = new Neos({
    username: 'hinasense.js',
    password: 'Lillywhite56',
  });
  constructor() {
    this.neos.on('FriendRequested', (friend) => {
      this.neos.addFriend({ targetUserId: friend.id });
    });
    this.neos.login();
  }
  async sendMessage(id: string, message: string) {
    await this.neos.sendTextMessage({
      targetUserId: `U-${id.substring(2)}`,
      message: message,
    });
  }
}
