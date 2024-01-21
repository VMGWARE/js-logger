# @vmgware/js-logger

[![Quality Gate Status](https://sonar.vmgware.dev/api/project_badges/measure?project=VMGWARE_js-logger_AYzM1fgjPR--spDn0sJW&metric=alert_status&token=sqb_45ffe2dff92598895612df73e7c3c0bb0e1d6d90)](https://sonar.vmgware.dev/dashboard?id=VMGWARE_js-logger_AYzM1fgjPR--spDn0sJW)

## Introduction

A versatile logging utility, offering color-coded console outputs and various log levels, adapted from the Uptime Kuma project for broad compatibility with JavaScript applications.

## Features

- **Log Levels:** Supports INFO, WARN, ERROR, and DEBUG levels.
- **Colorful Console Outputs:** Enhances log readability with color-coded messages.
- **Timestamps:** Each log entry is prefixed with a timestamp.
- **Environment Compatibility:** Works seamlessly in Node.js and browser environments.
- **Customizable:** Easy to integrate and customize within your JavaScript projects.

## Installation

```bash
npm install @vmgware/js-logger
```

## Usage

First, import the logger into your project:

```javascript
import log from '@vmgware/js-logger';
```

Then, use it to log messages:

```javascript
log.getInstance("DEBUG");
log.info('MyModule', 'This is an info message');
log.warn('MyModule', 'This is a warning message');
log.error('MyModule', 'This is an error message');
log.debug('MyModule', 'This is a debug message');
```

## Configuration

The logger works out-of-the-box with default settings. However, you can customize the log levels and formats as needed in your project.

## Acknowledgements

This package is extracted from Uptime Kuma, an open-source monitoring tool. Full credit goes to the original authors and contributors of Uptime Kuma.

## License

This project is licensed under the MIT License.

## Source

The original source of this logger can be found in the Uptime Kuma repository: [Uptime Kuma log Source](https://github.com/louislam/uptime-kuma/blob/master/src/util.ts)
