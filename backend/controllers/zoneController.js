import Zone from '../models/Zone.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// Helper function to filter fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getAllZones = catchAsync(async (req, res, next) => {
  const zones = await Zone.find({ user: req.user.id });
  
  res.status(200).json({
    status: 'success',
    results: zones.length,
    data: {
      zones
    }
  });
});

export const getZone = catchAsync(async (req, res, next) => {
  const zone = await Zone.findOne({ _id: req.params.id, user: req.user.id });

  if (!zone) {
    return next(new AppError('No zone found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      zone
    }
  });
});

export const createZone = catchAsync(async (req, res, next) => {
  // 1) Filtered out unwanted fields
  const filteredBody = filterObj(
    req.body,
    'name',
    'description',
    'location'
  );

  // 2) Set the user
  filteredBody.user = req.user.id;

  const newZone = await Zone.create(filteredBody);

  res.status(201).json({
    status: 'success',
    data: {
      zone: newZone
    }
  });
});

export const updateZone = catchAsync(async (req, res, next) => {
  const zone = await Zone.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!zone) {
    return next(new AppError('No zone found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      zone
    }
  });
});

export const deleteZone = catchAsync(async (req, res, next) => {
  const zone = await Zone.findOneAndDelete({ _id: req.params.id, user: req.user.id });

  if (!zone) {
    return next(new AppError('No zone found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
