HealthCoverSim is a small full-stack web application that simulates private health insurance quotes.
this app is simulator only and does not provide financial advice.

Users can create, view, edit and delete quotes. The application calculates estimated monthly and yearly premiums based on hospital cover, extras cover, applicant ages, Lifetime Health Cover (LHC) loading, Family upgrade fees and annual-payment discounts.


## Technologies Used
React.js
React-Bootstrap
Node.js
Express.js
SQLite


## How to Run
Node.js and npm are required.

## Backend
Open a terminal.
cd backend
npm install
node server.js

The backend runs on:
http://localhost:5000


## Frontend
Open another terminal.
cd frontend
npm install
npm run dev

The Frontend runs on:
http://localhost:5173


## Database Setup

The application uses SQLite.

Database setup is handled by backend/db.js. When the backend starts, it connects to the SQLite database and creates the quotes table if it does not already exist.

Quote input values are stored in the database. Premium calculations are performed when displaying a quote rather than storing the calculated results.


## Quote Calculation

-Hospital and extras cover are calculated separately.

-Lifetime Health Cover (LHC) loading is calculated for each applicant where applicable and is applied only to that applicant's hospital premium.

-For Couple cover, two adults are included in the calculation.

-For Family cover, two adults are included and a fixed $30 monthly Family upgrade fee is added once. Children are not priced individually.


## The monthly premium is calculated as:

-Hospital premium + Extras premium + Family upgrade fee (if applicable)

-The yearly premium before discount is:
 Monthly premium × 12

-For Monthly payment, the annual discount is not applied.

-For Yearly payment, the selected annual discount is applied to the yearly total.


## AI Use

I used ChatGPT during development to help with starter code, debugging, little bit on how to create proper structure, validation, and took some help with premium calculation logic.

I personally designed, ran and tested the application, tested the CRUD operations and complete flow, and verified the calculations against the assignment requirements and worked example.

Decision that was made by me and I liked is to use reusable React-Bootstrap modals for creating and editing quotes while keeping the detailed quote breakdown on a separate page.


## Limitation

This is a basic application designed specifically for managing health insurance quotes and the user interface is also kept simple because the main focus of the project is CRUD functionality and correct quote calculations.It only supports managing quotes and does not include other features that a real insurance system would normally have, such as customer accounts, policy management, payments or claims processin, this is the main limitation.