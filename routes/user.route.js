import { Router } from 'express';
import * as usercontroller from '../controllers/user.controller.js';
import { body } from 'express-validator';
import upload from '../middlewares/multer.js';
import { authmiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Sign up a new user
 *     description: Creates a new user account with a profile picture upload.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email of the user
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for the account
 *               mobileNumber:
 *                 type: string
 *                 description: Mobile number of the user
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture file
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */

router.post(
  "/signup",
  upload.single("profilePicture"), // Use multer middleware to handle file upload
  [
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("email")
      .isEmail()
      .withMessage("Email must be valid"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    body("mobileNumber")
      .notEmpty()
      .withMessage("Mobile number is required")
      .isMobilePhone()
      .withMessage("Mobile number must be valid"),
  ],
  usercontroller.createusercontroller // Controller to handle user creation
);

/**
 * @swagger
 * /api/allUser:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all registered users. Requires authentication.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: User ID
 *                   username:
 *                     type: string
 *                     description: Username
 *                   email:
 *                     type: string
 *                     description: Email address
 *       401:
 *         description: Unauthorized
 */
router.get('/allUser', authmiddleware, usercontroller.getAllUsers);

/**
 * @swagger
 * /api/{userId}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieves details of a specific user by their ID. Requires authentication.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/:userId', authmiddleware, usercontroller.getUserById);

/**
 * @swagger
 * /api/update/{userId}:
 *   put:
 *     summary: Update user details
 *     description: Updates the details of a specific user by their ID. Requires authentication.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: New username
 *               email:
 *                 type: string
 *                 format: email
 *                 description: New email
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put('/update/:userId', authmiddleware, usercontroller.updateUserDetails);

/**
 * @swagger
 * /api/delete/{userId}:
 *   delete:
 *     summary: Delete user
 *     description: Deletes a specific user by their ID. Requires authentication.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete('/delete/:userId', authmiddleware, usercontroller.deleteUser);

export default router;
