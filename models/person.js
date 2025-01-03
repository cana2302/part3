const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI

console.log('connecting to', url);

mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phoneValidator = function(phone) {
  const phoneRegex = /^\d{2,3}-\d{6,10}$/;
  return phoneRegex.test(phone);
};

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    require: true
  },
  number: {
    type: String,
    require: true,
    validate: {
      validator: phoneValidator,
      message: props => `${props.value} is not a valid phone number!`
    }
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

module.exports = mongoose.model('Person', personSchema);