module.exports = {
  servers: {
    one: {
      host: '45.55.22.178',
      username: 'root'
    }
  },

  meteor: {
    name: 'brachyon-dev',
    path: './',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'https://brachyon.com',
      MONGO_URL: 'mongodb://localhost/meteor'
    },
    dockerImage: 'oleurud/meteor-graphicsmagick',
    ssl: {
      crt: "./ssl/fullchain.pem",
      key: "./ssl/privkey.pem",
      port: 443
    },
    deployCheckWaitTime: 60
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  }
};
