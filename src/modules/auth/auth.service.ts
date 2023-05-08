import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // KEYS
  private apiKeys: string[] = ['x1jb520220hdvi71u7yv5bc0jf8wj634'];
  validateApiKey(apiKey: string) {
    return this.apiKeys.find((apiK) => apiKey === apiK);
  }
}
