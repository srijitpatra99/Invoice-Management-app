require("dotenv").config();
const cron = require("node-cron");
const express = require("express");
const mongoose = require("mongoose");

const Invoice = require("./models/invoice");
const invoiceRoutes = require("./routes/invoice");
const mail = require("./mail/mail");

const port = process.env.PORT;
const mongo_url = process.env.mongo_uri;

const app = express();

app.use(express.json());

//this helps in cross platform communication to avoid CORS error
app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type , Authorization');
    next();
});

app.use("/api",invoiceRoutes);

//error handling middleware
app.use((error, req, res, next) =>{
    console.log(error);
    const status = error.statusCode || 500;
    const msg = error.message;
    res.status(status).json({message : msg});
});

//Checking the database for invoice status every 23 hours a day to send alerts regarding the deadline of invoice to respective email
cron.schedule('*/59 */23 * * *', () => {
    console.log("cron is running");
    const DateNow = new Date();
    Invoice.find({status:'outstanding',dueDate: { $lte : DateNow.getTime()} })
            .then( invoices =>{
                for(let invoice of invoices)
                {
                    invoice.status = "late";
                    invoice.save()
                            .then( result =>{
                                const emailBody = `
                                <h2> Invoice details </h2>
                                <p><b><u>Labour</u></b><br>Hours worked : ${result.labour.hours_Of_Work}<br>Cost Per Hour : ${result.labour.price_per_hour}</p>
                                <p><b><u>Materials Used</u></b><br> ${result.materialUsed}</p>
                                <p><b><u>Due Date</u></b><br> ${result.dueDate}</p>
                                <p><b><u>Notes</u></b><br> ${result.notes}</p>
                                <p><b><u>Status</u></b><br> ${result.status}</p>
                                `;
                                mail(result.email, "Your Invoice Is Overdue Pay Now!!! ✔", emailBody);
                            });
                }
            })
            .catch(err =>{
                res.status(500).json({
                    error:err
                });
            });
    
    Invoice.find({status:'outstanding',dueDate: { $lt : DateNow.getTime()+(24*60*60*1000)} })
            .then( invoices =>{
                for(let result of invoices)
                {
                    const emailBody = `
                    <h2> Invoice details </h2>
                    <p><b><u>Labour</u></b><br>Hours worked : ${result.labour.hours_Of_Work}<br>Cost Per Hour : ${result.labour.price_per_hour}</p>
                    <p><b><u>Materials Used</u></b><br> ${result.materialUsed}</p>
                    <p><b><u>Due Date</u></b><br> ${result.dueDate}</p>
                    <p><b><u>Notes</u></b><br> ${result.notes}</p>
                    <p><b><u>Status</u></b><br> ${result.status}</p>
                    `;
                    mail(result.email, "Only One Day Left To Pay Your Invoice ✔", emailBody);
                }
            })
            .catch(err =>{
                res.status(500).json({
                    error:err
                });
            });
});

mongoose.connect( mongo_url )
        .then(result =>{
            console.log("database connected");
            console.log("listening to " + port);
            app.listen(port);
        })
        .catch(err => console.log(err));