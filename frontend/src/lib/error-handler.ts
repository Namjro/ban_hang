export interface ApiErrorShape {
  response?: {
    status?: number;
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
  message?: string;
}

export function getApiErrorMessage(
  err: unknown,
  fallback = 'Đã xảy ra lỗi kết nối. Vui lòng kiểm tra lại.'
): string {
  const apiErr = err as ApiErrorShape;
  const responseData = apiErr?.response?.data;

  if (responseData?.errors) {
    const firstFieldErrors = Object.values(responseData.errors)[0];
    if (Array.isArray(firstFieldErrors) && firstFieldErrors.length > 0) {
      return firstFieldErrors[0];
    }
  }

  if (responseData?.message) {
    return responseData.message;
  }

  return fallback;
}
