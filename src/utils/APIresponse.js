class APIresponse {
  constructor(statuscode, data, message = "Succes") {
    this.statuscode = statuscode;
    this.data = data;
    this.message = message;
    this.success = statuscode < 400;
  }
}

export default APIresponse;
