import Shelter from "../models/Shelter.js";


export async function getShelters(
  req,
  res,
  next
) {
  try {
    const shelters =
      await Shelter.find()
        .sort({
          createdAt: -1,
        });

    res.json({
      success: true,
      count: shelters.length,
      data: shelters,
    });
  } catch (error) {
    next(error);
  }
}


export async function getShelterById(
  req,
  res,
  next
) {
  try {
    const shelter =
      await Shelter.findOne({
        shelterId:
          req.params.id,
      });

    if (!shelter) {
      return res.status(404).json({
        success: false,
        message:
          "Shelter not found",
      });
    }

    res.json({
      success: true,
      data: shelter,
    });
  } catch (error) {
    next(error);
  }
}


export async function createShelter(
  req,
  res,
  next
) {
  try {
    const shelter =
      await Shelter.create(
        req.body
      );

    res.status(201).json({
      success: true,
      data: shelter,
    });
  } catch (error) {
    next(error);
  }
}


export async function updateShelter(
  req,
  res,
  next
) {
  try {
    const shelter =
      await Shelter.findOneAndUpdate(
        {
          shelterId:
            req.params.id,
        },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!shelter) {
      return res.status(404).json({
        success: false,
        message:
          "Shelter not found",
      });
    }

    res.json({
      success: true,
      data: shelter,
    });
  } catch (error) {
    next(error);
  }
}