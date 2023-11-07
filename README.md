# Population Report

## Summary
A simple UI5 application that displays population, area, and density statistics for cities. The data is retrieved from a JSON file using REST APIs, adhering to OData standards.

## Prerequisites
- Node.js and npm, installed on your system.


### Technology Stack and Tools Used
- [Typescript](https://www.typescriptlang.org/)
- [Express.js](https://expressjs.com/)
- [Node.js](https://nodejs.org/)
- [OpenUI5](https://openui5.org/)
- [odata-v4-parser](https://www.npmjs.com/package/odata-v4-parser)


## Quick Start

First, clone this repository:

```sh
git clone https://github.com/Abhishek-s1289/population-report.git
```

Go inside the root directory:
```sh
cd population-report
```

Install dependencies:
```sh
npm install
npm run install-deps
```

Build the application:
```sh
npm run build
```

Start the server:
```sh
npm run start
```
The above command will start the server on the port 8080, if port is not provided in .env file of backend folder.

Please open the below link in the browser:
```
http://localhost:8080
```

## Features
1. Build a web service that offers an endpoint which returns all cities from either the JSON or CSV.
2. Enhance the service to also include a density field, which should be number of people per sq km.
3. Add the capability to sort by name / population / area in descending or ascending manner.
4. Additionally, add a feature to filter the cities by name using a “contains” filter.
5. Create an endpoint to add new cities with name, population and area during runtime.
6. Create an UI which loads the full dataset from the service and shows it in a table with all 4 columns.
7. Improve the UI by highlighting rows of cities having a population over 1 million

## API Documentation
The backend is developed using Node.js and Express.js.
It has two API endpoints for City entity:
1. GET: /api/odata/City
2. POST: /api/odata/City

The GET API URL may look like this:
- /api/odata/City?$filter=contains(name, 'New York')&$sort=population desc
- /api/odata/City?$sort=area
- /api/odata/City?$filter=contains(name, 'New York')

To parse the URL, odata-v4-parser library is used, which returns the AST. The above urls are the example. It may vary based on the action being taken at the UI side. 