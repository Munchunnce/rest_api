class CustomErrorHandle extends Error {
    constructor(status, msg){
        super();
        this.status = status;
        this.message = msg;
    }

    static alreadyExist(message) {
        return new CustomErrorHandle(409, message);
    };

    static wrongCredentials(message = 'User name and password is wrong!') {
        return new CustomErrorHandle(401, message);
    }
};

export default CustomErrorHandle;