# ARLAS-wui-hub

Configurable portal to access multiples applications

## Configuration
 
```json
{
  "header": {
    "title": "[APP TITLE]",
    "subtitle": "[APP_SUBTITLE]",
    "logo": "[path or url to logo]",
    "logo_alt": "[alternative text for logo]",
    "color": "[header text color]",                 // Use like a CSS property
    "background_color": "[header background color]" // Use like a CSS property
  },
  "footer":{
    "color": "[footer text color]",                 // Use like a CSS property
    "background_color": "[footer background color]" // Use like a CSS property
  },
  "cards" : [
    {
      "title": "[card title]",
      "subtitle": "[card subtitle]",
      "description": "[card text description]",
      "url": "[url of the application]",
      "url_label": "[label of the button click to open the link]",
      "img": "[path or url to background image]",
      "img_alt": "[alternative text for background image]"
    },
    ...
  ]
}

```
