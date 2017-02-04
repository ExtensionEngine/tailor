/**
 * @swagger
 * /assets:
 *   get:
 *     summary: get all assets for current activity
 *     tags:
 *     - asset
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: query
 *       name: activityId
 *       required: false
 *       type: string
 *       description: filter by activityId
 *     responses:
 *       200:
 *         description: array of asset objects
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Asset"
 *   post:
 *     summary: create a new asset
 *     tags:
 *     - asset
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: body
 *       required: true
 *       schema:
 *         $ref: "#/definitions/Asset"
 *     responses:
 *       200:
 *         description: newly-created asset
 *         schema:
 *           $ref: "#/definitions/Asset"
 * /assets/{assetId}:
 *   get:
 *     summary: get one specific asset
 *     tags:
 *     - asset
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: assetId
 *       in: path
 *       description: asset identifier
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: single asset
 *         schema:
 *           $ref: "#/definitions/Asset"
 *       404:
 *         description: asset with the given id does not exist
 *   patch:
 *     summary: partially change an existing asset
 *     tags:
 *     - asset
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: assetId
 *       in: path
 *       description: asset identifier
 *       required: true
 *       type: string
 *     - name: body
 *       in: body
 *       required: true
 *       schema:
 *         $ref: "#/definitions/Asset"
 *     responses:
 *       200:
 *         description: updated asset
 *         schema:
 *           $ref: "#/definitions/Asset"
 *       404:
 *         description: asset with the given id does not exist
 *   delete:
 *     summary: permanently remove an existing asset
 *     tags:
 *     - asset
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: assetId
 *       in: path
 *       description: asset identifier
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: asset object which was just removed
 *         schema:
 *           $ref: "#/definitions/Asset"
 *       404:
 *         description: asset with the given id does not exist
 */
