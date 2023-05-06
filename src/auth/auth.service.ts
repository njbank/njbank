import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // KEYS
  private apiKeys: string[] = ['ca03a13ndsfdskea56lo2220'];
  validateApiKey(apiKey: string) {
    return this.apiKeys.find((apiK) => apiKey === apiK);
  }
}
