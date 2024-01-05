# Node-Express-Template
A Generic Node.JS and Express Template For Backend Development.

## About
This is a template for a generic server with minimum functionality that can be easily built upon and configured to meet a variety of needs. The code itself is comprised of the basic functionality a server would have along with explanation of how you would use and update the logic within.

The goal is to allow for anyone to use this as a learning resource to explore backend development with Node and Express or as a starting point for a larger project.

For the sake of simplicity in this particular template, we will only use a "local database" such as naturally occuring datastructures available within Javascript like lists.

A "thing" in the context of this code base is the most generic resource this server would handle. There are two types of things:
1. Public Things which represent any resource this server handles that is publically available aka requires no authentication
2. Private Things which represent any resource this server handles that is NOT publically available aka requires authentication

## Repository Contents and Description

### Routes Folder

Contains the files related to routes this server would have available to it.

This particular starting point includes three routing folders:
1. publicThings: All routes related to publically available resources
2. privateThings: All routes related to private resources that are only available after authentication with the server
3. authentication: Simple and generic routes related to authentication such as login, logout, signup

### Models Folder

Where all of the code and logic related to representing models within the application are stored.

### node_modules Folder

### package.json & package-lock.json

### server.js

The initializtion point for the server.

## Technology

TODO: Add Versions for each

- Package Manager: Node Package Manager (npm)
- Language: Javascript
- Runtime Environment: Node.JS
- Framework: Express

## How To Start

TODO: Write out Start Guide

Install npm
Install express
Install Javascript
Install Node.js

Pull Repo
Run Init
Create packages

Set up postman or localhost

Test

## MIT License

Copyright (c) 2024 Isaac Lock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
