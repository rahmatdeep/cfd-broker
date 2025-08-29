import { Router } from "express";

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
});

router.get("/balance", (req, res) => {
    /*
    RESPONSE
    {
	"usd_balance": 500000 // Decimals is 2
    }
     */
})

export { router as userRouter };
