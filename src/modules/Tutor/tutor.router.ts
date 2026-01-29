import express from "express"
import { tutorController } from "./tutor.controller";

const router = express.Router();


router.post('/tutor-profile', tutorController.createTutorProfile)
router.get('/tutor-profile', tutorController.getAllTutorProfiles)

export const tutorProfileRouter = router;