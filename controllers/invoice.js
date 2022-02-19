require("dotenv").config();
const { validationResult } = require("express-validator");

const Invoice = require("../models/invoice");
const mail = require("../mail/mail");

exports.getAllInvoices = async (req,res,next)=>{
    await Invoice.find()
           .then( invoices =>{
               res.status(200).json({
                   message: "Fetched invoices succcessfully",
                   invoices_info: invoices,
               });
            })
            .catch(err =>{
                if(!err.statusCode)
                {
                    err.statusCode = 500;
                }
                next(err);
            });
};

exports.generateInvoice = (req,res,next) =>{

    const email = req.body.email;
    
    //labour
    const hours_Of_Work = req.body.labour.hours_Of_Work;
    const price_per_hour = req.body.labour.price_per_hour;
    
    
    //an array of materials object consumed with their respective name , price and quantity
    const arrMaterials = [...req.body.materialUsed];
    
    const dueDate = req.body.dueDate;
    
    //extra info
    const notes = req.body.notes;
    
    //online payment or offline payment
    const modeOfPayment = req.body.modeOfPayment;
    var onlinePayment = {};
    var offlinePayment = {};
    if(modeOfPayment == "online")
    {
        onlinePayment.upiId = req.body.upiId;        
    }
    else
    {
        offlinePayment.accountNumber = req.body.accountNumber;
        offlinePayment.ifscCode = req.body.ifscCode;
    }

    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        const msg=errors.array()[0].msg;
        console.log(msg);
        return res.status(500).json({
                    message:msg,
                });       
    }
  
    const status = req.body.status || "outstanding";
    
    //storing data in database
    const invoice = new Invoice({
        email:email,
        labour:{
            hours_Of_Work:hours_Of_Work,
            price_per_hour:price_per_hour,
        },
        materialUsed: arrMaterials,
        dueDate:dueDate,
        notes:notes,
        onlinePayment:onlinePayment,
        offlinePayment:offlinePayment,
        status: status,
    });

    invoice.save()
            .then( result => {
                const emailBody = `
                <h2> Invoice details </h2>
                <p><b><u>Labour</u></b><br>Hours worked : ${result.labour.hours_Of_Work}<br>Cost Per Hour : ${result.labour.price_per_hour}</p>
                <p><b><u>Materials Used</u></b><br> ${result.materialUsed}</p>
                <p><b><u>Due Date</u></b><br> ${result.dueDate}</p>
                <p><b><u>Notes</u></b><br> ${result.notes}</p>
                <p><b><u>Status</u></b><br> ${result.status}</p>
                <p><b><u>ModeOfPayment</u></b><br> ${modeOfPayment}</p>
                `;
                mail(email , "A New Invoice has been generated ✔" , emailBody);
                res.status(201).json({
                    message: "Invoice generated successfully and details has been sent to your registered EmailId",
                    invoice: result
                });
            })
            .catch(err => {
                if(!err.statusCode)
                {
                    err.statusCode = 500;
                }
                next(err);
            });
    
};


exports.getInvoice = async (req,res,next)=>{
    const invoice_id = req.params.invoiceId;
    await Invoice.findById({_id: invoice_id})
            .then( invoiceData =>{
                res.status(200).json({
                    message:"Invoice found !!!",
                    invoice_info : invoiceData,
                });
            })
            .catch(err =>{
                if(!err.statusCode)
                {
                    err.statusCode = 500;
                }
                next(err);
            })
};

exports.updateInvoiceStatus = async(req,res,next) =>{
    const invoice_id = req.params.invoiceId;
    const paid = req.query.paid;
    const late = req.query.late;

    if(!paid && !late)
    {
        const error =  new Error("Final status of the invoice not found");
        error.statusCode = 500;
        next(error);
        return;
    }
    await Invoice.findById({_id:invoice_id})
                 .then( invoiceData =>{
                     let msg ="";
                     if(paid)
                     {
                        invoiceData.status = "paid";
                        msg = "Invoice Status Changed to paid please check your email";
                    }
                    if(late)
                    {
                        invoiceData.status = "late";
                        msg = "Invoice Status Changed to late please check your email";
                    }
                    return invoiceData.save()
                                      .then( result =>{
                                            const emailBody = `
                                            <h2> Invoice details </h2>
                                            <p><b><u>Labour</u></b><br>Hours worked : ${result.labour.hours_Of_Work}<br>Cost Per Hour : ${result.labour.price_per_hour}</p>
                                            <p><b><u>Materials Used</u></b><br> ${result.materialUsed}</p>
                                            <p><b><u>Due Date</u></b><br> ${result.dueDate}</p>
                                            <p><b><u>Notes</u></b><br> ${result.notes}</p>
                                            <p><b><u>Status</u></b><br> ${result.status}</p>
                                            `;
                                            mail(invoiceData.email , "Invoice Status updated ✔" , emailBody);
                                            res.status(201).json({
                                                message: msg,
                                                invoice_info: result,
                                            });
                                      });
                 })
                 .catch(err =>{
                     if(!err.statusCode)
                     {
                        err.statusCode = 500;
                     }
                     next(err);
                 })
}

exports.getPaidInvoices = async(req,res,next) =>{
    await Invoice.find().where('status').equals('paid')
                .then( invoiceData =>{
                    res.status(200).json({
                        message:"All Paid Invoices Are Fetched",
                        invoice_info: invoiceData,
                    })
                })
                .catch(err =>{
                    if(!err.statusCode)
                    {
                        err.statusCode = 500;
                    }
                    next(err);
                });
};

exports.getLateInvoices = async(req,res,next) =>{
    await Invoice.find().where('status').equals('late')
                .then( invoiceData =>{
                    res.status(200).json({
                        message:"All Late Invoices Are Fetched",
                        invoice_info: invoiceData,
                    })
                })
                .catch(err =>{
                    if(!err.statusCode)
                    {
                        err.statusCode = 500;
                    }
                    next(err);
                });
};


