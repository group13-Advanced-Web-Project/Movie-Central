


![React](https://img.shields.io/badge/Frontend-React-61DAFB)
![HTML](https://img.shields.io/badge/Markup-HTML-E34F26)
![CSS](https://img.shields.io/badge/Styles-CSS-1572B6)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933)
![Express](https://img.shields.io/badge/Framework-Express-000000)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1)
![Full Stack](https://img.shields.io/badge/Full--Stack-Project-28a745)
![Movie Database](https://img.shields.io/badge/Category-Movie%20Database-yellow)
![Student Project](https://img.shields.io/badge/Project-Student%20Assignment-lightgrey)
![License](https://img.shields.io/badge/License-MIT-blue)

![Main Image](docs/assets/readme-main_img.png)

# Movie-Central

## Description
**Movie-Central** is an advanced web application designed to let users search, explore, and manage movie reviews and showtimes. This platform combines the power of React for a responsive frontend with Node.js and PostgreSQL for backend functionality, offering an intuitive user experience.

## Team

| Name    | Role      |
|---------|-----------|
| Curtis  | Git       |
| Sujeewa | Frontend  |
| Mahesh  | Frontend  |
| Steffi  | Backend   |
| Sanjaya | Backend   |
| Riku    | CI/CD     |

## Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [How It Works](#how-it-works)
- [Installation and Setup](#installation-and-setup)
- [Diagrams](#diagrams)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Links](#links)
- [Deployment](#deployment)







## About



**Movie-Central** allows users to explore movies, view their showtimes, and leave reviews. Users can browse movies without creating an account, or register to gain full access to personalized features. Registered users can:

- **Browse Movies**: Access detailed movie information, ratings, and showtimes.
- **Create and Share Favorite Lists**: Users can curate and share their favorite movies with a unique link.
- **Join or Create Movie Groups**: Connect with friends by forming or joining customizable movie groups.
- **Review Movies**: Share thoughts on movies they've watched with ratings and reviews.

This project integrates **React**, **Node.js**, **Express**, and **MySQL**, creating an interactive and scalable movie browsing experience.

## Features

- **Movie Browsing**: Discover a wide selection of movies, complete with essential details such as ratings, reviews, and showtimes.
- **Favorite Movie List**: Build a personal collection of favorite movies for easy access and sharing.
- **Movie Reviews and Ratings**: Add reviews and ratings to help others in their movie selection process.
- **User Authentication**: Secure sign-up and login system for accessing personalized features.
- **Create and Join Movie Groups**: Engage with friends by forming or joining movie groups to discuss and share recommendations.
- **Responsive Design**: Optimized for a smooth experience on desktops, tablets, and smartphones.

## Tech Stack

### Frontend

| Technology | Description |
|------------|-------------|
| **HTML**   | Provides the basic structure for the website. |
| **CSS**    | Ensures responsive design for all devices. |
| **JavaScript** | Powers dynamic interactions on the frontend. |
| **React**  | JavaScript library for building the user interface. |

### Backend

| Technology | Description |
|------------|-------------|
| **Node.js** | A JavaScript runtime for backend logic. |
| **Express** | A lightweight framework for building web applications in Node.js. |
| **PostgreSQL** | A relational database for managing movie data, reviews, and user information. |

### Deployment

| Technology | Description |
|------------|-------------|
| **Frontend** | Hosted on **Netlify** for fast, reliable, and continuous deployment. |
| **Backend**  | Deployed on **Render** for API and database services. |




## How It Works



The **Movie-Central** operates using a client-server architecture:

1. **Frontend**: Built with **React**, it handles all user interactions like browsing movies, viewing reviews, and managing user accounts. It communicates with the backend via API calls.
2. **Backend**: Powered by **Node.js** and **Express**, the backend processes requests from the frontend, handling movie data, user authentication, and more.
3. **Database**: **PostgreSQL** stores all movie data, user profiles, and reviews, ensuring data is stored persistently and can be queried efficiently.
4. **Authentication**: Users sign up and log in to access personalized features such as favorites, reviews, and movie groups. Authentication is managed securely through **JWT (JSON Web Tokens)**.

This architecture ensures a seamless and interactive experience for users, from discovering movies to interacting with friends and sharing opinions.

## Installation and Setup

To run the project locally, follow these steps:

1. **Clone the repository**:  
   `git clone https://github.com/group13-Advanced-Web-Project/movie-app.git`

2. **Install dependencies**:  
   Navigate to the frontend and backend directories and install the required packages:
   - Frontend:  
     `cd frontend && npm install`
   - Backend:  
     `cd backend && npm install`

3. **Set up environment variables**:  
   Create a `.env` file in both the frontend and backend folders and add the required environment variables (hardcoded for now with the local and remote details included).

4. **Set up PostgreSQL**:  
   - Create a local or cloud PostgreSQL database.
   - Refer to \movie-app\backend\index.js for database initialization.
   

5. **Start the application**:
   - Run the backend server:  
     `cd backend && npm start`
   - Run the frontend server:  
     `cd frontend && npm start`

The app should now be running locally at `http://localhost:3000`.



## Diagrams
# [---------------!!  FIGMA FLOWCHART DIAGRAM - LINK !!---------------](https://www.figma.com/board/GEDwmSbW4mDdORlsn0Op3P/Untitled?node-id=25-457&t=9W4VubSLSSegfJfW-1)





## Architecture Diagram
![Architecture Diagram](docs/diagrams/architecture.jpg)

## Frontend Diagram

![Frontend Diagram](docs/diagrams/frontend/frontend-flow.png)

## Database Diagram

![Database Diagram](docs/diagrams/database/database-structure.png)

## Server Diagram

![Server Diagram](docs/diagrams/server/server-flow.png)

## Account Delete Diagram

![Account Delete Diagram](docs/diagrams/database/account-delete-diagram.png)





## Screenshots

- [Home](#home-page)
- [Movie](#movie-page)
- [Year](#year-page)
- [Genres](#genres-page)
- [Showtime](#showtime-page)
- [Reviews](#reviews-page)
- [Groups](#groups-page)
- [Profile](#profile-page)
- [Admin](#admin-page)
- [Public Profile](#public-profile-page)

## Home Page

![Home Page](docs/assets/screenshots/home.png)

## Movie Page

![Movie Page](docs/assets/screenshots/movie.png)

## Year Page

![Year Page](docs/assets/screenshots/year.png)

## Genres Page

![Genres Page](docs/assets/screenshots/genres.png)

## Showtime Page

![Showtime Page](docs/assets/screenshots/showtimes.png)

## Reviews Page

![Reviews Page](docs/assets/screenshots/reviews.png)

## Groups Page

![Groups Page](docs/assets/screenshots/groups.png)

## Profile Page

![Profile Page](docs/assets/screenshots/profile.png)

## Admin Page

![Admin Page](docs/assets/screenshots/admin.png)

## Public Profile Page

![Public Profile Page](docs/assets/screenshots/public.png)






## Deployment
- Frontend deployed using Netlify to insure fast, reliable, and continuous deployment: https://movie-app-group13.netlify.app/

**Netlify Build Settings** 

![Build Settings](docs/assets/buildsettings.png)

- Server uses render 

**Server Build settings**
![Build Settings](docs/assets/server-build.png)

- Database uses render

**Database connection**
![Build Settings](docs/assets/database-connection.png)

