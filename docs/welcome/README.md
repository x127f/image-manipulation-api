# Welcome - Endpoint

- returns .png

  


| query-param: | required           | example:                         | values:                                                      |
| ------------ | ------------------ | -------------------------------- | ------------------------------------------------------------ |
| user_tag     | :white_check_mark: | xnacly#6370                      | user tag                                                     |
| user_id      | :white_check_mark: | 417699816836169728               | user id                                                      |
| user_avatar  | :white_check_mark: | f76492e43b50b60ad4a3299691225f73 | user avatar hash                                             |
| guild_name   | :white_check_mark: | Trenite                          | guild name                                                   |
| guild_avatar | :white_check_mark: | 6e4174e86c4b36be80d2159f8214788a | guild avatar hash                                            |
| guild_id     | :white_check_mark: | 683026970606567440               | guild id                                                     |
| member_count | :x:                | 94                               | guild member count                                           |
| background   | :white_check_mark: | discord                          | [discord, default, default_small, minecraft, fortnite] / URL |
| status       | :x:                | dnd                              | [online, idle, dnd, offline, none]                           |
| greet_user   | :x:                | true                             | boolean                                                      |
| custom_text  | :x:                | welcome to hanamura              | text                                                         |
| shadow       | :x:                | 2                                | integer                                                      |
| font         | :x:                | Burbank Big Condensed            | [Burbank Big Condensed, Lypix, Arial, Times New Roman, Whitney Medium] |

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
&greet_user=false
&custom_text=welcome to hanamura
```

## Examples 
- all params from above

  <kbd>

  <img src="https://github.com/Trenite/image-manipulation-api/blob/master/docs/welcome/welcome.png"/>

  <kbd/>