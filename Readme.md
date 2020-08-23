# Image (cdn) rest-api Trenite

<p align="center">
    <img style="border-radius: 100px" width="128" height="128" src="https://avatars0.githubusercontent.com/u/47723417?s=460&amp;u=10c488f1c4e0644b839df15ecefbfef2a9869305&amp;v=4">
    <img style="border-radius: 100px" width="128" height="128" src="https://cdn.discordapp.com/avatars/311129357362135041/401edcbaa39365697dc0a01cb1d0b485.png?size=2048">
</p>

### Features (planned):

- [ ] welcome image (userProfilePic, username, background) [url parameters]
- [ ] rank cards (xp system) [lvl, xp, username, userProfilePic] [url parameters]
- [ ] leave image (userProfilePic, username, background) [url parameters]

### Architecture:

- express.js
- hashbased auth (url-param)

### endpoints:

| endpoints:     | params:                                                      |
| -------------- | ------------------------------------------------------------ |
| /setup/welcome | user_name, guild_name, guild_avatar, member_count, user_avatar, background |
| /setup/leave   | user_name, guild_name, guild_avatar, member_count, user_avatar, background |
| /fortnite/shop | items                                                        |

### Auth:
