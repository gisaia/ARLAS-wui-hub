# ARLAS-wui-hub

## Description

Configurable portal to access multiples applications

## How to use it

### Hosted way  

#### 1. Download the dist.zip

You can find it in [release section](https://github.com/gisaia/ARLAS-wui-hub/releases) (take the last)

#### 2. Unzip and customize

After unzip it, edit the `config.json` file.
See [configuration section](#Configuration) for more details

#### 3. Deploy

Deploy the folder on any web serveur and enjoy !

### Docker way  

Run the docker image in its latest version.

Mount a volume for the [configuration file](#Configuration) and for `assets` folder

*Exemple :*

 ```
  docker run docker.cloudsmith.io/gisaia/private/arlas-wui-hub:latest \
  -v [local_config_path]:/usr/share/nginx/html/config.json \
  -v [path_to_assets]:/usr/share/nginx/html/assets/
``` 

---

## Configuration

```json
{
  "header": {
    "title": "[Application title]",
    "subtitle": "[Application subtitle]",
    "logo": "[path or url to logo]",
    "logo_alt": "[alternative text for logo]",
    "color": "[header text color]",                 
    "background_color": "[header background color]" 
  },
  "footer":{
    "color": "[footer text color]",                 
    "background_color": "[footer background color]",
    "items": [
      {
        "type": "[label or link]",
        "label": "[item label]"
      },
      {
        "type": "[label or link]",
        "label": "[link label]",
        "url": "[url to open on click]"
      }
    ]
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

> **NOTE** : 
>
> - Use `color` and `background_color` like CSS properties
> - Add assets in the `assets` folder (images, logo, favicon, ...)

---

## Build

To build the project you need to have installed
- [Node](https://nodejs.org/en/) version >= 8.0.0 
- [npm](https://github.com/npm/npm) version >= 5.2.0
- [Angular CLI](https://github.com/angular/angular-cli) version 7.3.6

```
$ npm install -g @angular/cli@7.3.6
```

Then, clone the project

```shell
$ git clone https://github.com/gisaia/ARLAS-wui-hub
```

Move to the folder

```shell
$ cd ARLAS-wui-hub
```

Install all the project's dependencies

```shell
$ npm install
```

Build the project :

```shell
$ npm run build
```

The build artifacts will be generated in the `dist/` directory.
