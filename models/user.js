'use strict';
const bcrypt = require('bcrypt');

const {
  Model
} = require('sequelize');
const garagecurrent = require('./garagecurrent');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // models.user.belongsTo(garagecurrent);
      models.user.belongsToMany(models.car, {through: 'allcars'}); //user can have many cars
      models.user.hasOne(models.garagecurrent); //user has one current garage
      models.user.hasOne(models.garagedream); // user also has a dream garage


    }
  };
  user.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 99],
          msg: 'Name must be between 1 and 99 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid email'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8,99],
          msg: 'Password must be between 8 and 99 characters'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'user',
  });

  user.addHook('beforeCreate', (pendingUser) => {
    let hash = bcrypt.hashSync(pendingUser.password, 12);
    pendingUser.password = hash;
  });

  user.prototype.validPassword = function(typedPassword) {
    let isCorrectPassword = bcrypt.compareSync(typedPassword, this.password);

    return isCorrectPassword
  }

  user.prototype.toJSON = function() {
    let userData = this.get();
    delete userData.password;

    return userData;
  }


  return user; // above the return statement, we put our functions
};