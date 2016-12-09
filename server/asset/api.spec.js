/**
 * @swagger
 * /assets:
 *   get:
 *     summary: get all existing assets
 *     tags:
 *     - asset
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: array of asset objects
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/AssetOutput"
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
 *         $ref: "#/definitions/AssetInput"
 *     responses:
 *       201:
 *         description: newly-created asset
 *         schema:
 *           $ref: "#/definitions/AssetOutput"
 *       400:
 *          description: request body contains invalid values
 * /assets/{assetKey}:
 *   get:
 *     summary: get one specific asset
 *     tags:
 *     - asset
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: assetKey
 *       in: path
 *       description: asset identifier
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: single asset
 *         schema:
 *           $ref: "#/definitions/AssetOutput"
 *       404:
 *         description: asset with the given key does not exist
 *   patch:
 *     summary: partially change an existing asset
 *     tags:
 *     - asset
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: assetKey
 *       in: path
 *       description: asset identifier
 *       required: true
 *       type: string
 *     - name: body
 *       in: body
 *       required: true
 *       schema:
 *         $ref: "#/definitions/AssetInput"
 *     responses:
 *       200:
 *         description: updated asset
 *         schema:
 *           $ref: "#/definitions/AssetOutput"
 *       404:
 *         description: asset with the given key does not exist
 *   put:
 *     summary: replace an existing asset with another one
 *     tags:
 *     - asset
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: assetKey
 *       in: path
 *       description: asset identifier
 *       required: true
 *       type: string
 *     - name: body
 *       in: body
 *       required: true
 *       schema:
 *         $ref: "#/definitions/AssetInput"
 *     responses:
 *       200:
 *         description: asset with changes applied
 *         schema:
 *           $ref: "#/definitions/AssetOutput"
 *       400:
 *          description: request body contains invalid values
 *       404:
 *         description: asset with the given key does not exist
 *   delete:
 *     summary: permanently remove an existing asset
 *     tags:
 *     - asset
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: assetKey
 *       in: path
 *       description: asset identifier
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: asset object which was just removed
 *         schema:
 *           $ref: "#/definitions/AssetOutput"
 *       404:
 *         description: asset with the given key does not exist
 */
