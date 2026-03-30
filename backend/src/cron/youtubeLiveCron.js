import cron from "node-cron";
import { checkLiveStatus } from "../services/youtubeService.js";
import LiveStatus from "../models/LiveStatus.js";

cron.schedule("*/2 * * * *", async () => {
    console.log("🔄 Checking YouTube live status...");

    const liveData = await checkLiveStatus();

    await LiveStatus.findOneAndUpdate(
        {},
        {
            isLive: liveData.isLive,
            videoId: liveData.videoId || null,
            updatedAt: new Date()
        },
        { upsert: true }
    );
});
