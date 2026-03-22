import { Injectable } from '@nestjs/common';

// Redis removed — all operations are no-ops
@Injectable()
export class RedisService {
  async get(_key: string): Promise<string | null> { return null; }
  async set(_key: string, _value: string, _ttl?: number): Promise<void> {}
  async del(_key: string): Promise<void> {}
  async getJson<T>(_key: string): Promise<T | null> { return null; }
  async setJson<T>(_key: string, _value: T, _ttl?: number): Promise<void> {}
}
