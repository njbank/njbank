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
    this.neos.login().then(() => {
      this.neos.getFriends().then((friends) => {
        for (const friend of friends) {
          if (friend.friendStatus === 'Requested') {
            this.neos.addFriend({ targetUserId: friend.id });
          }
        }
      });
    });
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
  async KfcCheck(id: string, amount: number) {
    const messages = await this.neos.getMessages({
      targetUserId: `U-${id.substring(2)}`,
      unReadOnly: true,
    });
    for (const message of messages) {
      if (
        message.content['token'] === 'KFC' &&
        message.content['amount'] === amount
      ) {
        await this.neos.readMessage({ messageIds: [message.id] });
        return true;
      }
    }
    return false;
  }
}
