<h1>Table of Contents</h1>
<p>
  <a href="#Introduction">Introduction</a> •
  <a href="#Features">Features</a> •
  <a href="#Technologies">Technologies</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#future-directions">Future Directions</a>
</p>

<h2>Introduction</h2>

Welcome to MoneyMile, a Lyft API ride estimates application.  The project will provide users a map matrix representing possible distances they can travel given a dollar amount and ride type selection.  Users will be able to view between Lyft, Lyft Plus, and Lyft Line ride types.

<h2>Features</h2>

* Algorithmic calculation for map matrix based on user dollar input and ride type selection
* Interactive map to update, modify, and calculate distance boundaries  
* Lyft API integration for ride estimates and ride types
* Responsive UI/UX design
* Snap to land algorithm to ensure bounds are displayed within land constraints

<img width="600" height="400" alt="userform" src="https://i.imgur.com/aY8X7DH.jpg">


<img width="600" height="400" alt="userform" src="https://i.imgur.com/VgIgqKa.png">

<h2>Technologies</h2>

* Lyft API
* React.js
* Node.js
* Google Maps API
* Google Static Map API
* Google Geometry API
* Express Framework

<h2>How To Use</h2>

* Allow fetching of current user location
* Input dollar amount into calculation form
* Allow processing time to calculate matrix boundaries
* Use toolbar to toggle boundary matrices for different ride types



<h2>Future Directions</h2>
The current state of the application only allows a visual representation of possible distances given a dollar amount. There are various applications and API's available that can give our application more features including but not limited to the following:
* Closest restaurants within matrix proximity using Yelp API
* Making Lyft ride ride requests directly from the application
* Incorporate Uber API to compare ride estimates
* Allowing users to change standard deviations to change accuracy based on preference
