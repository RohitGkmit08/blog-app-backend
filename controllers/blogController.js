const fs = require("fs");
const Blog = require("../models/blogModel");
const imageKit = require("../config/imageKit"); // adjust your path

exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      subTitle,
      description,
      slug,
      category,
      authorName,
      isPublished,
      publishedAt
    } = JSON.parse(req.body.blog);

    const imageFile = req.file;

    if (
      !title ||
      !subTitle ||
      !description ||
      !slug ||
      !category ||
      !authorName ||
      isPublished === undefined ||
      !publishedAt ||
      !imageFile
    ) {
      return res.json({
        success: false,
        message: "Missing required field",
      });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    const uploadResponse = await imageKit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    const optimizedImgUrl = imageKit.url({
      path: uploadResponse.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280" },
      ],
    });

    const blog = await Blog.create({
      title,
      subTitle,
      description,
      slug,
      category,
      image: optimizedImgUrl,
      authorName,
      isPublished,
      publishedAt,
    });

    res.json({
        success:true,
        message:"Blog added successfully"
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
