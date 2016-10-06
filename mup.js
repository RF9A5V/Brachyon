module.exports = {
  servers: {
    one: {
      host: '45.55.22.178',
      username: 'root'
      // pem:
      // password:
      // or leave blank for authenticate from ssh-agent
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
      ROOT_URL: 'http://alpha.brachyon.com',
      MONGO_URL: 'mongodb://localhost/meteor'
    },
    dockerImage: 'oleurud/meteor-graphicsmagick',
    deployCheckWaitTime: 60
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};
