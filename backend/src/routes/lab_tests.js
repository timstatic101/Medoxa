const express = require('express');

const Lab_testsService = require('../services/lab_tests');
const Lab_testsDBApi = require('../db/api/lab_tests');
const wrapAsync = require('../helpers').wrapAsync;

const config = require('../config');

const router = express.Router();

const { parse } = require('json2csv');

const { checkCrudPermissions } = require('../middlewares/check-permissions');

router.use(checkCrudPermissions('lab_tests'));

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Lab_tests:
 *        type: object
 *        properties:

 *          name:
 *            type: string
 *            default: name
 *          description:
 *            type: string
 *            default: description

 *          price:
 *            type: integer
 *            format: int64

 */

/**
 *  @swagger
 * tags:
 *   name: Lab_tests
 *   description: The Lab_tests managing API
 */

/**
 *  @swagger
 *  /api/lab_tests:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags: [Lab_tests]
 *      summary: Add new item
 *      description: Add new item
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                data:
 *                  description: Data of the updated item
 *                  type: object
 *                  $ref: "#/components/schemas/Lab_tests"
 *      responses:
 *        200:
 *          description: The item was successfully added
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Lab_tests"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        405:
 *          description: Invalid input data
 *        500:
 *          description: Some server error
 */
router.post(
  '/',
  wrapAsync(async (req, res) => {
    const referer =
      req.headers.referer ||
      `${req.protocol}://${req.hostname}${req.originalUrl}`;
    const link = new URL(referer);
    await Lab_testsService.create(
      req.body.data,
      req.currentUser,
      true,
      link.host,
    );
    const payload = true;
    res.status(200).send(payload);
  }),
);

/**
 * @swagger
 * /api/budgets/bulk-import:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags: [Lab_tests]
 *    summary: Bulk import items
 *    description: Bulk import items
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *          properties:
 *            data:
 *              description: Data of the updated items
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/Lab_tests"
 *    responses:
 *      200:
 *        description: The items were successfully imported
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/Lab_tests"
 *      401:
 *        $ref: "#/components/responses/UnauthorizedError"
 *      405:
 *        description: Invalid input data
 *      500:
 *        description: Some server error
 *
 */
router.post(
  '/bulk-import',
  wrapAsync(async (req, res) => {
    const referer =
      req.headers.referer ||
      `${req.protocol}://${req.hostname}${req.originalUrl}`;
    const link = new URL(referer);
    await Lab_testsService.bulkImport(req, res, true, link.host);
    const payload = true;
    res.status(200).send(payload);
  }),
);

/**
 *  @swagger
 *  /api/lab_tests/{id}:
 *    put:
 *      security:
 *        - bearerAuth: []
 *      tags: [Lab_tests]
 *      summary: Update the data of the selected item
 *      description: Update the data of the selected item
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Item ID to update
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        description: Set new item data
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                id:
 *                  description: ID of the updated item
 *                  type: string
 *                data:
 *                  description: Data of the updated item
 *                  type: object
 *                  $ref: "#/components/schemas/Lab_tests"
 *              required:
 *                - id
 *      responses:
 *        200:
 *          description: The item data was successfully updated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Lab_tests"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Item not found
 *        500:
 *          description: Some server error
 */
router.put(
  '/:id',
  wrapAsync(async (req, res) => {
    await Lab_testsService.update(req.body.data, req.body.id, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
  }),
);

/**
 * @swagger
 *  /api/lab_tests/{id}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags: [Lab_tests]
 *      summary: Delete the selected item
 *      description: Delete the selected item
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Item ID to delete
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: The item was successfully deleted
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Lab_tests"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Item not found
 *        500:
 *          description: Some server error
 */
router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    await Lab_testsService.remove(req.params.id, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
  }),
);

/**
 *  @swagger
 *  /api/lab_tests/deleteByIds:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags: [Lab_tests]
 *      summary: Delete the selected item list
 *      description: Delete the selected item list
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                ids:
 *                  description: IDs of the updated items
 *                  type: array
 *      responses:
 *        200:
 *          description: The items was successfully deleted
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Lab_tests"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Items not found
 *        500:
 *          description: Some server error
 */
router.post(
  '/deleteByIds',
  wrapAsync(async (req, res) => {
    await Lab_testsService.deleteByIds(req.body.data, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
  }),
);

/**
 *  @swagger
 *  /api/lab_tests:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Lab_tests]
 *      summary: Get all lab_tests
 *      description: Get all lab_tests
 *      responses:
 *        200:
 *          description: Lab_tests list successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Lab_tests"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Data not found
 *        500:
 *          description: Some server error
 */
router.get(
  '/',
  wrapAsync(async (req, res) => {
    const filetype = req.query.filetype;

    const globalAccess = req.currentUser.app_role.globalAccess;

    const currentUser = req.currentUser;
    const payload = await Lab_testsDBApi.findAll(req.query, globalAccess, {
      currentUser,
    });
    if (filetype && filetype === 'csv') {
      const fields = ['id', 'name', 'description', 'price'];
      const opts = { fields };
      try {
        const csv = parse(payload.rows, opts);
        res.status(200).attachment(csv);
        res.send(csv);
      } catch (err) {
        console.error(err);
      }
    } else {
      res.status(200).send(payload);
    }
  }),
);

/**
 *  @swagger
 *  /api/lab_tests/count:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Lab_tests]
 *      summary: Count all lab_tests
 *      description: Count all lab_tests
 *      responses:
 *        200:
 *          description: Lab_tests count successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Lab_tests"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Data not found
 *        500:
 *          description: Some server error
 */
router.get(
  '/count',
  wrapAsync(async (req, res) => {
    const globalAccess = req.currentUser.app_role.globalAccess;

    const currentUser = req.currentUser;
    const payload = await Lab_testsDBApi.findAll(req.query, globalAccess, {
      countOnly: true,
      currentUser,
    });

    res.status(200).send(payload);
  }),
);

/**
 *  @swagger
 *  /api/lab_tests/autocomplete:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Lab_tests]
 *      summary: Find all lab_tests that match search criteria
 *      description: Find all lab_tests that match search criteria
 *      responses:
 *        200:
 *          description: Lab_tests list successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Lab_tests"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Data not found
 *        500:
 *          description: Some server error
 */
router.get('/autocomplete', async (req, res) => {
  const globalAccess = req.currentUser.app_role.globalAccess;

  const organizationId = req.currentUser.organization?.id;

  const payload = await Lab_testsDBApi.findAllAutocomplete(
    req.query.query,
    req.query.limit,
    req.query.offset,
    globalAccess,
    organizationId,
  );

  res.status(200).send(payload);
});

/**
 * @swagger
 *  /api/lab_tests/{id}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Lab_tests]
 *      summary: Get selected item
 *      description: Get selected item
 *      parameters:
 *        - in: path
 *          name: id
 *          description: ID of item to get
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Selected item successfully received
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Lab_tests"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Item not found
 *        500:
 *          description: Some server error
 */
router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    const payload = await Lab_testsDBApi.findBy({ id: req.params.id });

    res.status(200).send(payload);
  }),
);

router.use('/', require('../helpers').commonErrorHandler);

module.exports = router;
