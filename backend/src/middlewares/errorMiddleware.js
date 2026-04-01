export  const notFound = (req, res, next) => {
    const error = new Error (`Route not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);

};

export const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // for mongoose bad objectid error

    if (err.name === 'CastError00') {
        statusCode = 404;
        message = 'Resource not found';
    }

    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
    }
    res.status(statusCode).json({
        sucess: false,
        message,
        stack: process.env.NODE_ENV ==='production' ? null : err.stack,
    });
};