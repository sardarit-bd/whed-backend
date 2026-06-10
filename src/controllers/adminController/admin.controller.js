import getTotalPrice from "../../utils/getTotalPrice.js";
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";


/************** get all admin dashboard data *****************/
const adminDeshboard = async (req, res) => {

    try {

        //find  users and service category area and review
        const products = await Product.find();
        const orders = await Order.find();

        //make the total value
        const totalproduct = products.length;
        const totalOrder = orders.length;
        const totalPending = orders.filter((order) => order.paymentStatus === "Pending");
        const totalDelivered = orders.filter((order) => order.paymentStatus === "Delivered");
        const totalPaid = orders.filter((order) => order.paymentStatus === "Paid");
        const totalRevenueArr = [];
        for (let i = 0; i < totalPaid?.length; i++) {
            const total = getTotalPrice(totalPaid[i]?.hasData);
            totalRevenueArr.push(totalPaid[i].grandTotal || 0);
        }
        const totalRevenue = totalRevenueArr?.reduce((a, b) => a + b, 0);


        res.status(200).json({
            success: true,
            message: "Admin dashboard data fetched successfully!",
            data: {
                totalproduct,
                totalOrder,
                totalPending: totalPending?.length,
                totalDelivered: totalDelivered?.length,
                totalPaid: totalPaid?.length,
                totalRevenue
            }
        });
    } catch (error) {
        console.error("Error fetching admin dashboard data:", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching admin dashboard data.",
        });
    }
}


/********** get my dashboard info for the user **********/
const myDeshboard = async (req, res) => {
    try {
        // Use authenticated user's id instead of path param
        const myOrder = await Order.find({ userID: req.user.id });


        const pending = myOrder.filter((order) => order.deliveryStatus === "Pending");
        const responseData = {
            myTotalOrder: myOrder.length,
            myPendingOrder: pending.length,
            Mytotalexpenses: myOrder.reduce((total, order) => total + (order.grandTotal || 0), 0)
        }

        // Return response
        res.status(200).json({
            success: true,
            message: "My dashboard fetched successfully!",
            data: responseData,
        });

    } catch (error) {
        console.error("Error fetching my dashboard:", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching my dashboard.",
        });
    }
};


/*********** modules export from here ************/
export { adminDeshboard, myDeshboard };

