export type ApiResponse<T = any> = {
    status: string;
    timestamp: string;
    message: string;
    data: T | null;
    statusCode: number;
}

export type PaginatedResult<T> = {
    meta: Meta;
    result: T[];
}

export type Meta = {
    page: number; // 1-indexed for UI, but might come as 0 or 1 from API
    pageSize: number;
    pages: number;
    total: number;
}
