import {
  getStatsByResource as getStatsByResourceService,
  getStatsSummary as getStatsSummaryService,
  logManualHit as logManualHitService
} from "../../services/stats.service.js";

/********** get stats summary **********/
const getStatsSummaryController = async (req, res) => {
  try {
    const { year, userId, page } = req.validatedQuery;

    const data = await getStatsSummaryService(year, userId, page);
    res.status(200).json({
      success: true,
      message: `Statistics summary fetched successfully for year ${year}`,
      data
    });
  } catch (error) {
    console.error("Fetch Stats Summary Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats summary."
    });
  }
};

/********** get stats by resource **********/
const getStatsByResourceController = async (req, res) => {
  try {
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

    const data = await getStatsByResourceService(year);
    res.status(200).json({
      success: true,
      message: `Resource statistics fetched successfully for year ${year}`,
      data
    });
  } catch (error) {
    console.error("Fetch Resource Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resource stats."
    });
  }
};

/********** log manual hit **********/
const logManualHitController = async (req, res) => {
  try {
    const { pageType, targetId, ficheName } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const host = req.headers["host"] || "";
    const userId = req.user ? req.user.id : 0;
    const userName = req.user ? req.user.name : "Guest";

    await logManualHitService({
      pageType,
      targetId,
      ficheName,
      ip,
      host,
      userId,
      userName
    });

    res.status(201).json({
      success: true,
      message: "Hit logged successfully!"
    });
  } catch (error) {
    console.error("Log Manual Hit Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to log hit."
    });
  }
};

export {
  getStatsByResourceController,
  getStatsSummaryController,
  logManualHitController
};
