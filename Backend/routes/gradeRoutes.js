import express from "express";
import {
  getGradesByCourse,
  createGrade,
  updateGrade,
  deleteGrade,
  deleteGrades,
  uploadGradePdf,
  deleteGradePdf,
} from "../controllers/gradeController.js";
import { uploadPdf } from "../middleware/upload.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/courses/:courseSlug/grades", getGradesByCourse);
router.post("/courses/:courseSlug/grades", requireAdmin, uploadPdf.single("pdf"), createGrade);

router.delete("/grades", requireAdmin, deleteGrades);
router.put("/grades/:id", requireAdmin, updateGrade);
router.delete("/grades/:id", requireAdmin, deleteGrade);

router.post("/grades/:id/pdf", requireAdmin, uploadPdf.single("pdf"), uploadGradePdf);
router.delete("/grades/:id/pdf", requireAdmin, deleteGradePdf);

export default router;