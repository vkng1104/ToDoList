import mongoose from "mongoose";

const url = "mongodb://127.0.0.1:27017";
const dbName = "ActivitiesDB";

async function main() {
  await mongoose.connect(url + "/" + dbName);
}

main().catch((err) => console.log(err));

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: Date,
  finished: Boolean,
});

const Activity = mongoose.model("Activity", activitySchema);

async function addActivity(activity) {
  const addedActivity = new Activity({
    name: activity.name,
    date: activity.date,
    finished: activity.finished,
  });

  // Save the activity to the database
  try {
    await addedActivity.save();
    console.log("Activity added:", addedActivity);
  } catch (error) {
    console.error("Error adding activity:", error);
  }
}

async function getAllActivities() {
  try {
    const query = Activity.find({});
    query.getFilter();
    const docs = await query.exec();
    console.log("Get all activities successfully");
    return docs;
  } catch (error) {
    console.error("Error adding activity:", error);
  }
}

export { addActivity, getAllActivities };