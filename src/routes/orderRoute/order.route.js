import express from "express";
import {
    createOrder, deleteOrder, getAllOrders, getSingleOrder,
    myOrders,
    updateOrder
} from "../../controllers/orderController/order.controller.js";
import { authorize, protect } from "../../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/orders", protect, createOrder);

router.get("/orders", protect, authorize("admin"), getAllOrders);

router.get("/orders/my", protect, authorize("user", "admin"), myOrders);

router.get("/orders/:id", protect, authorize("admin", "user"), getSingleOrder);

router.put("/orders/:id", protect, authorize("admin", "user"), updateOrder);

router.delete("/orders/:id", protect, authorize("admin"), deleteOrder);



export default router;