export class ApiResponse {
    constructor(statusCode, data, message="success"){
        this.info = data
        this.statusCode = statusCode
        this.message = message
        this.success = statusCode < 400
    }
}