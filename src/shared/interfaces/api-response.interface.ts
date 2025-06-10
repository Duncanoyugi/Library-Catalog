export interface ApiResponse<T> {
  sucess: boolean;
  message: string;
  data?: T;
  error?: string;
}
