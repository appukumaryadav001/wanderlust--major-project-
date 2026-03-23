import { Router } from "express";
const router = Router();
import {getSignup,
    signup,
    getLogin,
    login,
    logout
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";

import {saveRedirectUrl} from "../middlewares/auth.middleware.js";

router.route("/signup")
      .get(getSignup)
      .post(upload.single("avatar"),signup);

router.route("/login")
      .get(saveRedirectUrl,getLogin)
      .post(saveRedirectUrl,login);

router.route("/logout").post(logout);

export default router;