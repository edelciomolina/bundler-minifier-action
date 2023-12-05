# Bundler Minifier Action

[![GitHub release](https://img.shields.io/github/release/edelciomolina/bundler-minifier-action.svg?color=orange)](https://gitHub.com/edelciomolina/bundler-minifier-action/releases/)
[![MIT license](https://img.shields.io/github/license/edelciomolina/bundler-minifier-action.svg?color=blue)](https://github.com/edelciomolina/bundler-minifier-action/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A Github Action that works like [BundlerMinifier](https://github.com/madskristensen/BundlerMinifier) into Visual Studio.

By using this Action, you can eliminate the necessity of employing the Bundler Minifier extension and storing minified
files directly within your project. The primary purpose of this Action is to replicate the complete minification process
typically performed within Visual Studio, thereby shifting the responsibility to your workflow.

## How it works

According to the input parameters provided to this Action, it will, in order, proceed with the following steps:

-   1. Identify the preexistence of the `bundleconfig.json` file at the path specified by the `bundle_config_folder`
       parameter.
-   2. If the `create_bundle_config` is enabled, it will generate the `bundleconfig.json` file within the path defined
       by the `bundle_config_folder`. This file will be created based on the predefined file types in
       `search_extensions`, which will be recursively identified in the path specified in `create_bundle_config`. Here,
       it is understandable as the root of your project.
-   3. The minification process is then executed through a copy of the binary files from `BundlerMinifierConsole` stored
       within the `bin` folder of this Action. In essence, it follows the same process as the BundlerMinifier VSNET
       Extension when installed in Visual Studio.
-   4. Upon completion of the minification, if the `delete_input_files` parameter is configured, it will delete all the
       files that have been minified. These files are either the ones specified in `search_extensions` (when
       `create_bundle_config` is requested) or those that make up the `bundleconfig.json` file (represented by the JSON
       node called `inputFiles`).

## Prerequisites

-   Runs only in Windows
-   Require Node >= 18.x

## Inputs

| Key                    | Required | Default | Description                                                                          |
| ---------------------- | -------- | ------- | ------------------------------------------------------------------------------------ | ---- | ----------------------------- |
| `bundle_config_folder` | no       | ./test  | Path for bundleconfig.                                                               |
| `bundle_config_folder` | no       | true    | Use search_extensions inputs to search and create a bindleconfig.json automatically. |
| `bundle_config_folder` | no       | js      | css                                                                                  | html | Which files will be minified. |
| `delete_input_files`   | no       | true    | Delete inputFiles from source project.                                               |

## Example Usage

```yml
name: Build & Deploy
on:
    push:
        branches:
            - main

jobs:
    build:
        name: 'Build & Deploy'
        runs-on: windows-2019

        steps:
            - name: Checkout
              uses: actions/checkout@v4
              with:
                  ref: main

            - name: Setup Node
              uses: actions/setup-node@v1
              with:
                  node-version: '18.x'

            - name: Bundler Minifier
              uses: edelciomolina/bundler-minifier-action@main
              with:
                  bundle_config_folder: ./test
                  create_bundle_config: true
                  search_extensions: 'js|css|html'
                  delete_input_files: true
```
