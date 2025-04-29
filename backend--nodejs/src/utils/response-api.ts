export class ResponseApi {
  static response(data: DataResponse) {
    return data;
  }
}

type DataResponse = {
  message?: string;
  data?: any;
};
