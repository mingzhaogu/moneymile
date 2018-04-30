## Background and Overview
Our project will provide users with a map overlay displaying possible distances they can travel given specific dollar amount inputted into Lyft. We have confirmed that Lyft will allow for 10,000 API calls a minute to their [Ride Estimates endpoint](https://developer.lyft.com/reference#availability-ride-estimates).

## Functionality and MVP
- Accepts User Inputs:
  - User location (pre-pulls from GPS)
  - Dollar amount
  - Design distance per inputted dollar amount algorithm
  - return outer bound
- Displays travel boundaries
  - Build custom Google map that provides visual representation of how “far dollar will go”
- Lyft OAuth login
  - Provide increased levels of predictive accuracy
- Outer Travel Boundary Algorithm
  - Computes max distance from epicenter user can travel, based upon user $$ input

## Technologies and Technical Challenges
- MongoDB
- Express
- Node.js
- React
- Google Maps API
- Google Geometry API
- Lyft API
- Uber API (possibly for small price tweaks)
- **Challenges:** learning MERN Stack, establishing a working/feasible algorithm
- **Backend:** Node.js/Express
- **Frontend:** React/Javascript

## Demo
![demo](https://i.imgur.com/oaEE9mB.gifv)

## UX
### Wireframe
![LoginPage](https://i.imgur.com/GVRbdna.png)

### Frontend Interface
- We will first implement calls to Lyft to gather ride request data to construct a distance matrix using [insert what we using here]
  - Array of valid destination lat/long → google.maps.geometry.encoding → Google Maps Distance Matrix API
- We will give users the option to login as guest or using a Lyft login for more accurate pricing data.
- Users will have the ability to allow our application to use their current location or manually input a location to be used in our distance algorithm.
- Users will input a dollar amount into an input field for distance algorithm calculations.

### Backend Interface
- Our backend will be using a Node.js server to make asynchronous requests to the Lyft API to gather pricing data
- We will be using the pricing data to construct an algorithm used to create markers which will be utilized to construct a distance matrix using [insert what we using here]
- We will be using Lyft API for user credentials to establish currentUser

## Project Flowchart
![](https://i.imgur.com/ycITzwL.png)

## Timeline
### Things Accomplished Over the Weekend
- [x] Set up MERN stack framework
- [x] Researched Lyft and Uber API and identified request limitations
- [x] Researched MongoDB database collections and NoSQL databases
- [x] Researched Google APIs, and which ones we will need to use
- [x] Familiarize ourselves with Git workflow

### Group Members & Work Breakdown
- first weekend
  - [x] set up git repo
  - [x] complete project proposal
- Monday, 4/23
  - [x] Lyft auth
  - [x] backend pass array of coordinate pair objects to frontend
  - [x] frontend assume get array of obj pairs, render map
  - [x] routes finished
- Tuesday, 4/24
  - [x] algorithm finished
- Wed, 4/25
  - [x] build user input form
- Thurs, 4/26
  - [x] build map
  - [x] build map overlay
- Fri, 4/27
  - *last day to seek help from TAs*
- Sat, 4/28
  - [x] app should be almost, if not already, fully-functional
- Sun, 4/29
  - [x] testing
- Mon, 4/30
  - project due
