/**
 * @swagger
 * /users:
 *   get:
 *     summary: get all existing users
 *     tags:
 *     - user
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: array of user objects
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/UserOutput"
 *   post:
 *     summary: create a new user
 *     tags:
 *     - user
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: body
 *       required: true
 *       schema:
 *         $ref: "#/definitions/UserInput"
 *     responses:
 *       201:
 *         description: newly-created user
 *         schema:
 *           $ref: "#/definitions/UserOutput"
 *       400:
 *          description: request body contains invalid values
 * /users/{userKey}:
 *   get:
 *     summary: get one specific user
 *     tags:
 *     - user
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: userKey
 *       in: path
 *       description: user identifier
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: single user
 *         schema:
 *           $ref: "#/definitions/UserOutput"
 *       404:
 *         description: user with the given key does not exist
 * /users/actions/login:
 *   post:
 *     summary: log in
 *     tags:
 *     - user
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: body
 *       required: true
 *       schema:
 *         $ref: "#/definitions/UserInput"
 *     responses:
 *       200:
 *         description: successful login
 *         schema:
 *           $ref: "#/definitions/UserOutput"
 *       401:
 *          description: non-existing user email or mismatched password
 * /users/actions/logout:
 *   post:
 *     summary: log out
 *     tags:
 *     - user
 *     responses:
 *       204:
 *         description: successful logout
 * /users/{userKey}/access/courses/{courseKey}:
 *   post:
 *     summary: allow user to access a course
 *     tags:
 *     - user
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: userKey
 *       in: path
 *       description: user getting access rights
 *       required: true
 *       type: string
 *     - name: courseKey
 *       in: path
 *       description: course identifier
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: access granted
 *         schema:
 *           $ref: "#/definitions/UserOutput"
 *   delete:
 *     summary: revoke user's access to a course
 *     tags:
 *     - user
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: userKey
 *       in: path
 *       description: user losing access rights
 *       required: true
 *       type: string
 *     - name: courseKey
 *       in: path
 *       description: course identifier
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: access successfully revoked
 *         schema:
 *           $ref: "#/definitions/UserOutput"
 */
