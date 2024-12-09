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

| Name               | GitHub Name      | Role                      |
| ------------------ | ---------------- | ------------------------- |
| Curtis             | Curtis-Thomas    | Project Management/Github |
| Sujeewa            | SampathHM        | Frontend                  |
| Mahesh             | t3idma00         | Frontend                  |
| Eaint Mon (Steffi) | SteffiEaint      | Backend                   |
| Sanjaya            | sanjayabhattarai | Backend                   |
| Riku               | RikuRautio       | CI/CD                     |

## Table of Contents

- [Tech Stack](#tech-stack)
- [Installation and Setup](#Installation-and-Setup)
------------------ 

- [GREEN TABLE](#green-table)
- [BLUE TABLE](#blue-table)
- [PINK TABLE](#pink-table)

## Tech Stack

### Frontend

| **HTML** | **CSS** | **JavaScript** | **React** |

### Backend

| **Node.js** |
| **Express** | A lightweight framework for building web applications in Node.js. |
| **PostgreSQL** | A relational database for managing movie data, reviews, and user information. |

### Deployment

| Technology   | Description                                                          |
| ------------ | -------------------------------------------------------------------- |
| **Frontend** | Hosted on **Netlify** for fast, reliable, and continuous deployment. |
| **Backend**  | Deployed on **Render** for API and database services.                |

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

## Green Table

- [Responsiveness](#responsiveness)
- [Sign up](#sign-up)
- [Sign in](#sign-in)
- [Removing account](#removing-account)
- [Search](#search)
- [Showtimes](#showtimes)
- [Group page](#group-page)
- [Adding a member](#adding-a-member)
- [Removing a member](#removing-a-member)
- [Customizing group page](#customizing-group-page)
- [Review a movie](#review-a-movie)
- [Browsing reviews](#browsing-reviews)
- [Favorites](#favorites)
- [Sharing favorites](#sharing-favorites)
- [Optional feature](#optional-feature)
- [Deployment](#deployment)

## Responsiveness

CSS is used to provide suitable layout views for different screen sizes:

 Desktop view:

![Responsiveness ](docs/assets/responsiveness/responsiveness-desktop.png)


 Tablet view:

![Responsiveness ](docs/assets/responsiveness/responsiveness-tablet.png)
 

 Phone view:

![Responsiveness ](docs/assets/responsiveness/responsiveness-phone.png)

## Sign up

auth0 is used for our user creation and management.

After clicking the login button (top right of screen), the user is shown the sign up screen.

![Sign up ](docs/assets/sign-up/sign-up.png)

The user has the option to create an account using their google account, or provide a username and password.

If the user provides a username and password, the password must meet the strong requirements.

![Sign up password](docs/assets/sign-up/sign-up-password.png)


## Sign in

**IMPORTANT** 

If you have not added your own auth0 details 

 Allowed Callback URLs
 - http://localhost:3000/
 - https://movie-app-group13.netlify.app/


 Allowed Logout URLs
  - http://localhost:3000/
  - https://movie-app-group13.netlify.app/

**IMPORTANT** 

After the user has created an account, they can log in using the same screen on the Log in tab.

![Sign In ](docs/assets/sign-in/sign-in.png)

After the user signs in, the users details are checked against our database. 
If they do not have any information in our database, then they are added using their auth0 user.sub (making use of the @auth0/auth0-react package).

## Removing account

To remove account:

1. Navigate to the profile page by clicking the user profile link (top right next to Log Out).

![Profile page ](docs/assets/remove-account/remove-account-profile.png)

2. On the left of the screen in the profile details section,at the bottom the remove account button can be found.

![Remove account button ](docs/assets/remove-account/remove-account-profile-remove-btn.png)

3. After clicking the remove account button, the profile details will be removed from our database. Any data that used the profile information that has been deleted (such as reviews) will now be replaced with a indicator the account that written the review has been deleted.

4. If the account was part of, or owner of a group. The ownership will automatically be transferred.

## Search

The search results have been limited to **200 results per return**, this is intentional to avoid rate-limiting from the external API.
As a result, some movies may not show in results.

Search features can be found on the header bar and are usable for both logged in and logged out users.

![Search Header ](docs/assets/search/search-header.png)

The search is split into 3 filters.

1. Search bar: Filtered by - free input

![Search Bar ](docs/assets/search/search-bar.png)

2. Year: Filtered by - Pre-defined year.

![Search year ](docs/assets/search/search-year.png)

3. Genres: Filtered by - Pre-defined genres.

![Search genres](docs/assets/search/search-genres.png)



## Showtimes

The showtimes page can be accessed by using the header bar link for both logged in and logged out users.

![Showtimes](docs/assets/showtimes/showtimes.png)

Filters can be applied for the specific date or theatre, free text search can also be used to find a specific movie.

## Group page

The groups page can be accessed by using the header bar link for both logged in and logged out users, with some functionalities reserved for logged in.

**Groups - Logged out**

![Groups page - Logged out](docs/assets/groups/groups.png)

When a logged out user visits the groups page, they are able to see all the current groups title and description and search through.
To access the further group features they are prompted to log in.

**Groups - Logged in**

![Groups page - Logged in](docs/assets/groups/groups-logged-in.png)

After logging in, the user can make full use of the groups page
- Create a new group
- Manage own groups
- Request to join group
- View join group requests
- View joined group pages



**Groups - Logged in - Group Page**

**Admin View**

![Groups page - Logged in - Group Page - Admin](docs/assets/groups/groups-logged-in-group-page-admin.png)

After selecting the group, the user is shown the group page. Admin has the ability to:
- Leave group
## Adding a member
- Accept/Reject join requests

## Removing a member
- Remove member
## Customizing group page
- Add movie to groups page view

After a movie has been added to the page using search box, it can be seen by all group members.

![Groups page - Logged in - Group Page Customized ](docs/assets/groups/groups-logged-in-customized.png)



## Review a movie

Only logged in users can review a movie, if a logged out user attempts to Add a review they will be prompted to log in.
Users can only add 1 review per movie.

To review a movie:

1. Navigate to any movie page.
2. Click 'Add Review' Button

![Review - movie page](docs/assets/review/review-movie-page.png)

3. Add review text
4. Add review star rating
5. Click submit

![Review - submit](docs/assets/review/review-submit.png)



## Browsing reviews

Reviews can be browsed by both logged in and logged out users.
User reviewer emails are censored by default.
There are two ways to brows reviews.

1. Movie Page

If a movie has reviews, they will all be shown on the movie page, if not the placeholder text 'No reviews yet. Be the first to add one!' will be shown. 
The movie rating is populated from their user review rating stored in our database.

![Browsing Reviews - movie page](docs/assets/browsing-reviews/browsing-reviews-movie-page.png)


2. Reviews page

The reviews page can be accessed by using the header bar link for both logged in and logged out users.

![Browsing Reviews - reviews page](docs/assets/browsing-reviews/browsing-reviews-reviews-page.png)

The reviews page shows all submitted reviews in chronological order, newest to oldest.
The movie page can be accessed by clicking the movie title.

## Favorites

Favorites functionality is only usable by logged in users, if a logged out user attempts to Add to Favorite, they will be prompted to log in.

A logged in user can Add a movie to their favorites and then view by:

1. Adding the movie to their favorites list through the movie page 'ADD TO FAVORITE' button (user will be prompted to log in if needed).

![Add to Favorites - movie page](docs/assets/favorites/favorites-movie-page.png)

2. After adding, a notification will show to confirm. The Add to Favorite button will now change to remove.

![Add to Favorites - movie page add button](docs/assets/favorites/favorites-movie-page-add.png)

3. View favorites by visiting the profile page which displays all added favorites.

![Favorites - Profile](docs/assets/favorites/favorites-profile.png)



## Sharing favorites

The user must be logged in and visit their profile page to generate a share link by using the 'Generate Sharable Profile' button.

![Sharing Favorites - Generate](docs/assets/sharing-favorites/sharing-favorites-generate.png)

After generating the link, your sharable url will be shown.

![Sharing Favorites - Generated](docs/assets/sharing-favorites/sharing-favorites-generated.png)

Any person with this link can see your public favorites (logged in or out).

![Sharing Favorites Share - Generated](docs/assets/sharing-favorites/sharing-favorites-share.png)


To add the profile to the shared URL's page, the share button must be clicked

![Sharing Favorites - Public](docs/assets/sharing-favorites/sharing-favorites-public.png)

Public Profiles page:

To view all public profiles list, visit the Shared URLs page, this can be accessed both logged in and out.

![Sharing Favorites - Public](docs/assets/sharing-favorites/sharing-favorites-page.png)

## Optional feature - Admin page

The admin page allows authenticated admin role accounts to view all database tables and make directly queries.

To access the admin page:
1. Create a user role account by logging in through auth0.
2. Connect to the database (suggest through pgAdmin 4)
3. Through the users table identify your account using email, then update the role to admin.
4. Access the admin page through the profile page 'Admin Dash' button.

![Admin Dash - Profile](docs/assets/admin/profile-page-admin.png)

5. After your account passes the authentication check, the database tables will be viewable.

![Admin Page - Page](docs/assets/admin/admin-page.png)


6. Database querying can be achieved from the query box towards the bottom of the page.

![Admin Page - Query](docs/assets/admin/admin-page-query.png)



## Deployment

For deployment we used free tiers from Netlify (frontend) and render (server and database).

- Frontend deployed using Netlify:

**Netlify Build Settings**

![Build Settings](docs/assets/deployment/buildsettings.png)

- Server uses render:

**Server Build settings**
![Build Settings](docs/assets/deployment/server-build.png)

- Database uses render

**Database connection**
![Build Settings](docs/assets/deployment/database-connection.png)


## Blue Table

[!! FIGMA FLOWCHART DIAGRAM - LINK !!](https://www.figma.com/board/GEDwmSbW4mDdORlsn0Op3P/Untitled?node-id=25-457&t=9W4VubSLSSegfJfW-1)


- [Class diagram describing database structure](#class-diagram-describing-database-structure)
- [UI design (wireframe)](#ui-design-wireframe)
- [Documenting REST API](#documenting-rest-api)
- [Managing product backlog](#managing-product-backlog)
- [Version control](#version-control)
- [Overall project management and progress](#overall-project-management-and-progress)

## Class diagram describing database structure
![Class Diagram](docs/diagrams/database/movieapp_database.png)

## UI design (wireframe)

![Architecture Diagram](docs/diagrams/architecture.jpg)
![Frontend Diagram](docs/diagrams/frontend/frontend-flow.png)

## Documenting REST API

## Managing product backlog

The product was tracked using a Github project board:

https://github.com/orgs/group13-Advanced-Web-Project/projects/2

![Project Board](docs/assets/project-board.png)

The board is separated into two main tags, Backlog and Bug tracker.

Backlog was populated with all the required tasks to be completed over the whole project, and then additional filtered kanban board were created for team members to easily find their assigned tasks. Teh priority system was used to identify which tasks were to be worked on next.

Bug tracker was used to keep track of any bugs and assigned to the relevant team member, the priority system was also used in the same way.

The timeline tab is used to see a  all of the issues that have been worked on and completed throughout the project, this is filtered by start date to end date.
## Version control

For version control, we decided to use a open source methodology of forking and having 1 person manage all of the pull requests to minimize merge conflicts.
![Project Board](docs/assets/network-graph.png)

This allowed us to deploy from one branch, and use team members forks and pull request branches for feature development and bug fixes.

## Overall project management and progress

The team stayed on progress by first having a kick off meeting where the following was decided (notes from meetings can be found in docs/note):

1. Target grade
2. Previous project experience and lessons learned
3. Tech stack we will use
4. Role assignments
5. Project management risks and mitigations
6. Weekly meeting schedule

We decided a minimum of 3 weekly meetings were required along with a good use of web messaging and github communication.

- Monday meeting: Talk through the weeks tasks and priorities and prepare for mentor meeting
- Mentor meeting: Talk through progress, blockers and ensure all requirements are understood and worked towards effectively
- Check up meeting: Progress report on the Monday meeting, and any additional resources are need

This format worked well and kept our team moving forwards at a good pace with sufficient communication.




## Pink Table

- [Sign in](#sign-in)
- [Sign out](#sign-out)
- [Sign up](#sign-up)
- [Deleting account](#deleting-account)
- [Browsing reviews](#browsing-reviews)

## Sign in
## Sign out
## Sign up
## Deleting account
## Browsing reviews








