const { User, Sweeper, Snow } = require('../models')
const axios = require('axios');
const { signToken, authMiddleware } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');
const { DateTime } = require('luxon');
const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST);
const { v4: uuidv4 } = require('uuid');

//HANDLE ZIPCODE LOOKUP FROM WARD FORM
//TAKES IN A WARD INPUT OF 5 CHARACTERS AS PARAMETER
const lookupWard = async (zip) => {
  // HIT CITY ZIPCODE API W/ 5 CHARACTER WARD INPUT
  const zipData = {
    method: 'GET',
    url: `https://data.cityofchicago.org/resource/htai-wnw4.json?zipcode=${zip}`,
    data: {
      '$limit': 5,
      '$$app_token': process.env.ZIP
    }
  }
  const zipResponse = await axios.request(zipData);
  //FOR EACH RESPONSE, CHECK IF API DATA ZIPCODE MATCHES INPUT
  for (i = 0; i < zipResponse.data.length; i++) {
    if (zip === zipResponse.data[i].zipcode) {
      return zipResponse.data[i].ward;
    }
  }
};

//CONVERT STREET INPUT W/ REGEX
const streetInputHandler = (street) => {
  street = street.toUpperCase();
  street = street.replace(/^SOUTH/, 'S');
  street = street.replace(/^NORTH/, 'N');
  street = street.replace(/^WEST/, 'W');
  street = street.replace(/^EAST/, 'E');

  street = street.replace(/AVENUE$/, 'AVE');
  street = street.replace(/STREET$/, 'ST');
  street = street.replace(/ROAD$/, 'RD');
  street = street.replace(/DRIVE$/, 'DR');
  street = street.replace(/BOULEVARD$/, 'BLVD');
  street = street.replace(/PARKWAY$/, 'PKWY');
  street = street.replace(/SOUTHBOUND$/, 'SB');
  street = street.replace(/NORTHBOUND$/, 'NB');
  street = street.replace(/PLACE$/, 'PL');
  return street;
};

