import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Logger,
} from '@nestjs/common';
import { FirsService } from './firs.service';
import { WebhookPayloadDto, WebhookResponseDto } from './dtos';

@Controller('api/v1/firs')
export class FirsController {
  private readonly logger = new Logger(FirsController.name);

  constructor(private readonly firsService: FirsService) {}

  /**
   * Webhook endpoint to receive notifications from FIRS.
   * This endpoint accepts POST requests and responds with 200 OK to confirm receipt.
   * @param payload - The webhook payload containing IRN and message status.
   * @returns A response indicating successful processing.
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async handleWebhook(
    @Body() payload: WebhookPayloadDto,
  ): Promise<WebhookResponseDto> {
    this.logger.log(`Received webhook request for IRN: ${payload.irn}`);

    try {
      const response =
        await this.firsService.handleWebhookNotification(payload);
      this.logger.log(`Webhook processed successfully for IRN: ${payload.irn}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to process webhook for IRN: ${payload.irn}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Admin endpoint to manually trigger processing of failed webhooks.
   * This can be used for testing or manual retry of failed webhooks.
   */
  @Post('webhook/retry-failed')
  @HttpCode(HttpStatus.OK)
  async retryFailedWebhooks(): Promise<{ message: string }> {
    this.logger.log('Manual retry of failed webhooks triggered');

    try {
      await this.firsService.processFailedWebhooks();
      return { message: 'Failed webhooks processing completed' };
    } catch (error) {
      this.logger.error('Failed to process failed webhooks', error.stack);
      throw error;
    }
  }
}
