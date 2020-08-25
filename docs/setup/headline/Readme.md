# Headline - Endpoint

-   endpoint to generate a given text on a given background

-   returns .png

    | query-param: | required                | example:                   | values:                                                                |
    | ------------ | ----------------------- | -------------------------- | ---------------------------------------------------------------------- |
    | text         | :white_check_mark:      | `Rules`                    | string                                                                 |
    | color        | :x:(default: `black`)   | `white`                    | css-color [rgb, hexa, name]                                            |
    | shadow       | :x:(default: `none`)    | 0                          | integer                                                                |
    | background   | :x:(default: `trenite`) | `discord-link` (see below) | [discord, default, default_small, minecraft, fortnite] / URL           |
    | font         | :x:(default: `Arial`)   | lypix-font                 | [Burbank Big Condensed, Lypix, Arial, Times New Roman, Whitney Medium] |
    | size         | :x:                     |                            | integer (in px)                                                        |
    | x            | :x:(default: `middle`)​ |                            | x-coord                                                                |
    | y            | :x:(default: `middle`)  |                            | y-coord                                                                |

    ### Example URL

    ```
    http://cdn.trenite.tk/setup/headline
    ?text=Rules
    &color=white
    &shadow=0
    &background=https://cdn.discordapp.com/attachments/568847750226116609/747889843325108355/discord_basic.png
    &font=lypix-font
    ```

    ## Example Image:

    -   all params from above

        <kbd>

        <img src="https://github.com/Trenite/image-manipulation-api/blob/master/docs/setup/headline/headline.png"/>

        <kbd/>
