const errorMiddleware = (err, req, res, next) => {
    //for debugging purposes
    console.error(err.stack);
    const statusCode = err.status || 500;
    const errorMessage = err instanceof Error ? err.message : 'Something went wrong!';
    // Send the response
    res.status(statusCode).json({
        success: false,
        message: errorMessage,
    });
};

module.exports = { errorMiddleware };
