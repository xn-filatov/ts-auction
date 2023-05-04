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

// const baseApiUrl = env.BASE_API_URL;
// const apikey = env.API_KEY;

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

app.post("/users/deposit", authenticateToken, async (req, res) => {
  let { login, amount } = req.body;
  amount = parseInt(amount)
  try {

    if (amount <= 0)
      return res.status(401).send("Deposit amount must be greater than 0");

    const user = await User.findOne({
      where: { login: login },
    });

    if (!user)
      return res.status(404).send("User not found");


    user.balance += parseInt(amount)
    await user.save()

    res.send(user);
  } catch (error) {
    res.status(500).send("Internal error");
    console.log(error);
  }
});

app.post("/bidItems/create", authenticateToken, async (req, res) => {
  let { name, startPrice, duration } = req.body;
  startPrice = parseInt(startPrice)
  duration = parseInt(duration)
  try {

    if (startPrice <= 0)
      return res.status(401).send("Start price must be greater than 0");

    if (duration <= 0)
      return res.status(401).send("Time window must be greater than 0");

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

app.post("/bidItems/bid", authenticateToken, async (req, res) => {
  let { id, amount } = req.body;
  amount = parseInt(amount)
  try {

    const bidItem = await Bid.findOne({ where: { id: id } })

    if (!bidItem)
      return res.status(404).send("Bid item not found");

    const bidExpirationTime = bidItem.createdAt.getTime() + bidItem.duration;
    if (Date.now() > bidExpirationTime)
      return res.status(404).send("Bidding period has expired");


    if (amount <= bidItem.startPrice)
      return res.status(401).send("Bid price must be greater than previous price");

    bidItem.startPrice = amount;
    await bidItem.save()

    res.send(bidItem);
  } catch (error) {
    res.status(500).send("Internal error");
    console.log(error);
  }
});

app.get("/bidItems", authenticateToken, async (req, res) => {
  try {
    const bidItems = await Bid.findAll()

    res.send(bidItems);
  } catch (error) {
    res.status(500).send("Internal error");
    console.log(error);
  }
});

app.listen(port, async () => {
  await sequelize.sync({ force: true });
  console.log(`App listening on port ${port}`);
});
