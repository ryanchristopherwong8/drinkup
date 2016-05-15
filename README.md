########################
# 	DRINKUP	        #
########################

Visit https://www.drink-up.herokuapp.com 

##How to use the app

1. Sign up for a user account from the home page (including uploading a profile picture)
2. Edit Conversations in your profile, choose your favourite topics
3. Click the logo, or “home” to go to the main page to see drinkups around you.
4. Click “Create Drinkup” to create your own drinkup
5. Select Between “Bar” or “Cafe”, and choose a location off the map. (try street view!)
6. Click “Show List” to see a list view of the map markers
7. Fill in drinkup info and create drinkup.
8. On create drinkup page, search for New York and make some drinkups.
9. Log out, and create a second user, and repeat previous steps for making drinkups in Vancouver or New York.
10. Attend the user’s drinkup (on “Drinkups around you” page) by clicking on the marker for details, and clicking attend
11. Chat in the chat box! It’s a real time chat (If you have two browsers with different accounts logged in, you can see it in action.)
12. Explore! 


##Cool Things to Look For

1) User authentication with sessions and cookies

- Code mostly exists with the file sessions_helper.rb
- Code also exists within controllers for checking if correct user privilege (before_action)

2) Chatting within an event, using gem private pub/Faye and thin server.

3) Uploading profile pictures using Amazon S3.

4) Server side validations on models, specifically user.

5) Using geokit-rails gem for determining the distances of events from you using latitude and longitude

6) Dynamic usage of Google Map APIs to return drinkups/ cafes & bars around you on user drag.
	- Caching drinkups around you to avoid excessive calls to API

6) Using Google Timezone API to display proper Timezone information depending on where an event is made. (ex. PDT for Vancouver, EDT for New York) and saving them in UTC using active record for proper database storage.

7) Usage of Ajax for real-time updating of Conversations on user’s profile.

8) Algorithm generates top Conversations shared amongst drinkup attendees, based on what’s set in their user profiles
	- Can be seen when clicking on a drinkup and viewing more details

9) If you try creating several drinkups near each other, the bounds of the map of drinkups will zoom in and out to focus on those around you


##Known Issues

- Chat times are currently in UTC format, not user’s timezones

- A user can participate in a drinkup’s chat without attending first. (Currently a usage choice we are deciding on.)

- When editing an event, times are displayed in UTC time, not formatted to user’s timezones.

- Dragging the map too fast many times on the “Create Drinkup” page sends too many Google API requests, so we throttle it with slight timeouts. In our current implementation, this causes a slight delay in return latitude/longitude data, so clicking a marker before that data is loaded will not pop up the detail box because that info is not defined. Data should resolve by waiting an extra half second, before attempting to click a marker again.


