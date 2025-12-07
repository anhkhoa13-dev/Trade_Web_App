export type ApiResponse<T = any> = {
    status: string;
    timestamp: string;
    message: string;
    data: T | null;
    statusCode: number;
};