import rateLimit from "express-rate-limit";
export const limiter =rateLimit({
  windowMs:5*60*1000,
  limit:100,
  message:"Too many request."
});

// export default limiter;