import Grade from "../modules/Grade.js";
import Course from "../modules/Course.js";
import { removePdf, savePdf } from "../services/pdfStorage.js";

const toSlug = (name) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// GET /api/courses/:courseSlug/grades
export const getGradesByCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.courseSlug });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const grades = await Grade.find({ course: course._id }).sort({ createdAt: 1 });
    res.json({ course, grades });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch grades", error: err.message });
  }
};

// POST /api/courses/:courseSlug/grades  (multipart/form-data — optional "pdf" file)
export const createGrade = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }

    const course = await Course.findOne({ slug: req.params.courseSlug });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const slug = toSlug(name);
    const exists = await Grade.findOne({ course: course._id, slug });
    if (exists) return res.status(409).json({ message: "A grade with this name already exists" });

    const storedPdf = req.file ? await savePdf(req.file) : null;
    const pdf = storedPdf
      ? { ...storedPdf, originalName: req.file.originalname }
      : { url: null, originalName: null, fileId: null };

    const grade = await Grade.create({ course: course._id, name, slug, description, pdf });
    res.status(201).json(grade);
  } catch (err) {
    res.status(500).json({ message: "Failed to create grade", error: err.message });
  }
};

// PUT /api/grades/:id
export const updateGrade = async (req, res) => {
  try {
    const { name, description } = req.body;
    const update = { description };
    if (name) {
      update.name = name;
      update.slug = toSlug(name);
    }

    const grade = await Grade.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!grade) return res.status(404).json({ message: "Grade not found" });
    res.json(grade);
  } catch (err) {
    res.status(500).json({ message: "Failed to update grade", error: err.message });
  }
};

// POST /api/grades/:id/pdf  (multipart/form-data — "pdf" file, required)
export const uploadGradePdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No PDF file provided" });

    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).json({ message: "Grade not found" });

    const previousPdf = grade.pdf;
    const storedPdf = await savePdf(req.file);
    grade.pdf = { ...storedPdf, originalName: req.file.originalname };
    await grade.save();
    await removePdf(previousPdf);

    res.json(grade);
  } catch (err) {
    res.status(500).json({ message: "Failed to upload PDF", error: err.message });
  }
};

// DELETE /api/grades/:id/pdf
export const deleteGradePdf = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).json({ message: "Grade not found" });

    const previousPdf = grade.pdf;
    grade.pdf = { url: null, originalName: null };
    await grade.save();
    await removePdf(previousPdf);
    res.json(grade);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove PDF", error: err.message });
  }
};

// DELETE /api/grades/:id
export const deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).json({ message: "Grade not found" });

    await Grade.deleteOne({ _id: grade._id });
    await removePdf(grade.pdf);

    res.json({ message: "Grade deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete grade", error: err.message });
  }
};

// DELETE /api/grades  (body: { ids: string[] })
export const deleteGrades = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No grade ids provided" });
    }

    const grades = await Grade.find({ _id: { $in: ids } });
    const result = await Grade.deleteMany({ _id: { $in: ids } });
    await Promise.all(grades.map((grade) => removePdf(grade.pdf)));
    res.json({ message: "Grades deleted", deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete grades", error: err.message });
  }
};