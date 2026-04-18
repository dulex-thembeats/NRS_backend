/**
 * Entity representing the confirmation details of an invoice.
 */
export class ConfirmEntity {
  /**
   * The date the invoice was issued.
   */
  readonly issueDate: string;

  /**
   * The due date for the invoice payment.
   */
  readonly dueDate: string;

  /**
   * The date the invoice was synchronized.
   */
  readonly syncDate: string;

  /**
   * The payment status of the invoice.
   */
  readonly paymentStatus: string;

  /**
   * Indicates if the invoice was transmitted.
   */
  readonly transmitted: boolean;

  /**
   * Indicates if the invoice was delivered.
   */
  readonly delivered: boolean;

  /**
   * Creates a new ConfirmEntity.
   * @param params - The confirmation details.
   */
  constructor(params: {
    issueDate: string;
    dueDate: string;
    syncDate: string;
    paymentStatus: string;
    transmitted: boolean;
    delivered: boolean;
  }) {
    this.issueDate = params.issueDate;
    this.dueDate = params.dueDate;
    this.syncDate = params.syncDate;
    this.paymentStatus = params.paymentStatus;
    this.transmitted = params.transmitted;
    this.delivered = params.delivered;
  }
}
