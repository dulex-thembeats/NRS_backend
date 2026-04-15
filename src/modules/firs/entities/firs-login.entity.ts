/**
 * Entity representing the response from FIRS login.
 */
export class FirsLoginResponseEntity {
  /**
   * The unique identifier for the login session.
   */
  readonly id: string;

  /**
   * The status of the login response.
   */
  readonly status: string;

  /**
   * The message returned by the FIRS API.
   */
  readonly message: string;

  /**
   * The timestamp when the response was received.
   */
  readonly receivedAt: string;

  /**
   * The unique identifier of the entity.
   */
  readonly entityId: string;

  /**
   * Create a new FirsLoginResponseEntity.
   * @param params The parameters to create a FirsLoginResponseEntity.
   */
  constructor(params: {
    id: string;
    status: string;
    message: string;
    received_at: string;
    entity_id: string;
  }) {
    this.id = params.id;
    this.status = params.status;
    this.message = params.message;
    this.receivedAt = params.received_at;
    this.entityId = params.entity_id;
  }
}
