import slugify from "slugify";
import categoryModal from "../models/categoryModal.js";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({
        message: "Name is required",
      });
    }
    //check if category exists or not
    const existingcategory = await categoryModal.findOne({ name });
    if (existingcategory) {
      return res.status(200).send({
        message: "Category already exists",
        success: true,
      });
    }

    const category = await new categoryModal({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "new category created!",
      category,
    });
  } catch (error) {
    console.log(err),
      res.status(500).send({
        success: false,
        error,
        message: "Error in category",
      });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModal.findByIdAndUpdate(
      id,
      { name: name, slug: slugify(name) },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Category is updated",
      category,
    });
  } catch (error) {
    console.log(err),
      res.status(500).send({
        success: false,
        error,
        message: "Error in update category",
      });
  }
};

// get all categories comtroller

export const getCategoriesController = async (req, res) => {
  try {
    const categories = await categoryModal.find({});


    res.status(200).send({
      success: true,
      message: "All Categories List",
      categories,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

export const singleCategoriesController = async (req, res) => {
  try {
    const { cid } = req.params;
    console.log("cid", cid);
    const category = await categoryModal.findById(cid);
    console.log("category", category);
    res.status(200).send({
      successs: true,
      message: "Single category fetched successfully",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting single category",
    });
  }
};

// delete single category route
export const deleteSingleCategoriesController = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModal.findByIdAndDelete(id)
    res.status(200).send({
      success: true,
      message: "category is deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting category",
    });
  }
};
