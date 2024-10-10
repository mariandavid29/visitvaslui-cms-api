const mongoose = require('mongoose');
const slugify = require('slugify');

const sightSchema = new mongoose.Schema({
  titleRo: {
    type: String,
    required: [true, 'A sight must contain a name'],
    unique: true,
    trim: true,
    maxlenght: [
      100,
      'A sight name must have less or equal than 100 characters',
    ],
    minlenght: [10, 'A sight name must have more or equal than 10 characters'],
  },
  titleEn: {
    type: String,
    required: [true, 'A sight must contain a name'],
    unique: true,
    trim: true,
    maxlenght: [
      100,
      'A sight name must have less or equal than 100 characters',
    ],
    minlenght: [10, 'A sight name must have more or equal than 10 characters'],
  },
  descRo: {
    type: String,
    required: [true, 'A sight must contain a description'],
    unique: true,
    trim: true,
    maxlenght: [
      1000,
      'A sight description must have less or equal than 1000 characters',
    ],
    minlenght: [
      30,
      'A sight description must have more or equal than 30 characters',
    ],
  },
  descEn: {
    type: String,
    required: [true, 'A sight must contain a description'],
    unique: true,
    trim: true,
    maxlenght: [
      1000,
      'A sight description must have less or equal than 1000 characters',
    ],
    minlenght: [
      30,
      'A sight description must have more or equal than 30 characters',
    ],
  },
  slugRo: {
    type: String,
  },
  slugEn: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  imageCover: {
    type: String,
  },
  images: {
    type: [String],
  },
  tagRo: {
    type: String,
    enum: {
      values: ['biserica', 'divertisment', 'monument istoric'],
      message:
        "Tag can only be: 'biserica', 'divertisment', 'monument istoric'",
    },
    required: [true, 'A sight must have a tag'],
  },
  tagEn: {
    type: String,
    enum: {
      values: ['biserica', 'divertisment', 'monument istoric'],
      message:
        "Tag can only be: 'biserica', 'divertisment', 'monument istoric'",
    },
    required: [true, 'A sight must have a tag'],
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      required: [true, 'A sight must contain coordinates'],
    },
    address: {
      type: String,
      required: [true, 'A sight must contain an address'],
      maxlenght: [
        100,
        'A sight address must have less or equal than 100 characters',
      ],
      minlenght: [
        10,
        'A sight address must have more or equal than 10 characters',
      ],
    },
  },
  age: Number,
});

sightSchema.pre('save', function (next) {
  this.slugRo = slugify(this.titleRo, { lower: true });
  this.slugEn = slugify(this.titleEn, { lower: true });
  return next();
});

const Sight = mongoose.model('Sight', sightSchema);

module.exports = Sight;
