# CampusConnectAi

##  Tech Stack

###  Frontend
- **React.js** – JavaScript library for building user interfaces
- **React Router DOM** – Routing and navigation
- **Tailwind CSS** – Utility-first CSS framework for styling
- **Axios** – HTTP client for API requests
- **Headless UI & HeroIcons** – For UI components and icons
- **Socket.IO (if used)** – Real-time messaging (for Chatbot)

---

###  AI / ML Features
- **Python (Flask/Express Wrappers)** – Backend API for ML models
- **scikit-learn / Transformers** – Sentiment analysis & recommendation system
- **Tesseract.js** – OCR (receipt text extraction from images)
- **OpenAI / Rasa (optional)** – Chatbot/NLP agent

---

###  Backend & API
- **Node.js** – JavaScript runtime
- **Express.js** – Web framework for building RESTful APIs
- **MongoDB** – NoSQL database for user/event data (optional)
- **Mongoose** – ODM for MongoDB
- **CORS & Body-Parser** – Middleware for handling requests
- **Dotenv** – Environment variable management

---

###  DevOps & Deployment
- **Git & GitHub** – Version control
- **Render / Railway / Vercel / Netlify** – Deployment platforms
- **Concurrently** – For running frontend and backend together during development

---

###  Testing (Optional)
- **Postman** – API testing
- **Jest / React Testing Library** – (If you plan to write tests)

Setup Instructions
Prerequisites
Make sure you have the following installed on your computer:

Node.js (Download and install the LTS version)

Step 1: Clone the Repository
Open your terminal or command prompt and run:

bash
Copy code
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
Step 2: Install Dependencies
We have two parts to the project: client (frontend) and server (backend). You need to install dependencies for both.

For Client (Frontend):
bash
Copy code
cd client
npm install
For Server (Backend):
Open a new terminal window/tab, then run:

bash
Copy code
cd server
npm install
Step 3: Start the Development Servers
You need to run both frontend and backend servers to work on the project.

Start Backend Server:
In the server folder terminal:

bash
Copy code
npm start
This starts the backend on http://localhost:5000

Start Frontend Server:
In the client folder terminal:

bash
Copy code
npm run dev
This starts the frontend on http://localhost:5173 (or the port shown in the terminal)

Step 4: Environment Variables
If there are any environment variables needed, create a .env file in the /server folder based on .env.example and add your keys there.

Troubleshooting Tips
Make sure Node.js is properly installed by running node -v and npm -v in your terminal

If you face any issues, try deleting node_modules folder and running npm install again

For any questions or help, reach out on our team chat!