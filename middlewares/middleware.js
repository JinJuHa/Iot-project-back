const jwt = require("jsonwebtoken");
const RateLimit = require("express-rate-limit");
const resCode = require("../libs/error");

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    req.decoded = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // 유효기간 초과
      const errResponse = resCode.TOKEN_EXPIRED_ERROR;
      console.log(errResponse);
      return res.status(errResponse.code).json(errResponse);
    }
    console.log(error);
    const errResponse = JSON.parse(JSON.stringify(resCode.UNAUTHORIZED_ERROR));
    console.log(errResponse);
    return res.status(errResponse.code).json(errResponse);
  }
};

exports.apiLimiter = RateLimit({
  windowMs: 60 * 1000, // 1분
  max: 10,
  delayMs: 0,
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode, // 기본값 429
      message: "1분에 한 번만 요청할 수 있습니다.",
    });
  },
});


// 관리자 권한 확인 미들웨어
exports.checkManager = async (req, res, next) => {
  try {
    if (!req.decoded.isManager) {
      const error = resCode.FORBIDDEN_ERROR;
      console.error("No Manager");
      return res.status(error.code).json(error);
    } else {
      console.log("User is Manager");
      next();
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error);
    error.statusCode = 500;
    next(error);
  }
};
