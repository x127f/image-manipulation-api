# Image (cdn) rest-api Trenite



### Features (planned):

- [ ] welcome image (userProfilePic, username, background) [url parameters]
- [ ] rank cards (xp system) [lvl, xp, username, userProfilePic] [url parameters]
- [ ] leave image (userProfilePic, username, background) [url parameters]

### Architecture:

- express.js
- hashbased auth (url-param)

### endpoints:

| endpoints:     | params:                         |
| -------------- | ------------------------------- |
| /setup/welcome | user, count, avatar, background |
| /setup/leave   | user, count, avatar, background |
| /fortnite/shop | items                           |