const resolvers = {
  Query: {
    // ward from *sweeper scheule* api
    getWard: async (parent, args, context) => {
      try {
        //GRAB CURRENT CST TIME
        const centralTime = DateTime.local().setZone('America/Chicago');
        //GRAB CURRENT MONTH AND DAY AS SEPARATE VARIABLES.
        //PARSE MONTH TO UPPERCASE TO MATCH API FORMAT
        let currMonth = centralTime.toLocaleString({ month: 'long' }).toUpperCase();
        let currDay = centralTime.toLocaleString({ day: 'numeric' });
        let dateArr = [];
        //DECLARING TESTING ARRAYS
        //THERE'S NO STREET SWEEPING IN THE WINTER. DUH.
        let currMonthTest = 'AUGUST';
        let currDayTest = '23';
        let dateTestArr = ['20', '21', '22', '23', '24', '25'];

        //FOR CURRENT DATE, PUSH DATE + 1 TO DATE ARRAY TO CHECK FULL WEEK
        //PARSE DATE TO INT TO ADD, THEN PARSE TO STRING
        for (i = 0; i < 7; i++) {
          dateArr.push((parseInt(currDayTest) + i).toString());
        }

        //FOR TESTING PURPOSES.
        dateTestArr = dateArr;

        //IF NO WARD # FOUND, RETURN
        if (!args.wardNumber) {
          return null;
        }

        //IF WARD NUMBER INPUT == 5 CHARACTERS, ASSUME IT'S A ZIPCODE
        //AND CALL LOOKUPWARD WITH WARD NUMBER INPUT AS PARAMETER
        if (args.wardNumber.length == 5) {
          args.wardNumber = await lookupWard(args.wardNumber);
        }
        const sweeperData = {
          method: 'GET',
          url: `https://data.cityofchicago.org/resource/wvjp-8m67.json?ward=${args.wardNumber}`,
          data: {
            '$limit': 5,
            '$$app_token': process.env.SWEEPER
          }
        }
        const sweeperResponse = await axios.request(sweeperData);

        //DECLARE EMPTY ARRAY FOR MATCHED RESPONSES
        let responseArr = [];
        //FOR EACH RECORD IN SWEEPERDATA, CHECK IF CURRENT MONTH MATCHES API'S MONTH_NAME FIELD
        for (let i = 0; i < sweeperResponse.data.length; i++) {
          if (currMonthTest == sweeperResponse.data[i].month_name) {
            //ONCE A MONTH_NAME MATCH IS FOUND, CHECK IF MONTH/WARD MATCH INCLUDES CURRENT DATES
            const findMatch = sweeperResponse.data[i].dates.split(',').filter(event => dateTestArr.includes(event));

            //IF ONE OR MORE MATCH IS FOUND, PUSH TO RESPONSE ARRAY
            if (findMatch.length > 0) {
              responseArr.push(sweeperResponse.data[i]);
            }
          }
        }
        //RETURN RESPONSE ARRAY TO CLIENT
        return responseArr;
      } catch (error) {
        console.log(error);
      }
    },
    // street name from *snow restriction* api
    getSnow: async (parents, args, context) => {
      try {
        //ASSIGN ARGUMENT/INPUT TO A VARIABLE THAT CALLS STREETINPUTHANDLER
        //CONVERTS ARGUMENT TO FORMAT MATCHING API 
        let snowArgs = streetInputHandler(args.snowNumber);

        if (!snowArgs) {
          return null;
        }

        const snowData = {
          method: 'GET',
          url: `https://data.cityofchicago.org/resource/i6k4-giaj.json`,
          data: {
            '$limit': 5,
            '$$app_token': process.env.SNOW
          }
        }
        const snowResponse = await axios.request(snowData);

        //DECLARE RESPONSE ARRAY FOR MATCHES
        let responseArr = [];
        //FOR EACH RECORD IN FULL API RESPONSE, FIND WHERE USER INPUT MATCHES 
        //THEN PUSH TO RESPONSE ARR AND RETURN BACK TO CLIENT
        for (i = 0; i < snowResponse.data.length; i++) {
          if (snowResponse.data[i].on_street.includes(snowArgs)) {
            responseArr.push(snowResponse.data[i]);
          }
        }

        return responseArr;
      } catch (error) {
        console.log(error);
      }
    },
    user: async (parent, { userId }) => {
      return User.findOne({ _id: userId });
    },

    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('You must be logged in.');
    },
    // for profile render
    getUserSweepers: async (parent, { user }) => {
      const sweeperResult = await Sweeper.find({ user: user })
      return sweeperResult;
    },
    getUserSnow: async (parent, { user }) => {
      const snowResult = await Snow.find({ user: user })
      return snowResult;
    }
  },

  Mutation: {
    addUser: async (parent, args) => {
      try {
        const user = await User.create(args);
        const token = signToken(user);

        return { token, user };
      } catch (error) {
        console.log(error);
      }
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('no user found with this email');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('incorrect password.');
      }

      const token = signToken(user);
      return { token, user };
    },

    updatePassword: async (parent, args, context, { email, password }) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      console.log('user: ', context.user);
    },

    saveSweeper: async (parent, { ward, section, month_name, dates, zipcode, user }) => {
      var newSweeper = new Sweeper({
        ward, section, month_name, dates, zipcode, user
      });
      newSweeper.save()
        .then((response) => {
          console.log('res ', response);
          return response;
        })
        .catch((err) => {
          return err;
        })
    },

    saveSnow: async (parent, { on_street, from_stree, to_street, restrict_t, user }) => {
      var newSnow = new Snow({
        on_street, from_stree, to_street, restrict_t, user
      });
      newSnow.save()
        .then((response) => {
          return response;
        })
        .catch((err) => {
          return err;
        })
    },
    deleteSweeper: async (parent, { id }, context) => {
      await Sweeper.deleteOne({ _id: id, user: context.user._id  }).catch(err => { return false })
      return true
    },
    deleteSnow: async (parent, { id }, context) => {
      await Snow.deleteOne({ _id: id, user:  context.user._id  }).catch(err => { return false })
      return true
    },

    makeDonation: async (parent, args, context) => {
      let error;
      let status;

      try {
        const { donation, token } = args;
        const customer = await
          stripe.customers.create({
            email: args.email,
            source: args.id
          });

        const idempotency_key = uuidv4();
        const charge = await stripe.charges.create(
          {
            amount: args.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: args.email,
            description: `Thank you for your ${args.name}`,
            shipping: {
              name: args.card.name,
              address: {
                line1: args.card.address_line1,
                line2: args.card.address_line2,
                city: args.card.address_city,
                country: args.card.address_country,
                postal_code: args.card.address_zip
              }
            }
          },
          {
            idempotency_key
          }
        );
        status = 'success';
      } catch (error) {
        status = 'failure';
      }
      return { status };
    },
  }
};



module.exports = resolvers;