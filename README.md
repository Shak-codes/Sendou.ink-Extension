# Sendou.ink-Extension

## Purpose
The Sendou.ink Twitch Extension is a service that provides viewers access to a streamer's real time SendouQ activity. If a streamer is currently playing SendouQ, viewers can easily find the match score, upcoming maps, and participating players. The goal is to provide viewers the privilege of not needing to leave the browser / app to find this information manually, and saves the need to ask for this information in chat. If the streamer is not actively playing SendouQ, their profile and ranking will be shown. In the future, we aim to support live tournament coverage on Sendou.ink(match score, upcoming maps, players, and round information) for participating streamers.

## Overview of Implementation
The extension will be comprised of three main services, a frontend, backend, and the Sendou.ink API.

### Frontend service
The frontend will house an iframe overlay on a participating stream. It requests the participating channel's broadcaster ID and uses it in conjunction with the backend service to serve the viewers the corresponding information.

### Backend service
The backend service is a custom AWS Lambda server that will handle authentication and polling / subscribing to SendouQ match updates, pushing the data to the extension.

### Sendou.ink API
The Sendou.ink API is the service that will be queried in order to obtain all information regarding a streamer's SendouQ activity. 

### User Authentication
- Within the extension configuration settings, we will provide a "Link Sendou.ink account" option. This will open a new tab for an OAuth login. This OAuth login could be directly from Sendou.ink, but if such a service doesn't exist and doesn't have any need to exist outside of this extension, we could simply perform this OAuth login using Discord(since Sendou.ink profiles are linked to Discord accounts). Then, with this Discord OAuth we can successfully connect the user to their Sendou.ink account.
- Upon connecting a Sendou.ink account to the extension, the backend will receive the callback and obtain the corresponding Sendou.ink user ID. Then, we'll map each Twitch channel ID to the corresponding Sendou.ink user ID in our database for easy lookup.
- On the frontend, we'll use window.Twitch.ext.onAuthorized to obtain the channelId and userId. The extension will then pass the JWT whenever fetching data from the backend for secure requests.

### Data Fetching
Fetching data can be done in two different ways, either through a backend polling and websocket push approach, or a double websocket push approach.

#### Backend Polling + Websocket Push
- In this approach, the backend loops through each active streamer and polls Sendou.ink for their SendouQ data periodically. We note here that the last result for each active streamer is cached. 
- The frontend will maintain a WebSocket connection to the backend and listen for any changes for a specific streamer's SendouQ activity.
- When the backend detects a change during a poll from Sendou.ink, it will push the new data to the frontend for the specific twitch streamer's viewers to see.
  - In the case that a poll is made from the backend to Sendou.ink and there is no change from the cached result, nothing will be pushed to the frontend for that channel.
 
### Double Websocket Push
- This approach relies on Sendou.ink providing webhooks for SendouQ updates, here the backend subscribes to these webhooks for the individual streamer.
- The frontend will maintain a WebSocket connection to the backend and listen for any changes for a specific streamer's SendouQ activity.
- When Sendou.ink pushes a change to the backend, the backend will push the new data to the frontend for the specific twitch streamer's viewers to see.

## Design
### Frontend
### Backend
