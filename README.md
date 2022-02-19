# Invoice-App

It is an API that allows users to create multiple invoices by providing correct details about it,
store them in database and send a email upon successful creation of invoice.
It alerts the user a day before the due date of invoice through Email.
It also facilitates the user to change the status of invoice to paid or late as per their requirement and 
automatically send email related to the successful change in status of their invoices.

[<u># API Documentation </u>](https://documenter.getpostman.com/view/19569751/UVkgxJsK)

STEPS TO RUN THE API:

1.run npm install to download all the dependencies.

2.Create a .env file in the root and Add your own MongoDB URL and GOOGLE_API CREDENTIALS.

3.run npm start to start the server.

4.To Work on the project, fire up the postman and check all the APIs.

5.You can upload your own invoice containing your respective required fields as mentioned in api documenatation.

6.All the invoices will be stored in your MongoDb Database.

7.run ctrl + c to stop the server.
