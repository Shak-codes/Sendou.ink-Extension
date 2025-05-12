# Sendou-Extension

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
