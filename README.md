# [Genc Football](http://www.gencfootball.com/)

## Description
Young talent hunting social media platform for Turkish Football Federation. In this platform traniers can create posts about their traniees and people can see and give reactions to their favourites so that head hunters can filter by poularity and find young talents wihout any logistic cost of searching in the field.
Genc Football is MERN application. Frontend is built with React.js, backend is built with Javascript, express.js and MongoDB.

## User Documentation
### How to install and run the software
No need to install or run anything to start enjoying Genc Football, website can be accessed [HERE](http://www.gencfootball.com/)
### How to report a bug
If you found a bug and want to report it, you can use github issues page by creating a new issue and linking this project.
### Known bugs
 - [ ] a user can access the feed without logging in, from feed he/she/it/they/them can access to any profile and than change profile information and also post and like as that user. (impersonation without authentication)
 - [x] occasional Fetch error (most likely from follow/following implementation)
 - [x] visiting profile with false userID gives error, rather than giving error, accessing undefined profiles should be not possible.
 - [x] user can follow indefinitely same user.
 - [x] user can follow itself.
 - [x] user can like a post more than once.
 - [x] update profile option at profiles not working when updating more than one field.
 - [ ] when user changes its username, their old username remain in thier old posts.
 - [x] currently some console.log() function calls for debugging purposes are printing confidential information to web browser console, they should be removed.
 - [x] in feed and profile there are some component rerenders that are unnecessary and might cause issues.
 - [ ] when deleting a profile, posts of that profile must also be deleted.
 - [x] sometimes a posts like or unlike doesnt update when like button is clicked and need a refresh.
 - [x] Search displays user IDs and name together which should not be displayed
 - [ ] usernames can be duplicate
## Developer Documenation
### obtaining source code
download directly from github, frontend and backend repositories are at the same repository.
### layout of files
there are two sub folders in root directory, one for frontend and one for backend. You can access frontend related react directories under ./client/ folder.
You can access backend related directories under ./server/ folder.
### how to deploy
to run the website locally:
open two terminals at root directory and enter these to run frontend and backend seperatly.
```
cd client/
npm start
```
```
cd server/
npm start
```
