# shows.js
[![Discord Status](https://discordapp.com/api/servers/182297613909884929/widget.png?style=banner5)](https://discord.gg/0118Fg96uP5eXQz2g)

shows.js aims to be a reliable and user-friendly service for those wanting to stream videos across multiple users. The service is entirely built in node and Electron, allowing for efficient design that works well on any platform you use, whether it be the desktop or the web. [Discord](https://discordapp.com) is built directly into shows.js, and serves as the service's authentication and control mechanisms.

##### [HISTORY](#history) - [PREREQUISITES](#prerequisites) - [INSTALLATION](#installation) - [CONFIGURATION](#configuration) - [RUNNING](#running) - [BUILDING](#building)

## History

Back in 2013, I and small group of online friends wanted a way to stream videos with each other, whether it be a movie or the occasional YouTube video. We started with [CyTube](https://github.com/calzoneman/sync), a rising service that did exactly what we wanted. Even today, CyTube is one of the best platforms for streaming video. However, it lacked features that we thought were expected of a video player, such as pausing and seeking. Me not having enough projects at the time decided to start a new project, entitled shows.js. This iteration of shows.js is its fourth.

shows.js isn't a universal standard, and never will be. There will always be features that shows.js lacks, while CyTube features, and vice versa. Don't like shows.js? CyTube has an an amazing platform for almost the exact same thing shows.js does! Feel free to check them out at http://cytu.be!

<img alt="xkcd standards" src="https://imgs.xkcd.com/comics/standards.png" width="400px" />

## Prerequisites

### Windows

Install Git, Node.js, and Visual Studio separately, and be sure they're added to your PATH environment variable.

Git: https://git-scm.com/download/win  
Node.js: https://nodejs.org/en/download/  
Visual Studio: https://www.visualstudio.com/en-us/products/visual-studio-community-vs.aspx

Afterwords, do a good-ol reboot and then open up the Windows command line and type the following. If the installation fails, try opening the command line as administrator.

```
npm install -g grunt-cli
```

### Mac OS X

If you don't have homebrew installed already (you should), you can install it with this command.

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Afterwords, type the following lines.

```
brew install git node gcc
sudo npm install -g grunt-cli
```

### Linux

Pop open your favourite terminal and type the following lines according to your distribution.

#### Debian / Ubuntu

```
sudo apt-get install git nodejs npm gcc
sudo npm install -g grunt-cli
```

#### Arch

```
sudo pacman -S git nodejs npm base-devel
sudo npm install -g grunt-cli
```

#### Fedora / CentOS

```
sudo yum install epel-release
sudo yum install git nodejs npm gcc
sudo npm install -g grunt-cli
```

## Installation

shows.js has three components: the client, and the server, and the Discord bot. The client is essentially a wrapper for the server (similar to Discord), while the server and Discord bot are one package.

```
git clone https://github.com/Winneon/shows.js
cd shows.js
npm install

grunt installdeps
```

## Configuration

Before you run the client or server, you need to configure them, and before you configure them, you need a Discord server and a Discord application. If you don't know how to create a Discord server, Google it. It's not difficult.

To create a Discord application, go to https://discordapp.com/developers/applications/me and create a new application. The app name can be anything you want. Create a bot user by clicking the obvious link that says something like "Create Bot User". Add two redirect URIs with the following URLs. Replace `<DOMAIN>` with the domain your server will be running under. This can be a public IP address. If you want https, replace `http` with `https`.

```
http://<DOMAIN>/authenticate
http://<DOMAIN>/electron_auth
```

After you've done that, you may now configure the server. Change into the `server` directory and duplicate `config_example.json`. Edit the values according to your preference. **All values are required.**

After you've finished, renamed your edited file to `config.json`.

## Running

To run the client or server in your development environment, type the following according to your choice.

### Client

```
cd client
node_mdoules/electron-prebuilt/dist/electron .
```

### Server & Discord Bot

```
cd server
node index
```

## Building

The build configuration is location in `client/package.json`. For documentation regarding the options, see [electron-builder](https://github.com/electron-userland/electron-builder/wiki/Options). To build the client, simply run the following.

```
grunt build
```

The produced binaries can be found in `client/dist/`.