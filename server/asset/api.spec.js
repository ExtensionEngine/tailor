/**
 * @swagger
 * /assets:
 *   get:
 *     summary: get all existing assets
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
 *       201:
 *         description: newly-created asset
 *         schema:
 *           $ref: "#/definitions/Asset"
 *       400:
 *          description: request body contains invalid values
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
 *   put:
 *     summary: replace an existing asset with another one
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
 *         description: asset with changes applied
 *         schema:
 *           $ref: "#/definitions/Asset"
 *       400:
 *          description: request body contains invalid values
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
