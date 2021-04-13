
const mailchimp = require("@mailchimp/mailchimp_marketing");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("assets"));
app.listen(process.env.PORT||3000,function () {
    console.log("Server is running at port 3000");
});
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});
mailchimp.setConfig({
    apiKey:  "daeb322df78d7f2aacd49c4de941a8a3-us1",
    server: "us1"
});
app.post("/", function (req,res) {
    const firstName = req.body.fname;
    const secondName = req.body.lname;
    const email = req.body.email;
    const listId = "a1d8c8d550";
    const subscribingUser = {
        firstName: firstName,
        lastName: secondName,
        email: email
    };
    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });
        res.sendFile(__dirname + "/success.html")

    }
    run().catch(e => res.sendFile(__dirname + "/failure.html"));
});
