const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/signup.html");
});

// Sign up routes
app.post("/", (req, res) => {
	// get data from the inputs form
	const firstName = req.body.first_name;
	const lastName = req.body.last_name;
	const email = req.body.email;

	// data to send
	const data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName,
				},
			},
		],
	};

	// make a request to the external endpoint
	const jsonData = JSON.stringify(data);
	const url = "https://us21.api.mailchimp.com/3.0/lists/90d9a14d97";
	const options = {
		method: "POST",
		auth: "ayak01:41c0b0c3d998703981bbbeebcff41a1f-us21",
	};

	const request = https.request(url, options, (response) => {
		if (response.statusCode === 200) {
			res.sendFile(__dirname + "/success.html");
		} else {
			res.sendFile(__dirname + "/failure.html");
		}

		response.on("data", (data) => {
			console.log(JSON.parse(data));
		});
	});

	// request.write(jsonData);
	request.end();
});

app.post("/failure", (req, res) => {
	res.redirect("/");
});

const port = process.env.PORT | 3000;

app.listen(port, "127.0.0.1", () => {
	console.log(`Server is running and listening on port ${port}`);
});
