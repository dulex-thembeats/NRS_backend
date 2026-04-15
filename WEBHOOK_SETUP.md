# FIRS Webhook Setup Guide

This document provides instructions for setting up and configuring webhooks for the FIRS e-Invoice system.

## Overview

Webhooks play a critical role in the e-Invoice exchange process, acting as the real-time communication mechanism between the FIRS Exchange System and Access Point Providers (APP). They notify registered APPs of invoice transmission events, ensuring all parties are promptly informed and able to take appropriate action.

## Webhook Configuration

### 1. Register Webhook URL

Each Access Point Provider must configure a Webhook URL on their respective APP portal:

1. Log in to your Service Provider as an Access Point Provider at [https://einvoice.firs.gov.ng/app/developers](https://einvoice.firs.gov.ng/app/developers)
2. Navigate to the Developer section
3. Locate the field labeled "Webhook URL" and input your endpoint URL: `https://your-domain.com/firs/webhook`
4. Click "Add Webhook URL" to register it
5. Upon successful registration, the system will automatically dispatch a Test Notification to validate the URL's reachability

### 2. Webhook Endpoint Requirements

Your webhook endpoint must:

- Accept POST requests
- Respond with a 200 OK HTTP status to confirm successful receipt
- Handle the webhook payload format specified below
- Implement proper error handling and logging

## Webhook Payload Format

### Sample Payload

```json
{
  "irn": "INV0990-088ED42R-20270920",
  "message": "TRANSMITTING"
}
```

### Payload Fields

| Field     | Type   | Description              | Possible Values                                         |
| --------- | ------ | ------------------------ | ------------------------------------------------------- |
| `irn`     | string | Invoice Reference Number | Valid IRN format                                        |
| `message` | string | Transmission status      | `TRANSMITTING`, `TRANSMITTED`, `ACKNOWLEDGED`, `FAILED` |

## Implementation Details

### Webhook Endpoint

The webhook endpoint is available at: `POST /firs/webhook`

### Response Format

```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Status Handling

The system handles different webhook statuses as follows:

- **TRANSMITTING**: Invoice is being transmitted to FIRS
- **TRANSMITTED**: Invoice has been successfully transmitted
- **ACKNOWLEDGED**: Invoice has been acknowledged by the recipient
- **FAILED**: Invoice transmission failed

### Database Models

The system uses two main models for webhook processing:

#### WebhookEvent

- Tracks all incoming webhook events
- Stores processing status and retry information
- Enables audit trail and debugging

#### Invoice

- Stores invoice status updates
- Tracks transmission timestamps
- Maintains invoice lifecycle information

## Error Handling and Retry Logic

### Automatic Retry

- Failed webhooks are automatically retried up to 3 times
- Retry attempts are logged with error messages
- Processing continues even if individual webhooks fail

### Manual Retry

- Admin endpoint available at: `POST /firs/webhook/retry-failed`
- Allows manual triggering of failed webhook processing
- Useful for testing and recovery scenarios

### Logging

- All webhook events are logged for audit purposes
- Error details are captured for debugging
- Processing status is tracked in the database

## Security Considerations

### Validation

- All incoming webhook payloads are validated using class-validator
- Invalid payloads are rejected with appropriate error messages
- IRN format and message status are validated

### Error Handling

- Failed webhooks don't expose sensitive information
- Error messages are logged internally for debugging
- System continues processing other webhooks even if one fails

## Testing

### Test Webhook

```bash
curl -X POST http://localhost:3000/firs/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "irn": "INV0990-088ED42R-20270920",
    "message": "TRANSMITTING"
  }'
```

### Retry Failed Webhooks

```bash
curl -X POST http://localhost:3000/firs/webhook/retry-failed
```

## Monitoring

### Key Metrics to Monitor

- Webhook processing success rate
- Average processing time
- Number of failed webhooks
- Retry attempt frequency

### Log Analysis

- Monitor webhook event logs for patterns
- Track processing errors and their frequency
- Analyze retry patterns to identify systemic issues

## Troubleshooting

### Common Issues

1. **Webhook not received**
   - Verify webhook URL is correctly registered
   - Check network connectivity and firewall settings
   - Ensure endpoint is publicly accessible

2. **Processing failures**
   - Check database connectivity
   - Verify Prisma client is up to date
   - Review error logs for specific failure reasons

3. **High retry rates**
   - Investigate underlying system issues
   - Check database performance
   - Review webhook processing logic

### Debug Commands

```bash
# Check webhook events
npx prisma studio

# View recent webhook logs
tail -f logs/webhook.log

# Test webhook endpoint
curl -X POST http://localhost:3000/firs/webhook -H "Content-Type: application/json" -d '{"irn":"test","message":"TRANSMITTING"}'
```

## Production Considerations

### High Availability

- Ensure webhook endpoint has high availability
- Implement proper load balancing
- Use health checks to monitor endpoint status

### Performance

- Process webhooks asynchronously when possible
- Implement proper database indexing
- Monitor processing times and optimize as needed

### Security

- Implement rate limiting on webhook endpoints
- Use HTTPS for all webhook communications
- Validate webhook signatures if provided by FIRS

## Support

For issues related to webhook processing:

1. Check the application logs for error details
2. Review the database for failed webhook events
3. Test the webhook endpoint manually
4. Contact the development team with specific error details

