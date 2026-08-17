export interface ApiError {
  success: false;

  status: number;

  message: string;

  errors?: Record<string, string>;
}
