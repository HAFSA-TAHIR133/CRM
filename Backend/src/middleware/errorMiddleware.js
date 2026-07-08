export const errorHandler = (err,req,res,next)=>{
        logger.error({
        Time: new Date(),
        Method: req.method,
        URL: req.originalUrl,
        Error: err.message
});

    res.status(500).json(
        {message:'Something went wrong in server',
            error:err.message
        }
    );
};
