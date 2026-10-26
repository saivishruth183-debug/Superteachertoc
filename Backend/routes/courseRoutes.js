import express from 'express'
import {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  deleteCourses,
} from '../controllers/courseController.js'
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router()

router.get('/', getCourses)
router.get('/:slug', getCourseBySlug)

// Protect these three with your admin auth middleware
router.post('/', requireAdmin, createCourse)
router.put('/:id', requireAdmin, updateCourse)
router.delete('/', requireAdmin, deleteCourses)
router.delete('/:id', requireAdmin, deleteCourse)

export default router