// src/shared/email/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import {
  EmailOptions,
  WelcomeEmailContext,
  PasswordResetContext,
  VerificationEmailContext,
} from './interface/mail.interface';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.createTransporter();
  }
  private createTransporter() {
    const config = {
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: this.configService.get<boolean>('MAIL_SECURE', false),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    };

    // For Ethereal Email, use different settings
    if (config.host === 'smtp.ethereal.email') {
      config.secure = false;
      config.port = 587;
    }

    this.transporter = nodemailer.createTransport(config);

    this.logger.log(
      `Email transporter created for ${config.host}:${config.port}`,
    );
  }

  private async loadTemplate(templateName: string): Promise<string> {
    const templatePath = path.join(
      __dirname,
      'template',
      `${templateName}.hbs`,
    );
    return fs.readFileSync(templatePath, 'utf8');
  }

  private compileTemplate(template: string, context: any): string {
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(context);
  }

  async sendMail(options: EmailOptions): Promise<void> {
    try {
      let html = options.html;

      // If template is specified, compile it
      if (options.template && options.context) {
        const template = await this.loadTemplate(options.template);
        html = this.compileTemplate(template, options.context);
      }

      const mailOptions = {
        from: this.configService.get<string>('MAIL_FROM'),
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html,
        text: options.text,
        attachments: options.attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Email sent successfully to ${options.to}. Message ID: ${result.messageId}`,
      );
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}`, error.stack);
      throw new Error('Failed to send email');
    }
  }

  async sendWelcomeEmail(
    to: string,
    context: WelcomeEmailContext,
  ): Promise<void> {
    await this.sendMail({
      to,
      subject: 'Welcome to Our App!',
      template: 'welcome',
      context,
    });
  }

  async sendPasswordResetEmail(
    to: string,
    context: PasswordResetContext,
  ): Promise<void> {
    await this.sendMail({
      to,
      subject: 'Password Reset Request',
      template: 'password-reset',
      context,
    });
  }

  async sendVerificationEmail(
    to: string,
    context: VerificationEmailContext,
  ): Promise<void> {
    await this.sendMail({
      to,
      subject: 'Verify Your Email Address',
      template: 'verification',
      context,
    });
  }

  // Generic method for custom emails
  async sendCustomEmail(
    to: string | string[],
    subject: string,
    html: string,
    text?: string,
  ): Promise<void> {
    await this.sendMail({
      to,
      subject,
      html,
      text,
    });
  }

  // Test email connection
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('Email connection verified successfully');
      return true;
    } catch (error) {
      this.logger.error('Email connection failed', error.stack);
      return false;
    }
  }
}
