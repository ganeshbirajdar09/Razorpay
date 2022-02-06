require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const app = express();

app.use(express.static("./public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hi");
});

// this route is only responsible for deducting the amount
app.post("/order", async (req, res) => {
  const amount = req.body.amount;

  //docs - https://razorpay.com/docs/api/orders/#create-an-order
  var instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
  });

  var options = {
    // you can also create a seperate 'options' obj and then pass it here

    amount: amount * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11", // you can also use uuid or nanoid
  };

  const myOrder = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    amount,
    order: myOrder,
  });
});

app.listen(4000, () => console.log("Server is running at port 4000"));
