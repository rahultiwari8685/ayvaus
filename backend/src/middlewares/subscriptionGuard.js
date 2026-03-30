import Subscription from "../models/Subscription.js";
import ReportAccess from "../models/ReportAccess.js";
import Plan from "../models/Plan.js";

export const requireActiveSubscription = async (req, res, next) => {
    try {
        const customerId = req.user.customerId;

        const subscription = await Subscription.findOne({
            customer_id: customerId,
            status: "active",
            end_date: { $gte: new Date() }
        });

        if (!subscription) {
            return res.status(403).json({
                success: false,
                message: "Active subscription required"
            });
        }

        const plan = await Plan.findById(subscription.plan_id);

        // check report limit
        if (plan.report_limit !== "unlimited") {
            const count = await ReportAccess.countDocuments({
                customer_id: customerId,
                plan_id: plan._id
            });

            if (count >= Number(plan.report_limit)) {
                return res.status(403).json({
                    success: false,
                    message: "Report access limit exceeded"
                });
            }
        }

        req.subscription = subscription;
        req.plan = plan;

        next();
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
