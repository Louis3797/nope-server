// Todo - Maybe find a better name for this class - AppError, ServerError, APIError ?
export default class GameError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}
