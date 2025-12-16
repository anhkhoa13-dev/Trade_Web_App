export type ApiSuccess<T> = {
    status: "success",
    timestamp: string,
    message: string,
    data: T,
    statusCode: number
}

export type ApiError = {
    status: "error",
    timestamp: string,
    message: string,
    data: null,
    statusCode: number
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type PaginatedResult<T> = {
    meta: Meta;
    result: T[];
}

export type Meta = {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
}
