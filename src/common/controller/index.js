'use strict';


class HttpError extends Error {

    constructor(message, code) {
        super(message);

        this.code = code;
    }


    sendError(res) {
        return res.status(this.code).send(this.message);
    }


    static build(res) {
        switch (res.statusCode) {
            case 404: {
                return new ResourceNotFoundError(res.body);
            }

            case 500: {
                return new HttpError(res.body, 500);
            }

            case 502: {
                return new HttpError(res.body, 502);
            }

            default: {
                return new HttpError(res.message, res.statusCode);
            }
        }
    }
}



class ResourceNotFoundError extends HttpError {

    constructor(message) {
        super(message, 404);
    }
}



class ServerError extends HttpError {

    constructor(message) {
        super(message, 500);
    }
}



function decorate(method) {
    return async function newMethod() {
        const next = arguments[2];

        try {
            await method.apply(this, arguments);
        }
        catch (err) {
            err.serverMessage = `${this.constructor.name}.${method.name}: ${err.message}`;

            return next(err);
        }
    };
}



class Controller {

    constructor(methodNames) {
        let names;
        if (methodNames) {
            names = methodNames;
        }
        else {
            const publicMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
            names = publicMethods.filter((name) =>
                !name.startsWith('_') &&
                !name.startsWith('can') && // Add middleware methods
                name !== 'constructor' &&
                this[name] instanceof Function
            );
        }

        names.forEach((name) => {
            this[name] = decorate(this[name]).bind(this);
        });
    }


    sendData(res, data) {
        return res.status(200).json(data);
    }


    sendDataCreated(res, data) {
        return res.status(201).json(data);
    }


    sendNoData(res) {
        return res.status(204).send();
    }
}



////////////

module.exports = {
    Controller,
    HttpError,
    ResourceNotFoundError,
    ServerError,
};
