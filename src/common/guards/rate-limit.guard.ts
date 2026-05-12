import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private requests = new Map<string, { count: number; timestamp: number }>();
  private readonly WINDOW_MS = 60000; // 1 minute
  private readonly MAX_REQUESTS = 5;

  constructor() {
    // Periodically clean up old entries to prevent memory leaks
    setInterval(() => this.cleanup(), this.WINDOW_MS * 2).unref();
  }

  private cleanup() {
    const now = Date.now();
    for (const [ip, record] of this.requests.entries()) {
      if (now - record.timestamp >= this.WINDOW_MS) {
        this.requests.delete(ip);
      }
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.connection?.remoteAddress || 'unknown';
    
    const now = Date.now();
    const record = this.requests.get(ip);

    if (record) {
      if (now - record.timestamp < this.WINDOW_MS) {
        if (record.count >= this.MAX_REQUESTS) {
          throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS);
        }
        record.count++;
      } else {
        this.requests.set(ip, { count: 1, timestamp: now });
      }
    } else {
      this.requests.set(ip, { count: 1, timestamp: now });
    }

    return true;
  }
}
