<img src="https://media0.giphy.com/media/eQxrlxPiRd8kw/source.gif" title="FVCproductions" alt="FVCproductions">

# Clean Architecture API ![Coverage Status](http://img.shields.io/coveralls/badges/badgerbadgerbadger.svg?style=flat-square)

> API built with the wonderful Node.js

> Clean architecture was the god guide to this project

> Test Driven Development to not break everything all the time



## Technologies
Project is created with:
* mongoose
* jest
* express


## Setup
> set a mongodb database on env file

```
src 
│
└───domain
└───infra
└───presentation
└───utils
└───main
    │
    └───config
        │   env.js
```

> install the dependencies

```shell
$ npm install
```

> start the server
```shell
$ npm run start
```

## Tests
> to start the unit tests

```shell
$ npm run test:unit
```

> to start the integration tests

```shell
$ npm run test:integration
```
