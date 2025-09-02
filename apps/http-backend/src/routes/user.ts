import { Router } from "express";
import { createUser, findUser } from "../data";

const router: Router = Router();

router.post("/signup", (req, res) => {
  /*
  BODY:
    {
	email: "harkirat@gmail.com",
	password: "123123"
    }

    RESPONSE: 
    403
    {
	message: "Error while signing up"
    }

    200
    {
	userId: "uuid"
    }
  */

  const { email, password } = req.body;
  if (!email || !password) {
    res.status(403).json({
      message: "Error while signing up",
    });
    return;
  }
  const userId = createUser(email, password);

  res.json({
    userId,
  });
});

router.post("/signin", (req, res) => {
  /*
  BODY
    {
	email: "harkirat@gmail.com",
	password: "123123"
    }

    RESPONSE
    403
    {
	message: "Incorrect credentials"
    }

    200{
    {
	token: "jwt"
    }
  */
  const { email, password } = req.body;
  const user = findUser(email, password);
  if (!user) {
    res.status(403).json({
      message: "Incorrect credentials",
    });
    return;
  }
  res.json({
    //maybe return jwt acc to spec
    userId: user.id,
  });
});

router.get("/balance", (req, res) => {
  /*
    RESPONSE
    {
	"usd_balance": 500000 // Decimals is 2
    }
     */
});

export { router as userRouter };
