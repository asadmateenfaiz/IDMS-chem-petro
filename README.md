

A full-stack MERN application designed as an Inventory Data Management System (IDMS) for the chemical and petrochemical industry. It features a secure, token-based authentication system, a dynamic dashboard for data visualization, comprehensive data management, and a powerful comparative analysis tool.

## 🖼️ Screenshots & Demo



## ✨ Key Features

Based on the application's code, here are the core features:

  * **🔐 Secure Authentication:** Full user registration and login system using `bcryptjs` for password hashing and `jsonwebtoken` (JWT) for session management.
  * **📊 Interactive Dashboard:** A comprehensive overview page featuring:
      * KPI cards for Total Production, Compliance Rate, Active Alerts, and Energy Consumption.
      * Multiple charts (`Chart.js`) including Line, Bar, Doughnut, and Pie charts to visualize monthly production, CO₂ emissions, regional compliance, and product mix.
  * **🗂️ Full CRUD Data Management:** A dedicated "Data Management" page to:
      * View all chemical records in a sortable and searchable table.
      * Add new records via an interactive modal.
      * Display record `status` with color-coded chips (Stable, Warning, Alert).
  * **🔍 Comparative Analysis:** An "Analysis" page that allows users to:
      * Aggregate data and compare performance `by Region` or `by Plant`.
      * View charts and tables showing Total Volume, Average Purity, and Alert Counts for the grouped data.
      * Search across all aggregated data.
  * **🎨 Dynamic Theming:** A "Settings" page to customize the user experience, including a theme switcher with four pre-built themes:
      * Light
      * Dark
      * Oceanic
      * Sunset
  * **⚙️ Global Configuration:** A settings panel to manage application-wide parameters like alert thresholds and notification preferences.

## 🛠️ Tech Stack

### Frontend

  * **UI Library:** [React 19](https://react.dev/)
  * **Styling:** [Tailwind CSS](https://tailwindcss.com/)
  * **Data Visualization:** [React Chart.js 2](https://react-chartjs-2.js.org/)
  * **Icons:** [Lucide React](https://lucide.dev/)
  * **Test Runners:** [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) & [Jest](https://jestjs.io/)

### Backend

  * **Runtime:** [Node.js](https://nodejs.org/en/)
  * **Framework:** [Express.js](https://expressjs.com/)
  * **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
  * **Authentication:** [bcryptjs](https://www.npmjs.com/package/bcryptjs) & [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
  * **Middleware:** [CORS](https://www.npmjs.com/package/cors)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

  * **Node.js** (v16 or later recommended)
  * **npm** (comes with Node.js)
  * **MongoDB:** You must have a MongoDB server running. You can use a local installation or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster.

### 1\. Clone the Repository

```bash
git clone https://github.com/your-username/idms-chem-petro.git
cd idms-chem-petro
```

### 2\. Backend Setup

The backend server runs on `http://localhost:5001`.

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file in the /backend directory
# and add your configuration:
touch .env
```

Your `backend/.env` file should contain:

```env
# Your MongoDB connection string
MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

# A secret string for signing JWTs (can be any random string)
JWT_SECRET=your_super_secret_key_here
```

### 3\. Database Seeding (Optional, but Recommended)

To populate your database with 150 realistic, randomly-generated data entries, run the seeder script.

```bash
# From the /backend directory
node seeder.js
```

### 4\. Run the Backend Server

```bash
# From the /backend directory
node server.js
```

You should see confirmation messages in your terminal:
`✅ MongoDB database connection established successfully`
`🚀 Server is running on port: 5001`

### 5\. Frontend Setup

Open a **new terminal window** and navigate to the frontend directory. The React app runs on `http://localhost:3000`.

```bash
# Navigate to the frontend directory from the root
cd idms-frontend

# Install dependencies
npm install

# Run the React development server
npm start
```

Your browser should automatically open to `http://localhost:3000`, where you can see the running application.

## 📡 API Endpoints

The backend provides the following REST API endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user. |
| `POST` | `/api/auth/login` | Log in a user and receive a JWT. |
| `GET` | `/api/records` | Get all chemical records. |
| `POST` | `/api/records/add` | Add a new chemical record. |
| `GET` | `/api/analysis` | Get aggregated analysis data. Accepts `compareBy` and `search` queries. |
| `GET` | `/api/settings` | Retrieve the current application settings. |
| `POST` | `/api/settings` | Update the application settings. |

## 🔮 Future Plans

  * Role-based access control (e.g., Admin, Manager, User).
  * Automated daily or weekly email reports.
  * An activity log to track user actions (e.g., "User X added record Y").

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
