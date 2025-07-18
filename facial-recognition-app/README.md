# 🧠 Facial Recognition Attendance System

A real-time facial recognition-based attendance authentication system. This application allows users to upload a face image, which is compared against existing face data for authentication using AWS services.

Built using **ReactJS** for the frontend and **AWS S3 + AWS Lambda + API Gateway** for backend logic and face matching.

---

## 📸 Preview

![App Preview](assets/diagram.png)

---

## 🚀 Features

- Upload an image and verify face identity
- Images stored securely in AWS S3 bucket
- Facial comparison handled by AWS Lambda
- Real-time success/failure feedback
- Unique filenames via UUID to avoid conflicts
- Easy frontend setup using React

---

## 🔧 Tech Stack

| Frontend | Backend | Cloud |
|----------|---------|-------|
| ReactJS  | AWS Lambda | AWS S3 |
| HTML/CSS | API Gateway | UUID |
| JavaScript | | IAM Roles |

---

## 🧑‍💻 How It Works

1. User selects and uploads a face image.
2. Image is renamed with a UUID and uploaded to an S3 bucket.
3. After upload, a request is sent to a Lambda function via API Gateway.
4. Lambda compares the uploaded image against registered face data.
5. The system returns success or failure response based on matching confidence.

---

## 📁 Folder Structure

```bash
.
├── public/
│   └── visitors/              # S3-stored visitor images
├── src/
│   ├── App.js                 # Main React component
│   ├── App.css                # Styles
│   └── index.js               # App entry point
├── assets/
│   └── app_screenshot.png     # Screenshots/images
├── package.json
└── README.md
