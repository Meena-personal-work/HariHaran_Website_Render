const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');

const router = express.Router();

// Helper for async/await
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

function validateId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid id format' });
  }
  next();
}

// CREATE Order
router.post(
  '/',
  asyncHandler(async (req, res) => {
    
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  })
);

// UPDATE status
// router.patch(
//   "/:id/status",
//   validateId,
//   asyncHandler(async (req, res) => {
//     const { status } = req.body;

//     if (!["pending", "dispatched"].includes(status)) {
//       return res.status(400).json({ error: "Invalid status value" });
//     }

//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     if (!order) return res.status(404).json({ error: "Not found" });

//     res.json(order);
//   })
// );


// UPDATE status + dispatch fields
router.patch(
  "/:id/status",
  validateId,
  asyncHandler(async (req, res) => {
    const { status, transportName, dispatchDate, llrNumber } = req.body;

    if (!["pending", "dispatched"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updateData =
      status === "dispatched"
        ? { status, transportName, dispatchDate, llrNumber }
        : { status, transportName: "", dispatchDate: "", llrNumber: "" };

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    console.log(order);
    

    if (!order) return res.status(404).json({ error: "Not found" });

    res.json(order);
  })
);



router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { sort = '-createdAt' } = req.query;

    const [items, total] = await Promise.all([
      Order.find()
        .sort(sort)
        .lean(),
      Order.countDocuments(),
    ]);

    res.json({
      items,
      page: 1,
      limit: total, // returning all
      total,
      pages: 1,
    });
  })
);

// READ Single Order
router.get(
  '/:id',
  validateId,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ error: 'Not found' });
    res.json(order);
  })
);

// 🚨 DELETE all dispatched orders (keep this BEFORE /:id)
router.delete(
  "/dispatched",
  asyncHandler(async (req, res) => {
    
    const result = await Order.deleteMany({ status: "dispatched" });
    res.json({
      message: "Deleted dispatched orders",
      deleted: result.deletedCount,
    });
  })
);

// DELETE Order by ID
router.delete(
  '/:id',
  validateId,
  asyncHandler(async (req, res) => {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Order deleted successfully' });
  })
);

// Error Handler
router.use((err, req, res, next) => {
  console.error('Orders route error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

module.exports = router;
