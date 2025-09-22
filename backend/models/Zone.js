import mongoose from 'mongoose';

const zoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A zone must have a name'],
    trim: true,
    unique: true,
    maxlength: [100, 'A zone name must have less or equal than 100 characters'],
    minlength: [2, 'A zone name must have more or equal than 2 characters']
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Zone must belong to a user']
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
zoneSchema.index({ location: '2dsphere' });
zoneSchema.index({ user: 1 });

// Virtual populate
zoneSchema.virtual('crops', {
  ref: 'Crop',
  foreignField: 'zone',
  localField: '_id'
});

const Zone = mongoose.model('Zone', zoneSchema);

export default Zone;
