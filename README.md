
# Huekins

[![npm](https://img.shields.io/npm/v/huekins.svg)](https://www.npmjs.com/package/huekins) [![License](https://img.shields.io/npm/l/huekins.svg)](https://raw.githubusercontent.com/APCOvernight/huekins/master/LICENSE) [![Build Status](https://travis-ci.org/APCOvernight/huekins.svg?branch=master)](https://travis-ci.org/APCOvernight/huekins) [![Coverage Status](https://coveralls.io/repos/github/APCOvernight/huekins/badge.svg?branch=master)](https://coveralls.io/github/APCOvernight/huekins?branch=master) [![Code Climate](https://img.shields.io/codeclimate/maintainability/APCOvernight/huekins.svg)](https://codeclimate.com/github/APCOvernight/huekins) [![Dependencies](https://img.shields.io/david/APCOvernight/huekins.svg)](https://david-dm.org/APCOvernight/huekins) [![Greenkeeper badge](https://badges.greenkeeper.io/APCOvernight/huekins.svg)](https://greenkeeper.io/)

Jenkins report for HueStatus

## Features
- Monitor multiple Jenkins Jobs using a single Hue light
- Supports :
  - Failed
  - Building
  - Unstable / Aborted 
  - Successful 

## Installation

```
npm install -g huestatus huetimerobot
```

Create a .huerc file on your home directory, see [HueStatus Docs](https://www.npmjs.com/package/huestatus) for more info. Add an object like this to the modules array for each of the projects you want to monitor:

```js
{
  "name": "huekins", // Required to tell HueStatus to load this module
  "url" : "http://address-of-server", // address or url of the jenkins server to monitor
  "job" : "job-name-to-monitor", // name of the jenkins job to monitor
  "light": "Hue color lamp 2", // Which Hue light to use
  "pollInterval": 2000 // Polling interval in milliseconds
}

```

Then run `huestatus`, each job will be loaded into HueStatus and your selected light(s) changed accordingly.
