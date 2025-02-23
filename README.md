# 🧾 Invoice-App  

An API that allows users to **create, store, and manage invoices** efficiently. It supports email notifications upon invoice creation and alerts users a day before the due date. Users can also **update invoice statuses (Paid/Late), triggering automatic email notifications** about the status change.  

📄 **[API Documentation](https://documenter.getpostman.com/view/19569751/UVkgxJsK) (Postman)**  

---

## 🚀 Features  

✅ Create multiple invoices with required details  
✅ Store invoices in MongoDB database  
✅ Email notification upon successful invoice creation  
✅ Automatic reminder email **one day before** the due date  
✅ Update invoice status (Paid/Late) with email confirmation  
✅ Secure authentication using **Google API Credentials**  

---

## 🛠️ Setup & Installation  

### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/your-username/Invoice-App.git
cd Invoice-App
```

### 2️⃣ Install Dependencies  
```sh
npm install
```

### 3️⃣ Set Up Environment Variables  
Create a `.env` file in the root directory and add the following:  
```
MONGO_URI=your_mongodb_connection_url
GOOGLE_API_CREDENTIALS=your_google_api_credentials
```

### 4️⃣ Start the Server  
```sh
npm start
```

### 5️⃣ Test the API with Postman  
- Open **Postman**  
- Use the endpoints as documented in the **[API Documentation](https://documenter.getpostman.com/view/19569751/UVkgxJsK)**  
- Upload invoices with the required fields  
- Verify that invoices are stored in MongoDB  

### 6️⃣ Stop the Server  
Press `CTRL + C` in the terminal  

---

## 📌 Tech Stack  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** Google API Credentials  
- **Email Notifications:** Nodemailer  

---

### 📬 Contributions & Issues  
Feel free to **fork** the repo and submit a **pull request**! For any issues, open a ticket in the **Issues** section.  

🔹 **Happy Coding!** 🚀
