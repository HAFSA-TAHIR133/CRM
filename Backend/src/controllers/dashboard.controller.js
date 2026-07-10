// This is your current code — it is 100% correct!
import { getDashboardMetricsService } from "../services/dashboard.services.js";

export const getDashboardMetrics = async (req, res) => {
  try {
    // 1. It correctly passes req.user (which contains the ID and Role) to the service
    const metrics = await getDashboardMetricsService(req.user);

    // 2. It sends whatever the service calculates back to the frontend
    return res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error(error);
    console.error("Dashboard Metrics Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard metrics.",
      error: error.message,
    });
  }
};