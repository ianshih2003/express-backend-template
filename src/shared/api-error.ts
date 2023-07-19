export class ApiError extends Error {
  public readonly httpStatus: number;

  constructor(
    public message: string,
    public readonly stack?: string,
    httpStatus?: number,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.httpStatus = httpStatus !== undefined ? httpStatus : 500;
  }

  public static fromError(error: Error) {
    const { response } = error as any;
    const httpStatus = response ? response.status : 500;
    const httpMessage = response ? response.statusText : error.message;
    return new ApiError(httpMessage, error.stack, httpStatus);
  }
}
