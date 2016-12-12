/**
 * @swagger
 * /courses/{courseKey}/activities:
 *   get:
 *     summary: get all existing activities
 *     tags:
 *     - activity
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: courseKey
 *       in: path
 *       description: course identifier
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: array of activity objects
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/ActivityOutput"
 *       404:
 *          description: course does not exist
 *   post:
 *     summary: create a new activity
 *     tags:
 *     - activity
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: courseKey
 *       in: path
 *       description: course identifier
 *       required: true
 *       type: string
 *     - name: body
 *       in: body
 *       required: true
 *       schema:
 *         $ref: "#/definitions/ActivityInput"
 *     responses:
 *       201:
 *         description: newly-created activity
 *         schema:
 *           $ref: "#/definitions/ActivityOutput"
 *       400:
 *          description: request body contains invalid values
 *       404:
 *          description: course does not exist
 * /courses/{courseKey}/activities/{activityKey}:
 *   get:
 *     summary: get one specific activity
 *     tags:
 *     - activity
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: courseKey
 *       in: path
 *       description: course identifier
 *       required: true
 *       type: string
 *     - name: activityKey
 *       in: path
 *       description: activity identifier
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: single activity
 *         schema:
 *           $ref: "#/definitions/ActivityOutput"
 *       404:
 *         description: course or activity with the given key does not exist
 *   delete:
 *     summary: remove an acitivity and its sub-activities
 *     tags:
 *     - activity
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: courseKey
 *       in: path
 *       description: course identifier
 *       required: true
 *       type: string
 *     - name: activityKey
 *       in: path
 *       description: activity identifier
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: all removed activities
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/ActivityOutput"
 *       404:
 *         description: course or activity with the given key does not exist
 * /courses/{courseKey}/activities/{activityKey}/actions/reorder:
 *   post:
 *     summary: place activity to new position
 *     tags:
 *     - activity
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: courseKey
 *       in: path
 *       description: course identifier
 *       required: true
 *       type: string
 *     - name: activityKey
 *       in: path
 *       description: activity identifier
 *       required: true
 *       type: string
 *     - name: body
 *       in: body
 *       required: true
 *       schema:
 *         $ref: "#/definitions/ActivityReorderInput"
 *     responses:
 *       200:
 *         description: activity with new position
 *         schema:
 *           $ref: "#/definitions/ActivityOutput"
 *       400:
 *          description: request body contains invalid values
 *       404:
 *          description: course does not exist
 */
