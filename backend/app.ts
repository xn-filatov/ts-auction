import express from "express";
import cors from "cors";

import { sequelize } from "./database/sequelize";
import User from "./database/models/User";
import Bid from "./database/models/Bid";
import { generateAccessToken } from "./utils";
import { authenticateToken } from "./middlewares";
import env from './environment'

const app = express();
const port = env.PORT || 3000;

app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/users/checkToken", authenticateToken, async (req, res) => {
  res.sendStatus(200);
});

app.post("/users", async (req, res) => {
  const { login, password } = req.body;

  try {
    const [user, isCreated] = await User.findOrCreate({
      where: { login: login },
      defaults: { login: login, password: password, balance: 0 } as User,
    });

    if (!isCreated && user.password != password) {
      return res.status(403).send("Wrong password!");
    }

    res.send({ ...user.get(), token: generateAccessToken(login) });


  } catch (error) {
    res.status(500).send("Internal error");
    console.log(error);
  }
});

app.post("/users/deposit", authenticateToken, async (req: any, res) => {
  let { amount } = req.body;
  const login = req.user;

  try {
    amount = parseFloat(amount)

    if (amount <= 0)
      return res.status(402).send("Deposit amount must be greater than 0");

    const user = await User.findOne({
      where: { login: login },
    });

    if (!user)
      return res.status(404).send("User not found");


    user.balance += amount
    await user.save()

    res.send(user);
  } catch (error) {
    res.status(500).send("Internal error");
    console.log(error);
  }
});

app.get("/users/balance", authenticateToken, async (req: any, res) => {
  const login = req.user;

  try {
    const user = await User.findOne({
      where: { login: login },
    });

    if (!user)
      return res.status(404).send("User not found");


    res.send({ balance: user.balance });
  } catch (error) {
    res.status(500).send("Internal error");
    console.log(error);
  }
});

app.post("/bidItems/create", authenticateToken, async (req, res) => {
  let { name, startPrice, duration } = req.body;
  try {
    startPrice = parseFloat(startPrice)
    duration = parseInt(duration) * 60 * 60 * 1000 // To miliseconds

    if (startPrice <= 0)
      return res.status(402).send("Start price must be greater than 0");

    if (duration <= 0)
      return res.status(402).send("Time window must be greater than 0");

    const newBidItem = await Bid.create({
      name: name,
      startPrice: startPrice,
      duration: duration
    } as Bid)

    res.send(newBidItem);
  } catch (error) {
    res.status(500).send("Internal error");
    console.log(error);
  }
});

app.post("/bidItems/bid", authenticateToken, async (req: any, res) => {
  let { id, amount } = req.body;
  const login = req.user;
  try {
    amount = parseFloat(amount)

    const bidItem = await Bid.findOne({ where: { id: id } })

    if (!bidItem)
      return res.status(404).send("Bid item not found");

    const bidExpirationTime = bidItem.createdAt.getTime() + bidItem.duration;
    if (Date.now() > bidExpirationTime)
      return res.status(404).send("Bidding period has expired");


    if (amount <= bidItem.startPrice)
      return res.status(402).send("Bid price must be greater than previous price");

    const user = await User.findOne({ where: { login: login } })

    if (amount > user!.balance)
      return res.status(402).send("Insufficient balance");

    bidItem.startPrice = amount;
    await bidItem.save()

    res.send(bidItem);
  } catch (error) {
    res.status(500).send("Internal error");
    console.log(error);
  }
});

app.get("/bidItems",/* authenticateToken,*/ async (req, res) => {
  try {
    const bidItems = await Bid.findAll()

    res.send(bidItems);
  } catch (error) {
    res.status(500).send("Internal error");
    console.log(error);
  }
});

app.get("/", async (req, res) => {
  try {
    res.send({ a: 1, b: 2, c: 3 });
  } catch (error) {
    res.status(500).send("Internal error");
    console.log(error);
  }
});

app.listen(port, async () => {
  console.log("SERVER STARTED")
  console.log(env.DB, env.DIALECT)
  await sequelize.sync({ force: true });
  console.log(`App listening on port ${port}`);
});
