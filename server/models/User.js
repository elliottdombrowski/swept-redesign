const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

// userSchema:
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid e-mail address']
    },
    password: {
        type: String,
        required: 'Password is Required',
        validate: [({ length }) => length >= 5, "Password should be longer."]
    },
    darkmode: {
      type: Boolean,
      default: false,
    }
});

// save + hashing for pass
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

// ensure hash + pass match
userSchema.methods.isCorrectPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;