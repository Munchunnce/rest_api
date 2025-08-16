class CustomErrorHandle extends Error {
    constructor(status, msg){
        super();
        this.status = status;
        this.message = msg;
    }
    // register
    static alreadyExist(message) {
        return new CustomErrorHandle(409, message);
    };
    //login
    static wrongCredentials(message = 'User name and password is wrong!') {
        return new CustomErrorHandle(401, message);
    }
    // header Un-authorization
    static unAuthorized(message = 'unAuthorized!') {
        return new CustomErrorHandle(401, message);
    }
    // not fount 404
    static notFound(message = '404 not found') {
        return new CustomErrorHandle(404, message);
    }
};

export default CustomErrorHandle;