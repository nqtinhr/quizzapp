// Dùng cho request
export interface IPagination {
  page?: number
  limit?: number
  search?: string
}

// Dùng cho response
export interface IPaginationMeta {
  page: number
  limit: number
  totalRows: number
}

export interface IResponse<T> {
  data: T
  pagination: IPaginationMeta
}

export interface IResult {
  data: any
  statusCode: number
}