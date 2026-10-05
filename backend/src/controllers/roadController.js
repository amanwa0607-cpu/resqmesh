import Road from "../models/Road.js";


export async function getRoads(
  req,
  res,
  next
) {
  try {
    const roads =
      await Road.find()
        .sort({
          createdAt: -1,
        });

    res.json({
      success: true,
      count: roads.length,
      data: roads,
    });
  } catch (error) {
    next(error);
  }
}


export async function getRoadById(
  req,
  res,
  next
) {
  try {
    const road =
      await Road.findOne({
        roadId:
          req.params.id,
      });

    if (!road) {
      return res.status(404).json({
        success: false,
        message:
          "Road not found",
      });
    }

    res.json({
      success: true,
      data: road,
    });
  } catch (error) {
    next(error);
  }
}


export async function createRoad(
  req,
  res,
  next
) {
  try {
    const road =
      await Road.create(
        req.body
      );

    res.status(201).json({
      success: true,
      data: road,
    });
  } catch (error) {
    next(error);
  }
}


export async function updateRoad(
  req,
  res,
  next
) {
  try {
    const road =
      await Road.findOneAndUpdate(
        {
          roadId:
            req.params.id,
        },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!road) {
      return res.status(404).json({
        success: false,
        message:
          "Road not found",
      });
    }

    res.json({
      success: true,
      data: road,
    });
  } catch (error) {
    next(error);
  }
}