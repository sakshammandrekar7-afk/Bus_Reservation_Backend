
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Route extends Model {
    static associate(models) {
      Route.hasMany(models.Bus, {
        foreignKey: 'routeId',
        as: 'buses'
      });
    }
  }

  Route.init(
    {
      fromCity: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Departure city is required'
          }
        }
      },
      toCity: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Destination city is required'
          }
        }
      }
    },
    {
      sequelize,
      modelName: 'Route'
    }
  );

  return Route;
};
