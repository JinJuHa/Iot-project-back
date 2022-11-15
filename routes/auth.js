const express = require("express");
const {
  signup,
  signin,
  checkEmail
} = require("../controllers/auth");

const router = express.Router();

// 회원가입 기능
router.post("/join", signup);
// 로그인 기능
router.post("/login", signin);
// 이메일에 대한 중복 체크
router.get("/check-email/:email", checkEmail);


module.exports = router;
