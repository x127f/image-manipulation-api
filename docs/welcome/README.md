# Welcome - Endpoint

- returns .png

- all url-query-parameters are required

  

| query-param: | optional | example:                         | extras:                                                      |
| ------------ | -------- | -------------------------------- | ------------------------------------------------------------ |
| user_tag     | false    | xnacly#6370                      |                                                              |
| user_id      | false    | 417699816836169728               |                                                              |
| user_avatar  | false    | f76492e43b50b60ad4a3299691225f73 |                                                              |
| guild_name   | false    | Trenite                          |                                                              |
| guild_avatar | false    | 6e4174e86c4b36be80d2159f8214788a |                                                              |
| guild_id     | false    | 683026970606567440               |                                                              |
| member_count | true     | 94                               |                                                              |
| background   | false    | discord                          | [discord, default, default_small, minecraft, fortnite] / url |
| status       | true     | dnd                              | [online, idle, dnd, offline, none]                           |

### Todo
- optional guild icon
- set x/y position for each parameter
- custom text

### Example URL - 
```
http://cdn.trenite.tk/setup/welcome
?user_tag=xnacly%236370
&user_id=417699816836169728
&guild_name=Trenite
&guild_avatar=6e4174e86c4b36be80d2159f8214788a
&guild_id=683026970606567440
&member_count=94
&user_avatar=f76492e43b50b60ad4a3299691225f73
&background=discord
&status=dnd
```

## Examples 
- all params from above
<img src="https://github.com/Trenite/image-manipulation-api/blob/master/docs/welcome/welcome.png"/>

