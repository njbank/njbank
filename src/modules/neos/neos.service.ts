import 'dotenv/config';

import { Injectable } from '@nestjs/common';
import { Neos } from 'neos-client/dist';

@Injectable()
export class NeosService {
  private neos = new Neos(
    {
      username: process.env.NEOS_USER,
      password: process.env.NEOS_PASS,
    },
    {
      saveLoginCredential: true,
      useEvents: true,
      autoSync: true,
      overrideBaseUrl: 'https://apiproxy.neos.love/',
    },
  );
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
  async sendKfc(id: string, amount: number, comment?: string, totp?: string) {
    await this.neos.sendKFC({
      targetUserId: `U-${id.substring(2)}`,
      amount: amount,
      comment: comment,
      totp: totp,
    });
  }
  async friendRequest(id: string) {
    await this.neos.addFriend({ targetUserId: `U-${id.substring(2)}` });
  }
}
