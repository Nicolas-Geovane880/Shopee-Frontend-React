export class InvalidTokenException extends Error {
    
    constructor (status, message) {
        super (message);
    }
}