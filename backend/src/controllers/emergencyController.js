import Emergency from "../models/Emergency.js";


export async function getEmergencies(
  req,
  res,
  next
) {
  try {
    const emergencies =
      await Emergency.find()
        .sort({
          createdAt: -1,
        });

    res.json({
      success: true,
      count: emergencies.length,
      data: emergencies,
    });
  } catch (error) {
    next(error);
  }
}


export async function getEmergencyById(
  req,
  res,
  next
) {
  try {
    const emergency =
      await Emergency.findOne({
        emergencyId:
          req.params.id,
      });

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message:
          "Emergency not found",
      });
    }

    res.json({
      success: true,
      data: emergency,
    });
  } catch (error) {
    next(error);
  }
}


export async function createEmergency(
  req,
  res,
  next
) {
  try {
    const emergency =
      await Emergency.create(
        req.body
      );

    res.status(201).json({
      success: true,
      data: emergency,
    });
  } catch (error) {
    next(error);
  }
}


export async function updateEmergency(
  req,
  res,
  next
) {
  try {
    const emergency =
      await Emergency.findOneAndUpdate(
        {
          emergencyId:
            req.params.id,
        },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message:
          "Emergency not found",
      });
    }

    res.json({
      success: true,
      data: emergency,
    });
  } catch (error) {
    next(error);
  }
}