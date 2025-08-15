class CustomErrorHandle extends Error {
    constructor(status, msg){
        this.status = status;
        this.message = msg;
    }

    static alreadyExist(message) {
        return new CustomErrorHandle(409, message);
    }
};

export default CustomErrorHandle;