# 🌾 Kisan Mitra

> **AI-Powered Agricultural Assistant for Farmers**

Kisan Mitra is an AI-powered agricultural assistant designed to help farmers access simple, practical, and easily understandable agricultural information.

The platform allows farmers to ask agriculture-related questions, receive AI-generated guidance, and upload plant images for preliminary analysis using Google Gemini AI.

---

## 🚀 Live Project

### 🌐 Live Demo
**Frontend:** Coming Soon

### ⚙️ Backend API
🔗 https://kisanmitra-07c4.onrender.com

### 💻 GitHub Repository
🔗 https://github.com/Netraja-swami/kisanmitra

---

## 📌 Project Overview

Farmers may face difficulties in accessing timely and easy-to-understand agricultural guidance. Information related to crop care, plant problems, soil conditions, and seasonal farming practices may be scattered across different sources.

**Kisan Mitra** aims to provide an accessible AI-based agricultural assistant through which farmers can ask questions in simple language and receive practical guidance.

The system also provides plant image analysis to give preliminary information about possible plant-related problems.

---

## ✨ Key Features

- 👨‍🌾 Farmer-friendly AI chatbot
- 💬 Agricultural question answering
- 📷 Plant and leaf image analysis
- 🌱 Context-aware agricultural responses
- 🌾 State, soil, and season based guidance
- 🔐 User registration and login
- 🔑 JWT-based authentication
- 💾 Persistent chat history
- 👤 Farmer profile management
- 🗄️ PostgreSQL database
- 🤖 Google Gemini AI integration
- 📱 Simple and user-friendly interface

---

## 🧠 AI Capabilities

### 💬 Text-Based Agricultural Assistance

Farmers can ask questions related to farming and crop problems.

Example:

> "Meri fasal ke patte peele ho rahe hain, kya karu?"

The request is sent to the Spring Boot backend, which communicates with Google Gemini AI and returns a farmer-friendly response.

---

### 📷 Plant Image Analysis

Farmers can upload an image of an affected plant or leaf.

The image is sent to the backend and analyzed using Google Gemini AI.

The system provides a preliminary assessment of possible plant problems along with general guidance.

> ⚠️ **Note:** Image analysis is intended as preliminary guidance and should not replace professional agricultural advice.

---

## 📂 Project Structure

kisanmitra/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── kisanmitra/
│       │           └── backend/
│       │
│       └── resources/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── Dockerfile
├── pom.xml
├── mvnw
├── mvnw.cmd
├── .gitignore
└── README.md

## 🏗️ System Architecture

```text
                    👨‍🌾 Farmer
                        │
                        ▼
              ┌───────────────────┐
              │   React Frontend  │
              │                   │
              │ Chat              │
              │ Image Upload      │
              │ Profile           │
              │ Authentication    │
              └─────────┬─────────┘
                        │
                        ▼
              ┌───────────────────┐
              │  Spring Boot API  │
              │                   │
              │ REST APIs         │
              │ JWT Authentication│
              │ Chat Management   │
              └───────┬─────┬─────┘
                      │     │
             ┌────────┘     └─────────┐
             ▼                        ▼
    ┌─────────────────┐      ┌─────────────────┐
    │   PostgreSQL    │      │  Google Gemini  │
    │                 │      │       AI        │
    │ Users           │      │                 │
    │ Profiles        │      │ Text Analysis   │
    │ Chat History    │      │ Image Analysis  │
    └─────────────────┘      └─────────────────┘

Application Workflow

User Registration
       ↓
User Login
       ↓
JWT Authentication
       ↓
Farmer enters question
       ↓
React Frontend
       ↓
Spring Boot Backend
       ↓
Google Gemini AI
       ↓
AI-generated response
       ↓
Response displayed to farmer
       ↓
Chat saved in PostgreSQL


