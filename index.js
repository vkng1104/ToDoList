import express from "express";
import bodyParser from "body-parser";
import * as dbHelper from "./database/db_helper.js";
import * as model from "./model/activity.js";
import * as objectUtils from "./utils/objectUtils.js";

const port = 3000;
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  const activities = await dbHelper.getAllActivities();

  let formattedActivities = objectUtils.filteredAndSorted(
    activities,
    req.query.filter,
    req.query.sorted
  );
  formattedActivities = objectUtils.convertedObject(formattedActivities);
  // console.log(formattedActivities);

  res.render("index.ejs", {
    filter: typeof req.query.filter === "undefined" ? "All" : req.query.filter,
    sorted:
      typeof req.query.sorted === "undefined" ? "Added date" : req.query.sorted,
    activities: formattedActivities,
  });
});

app.post("/post", async (req, res) => {
  console.log(req.body);
  const activity = new model.Activity(
    req.body.activity,
    Date.now(),
    req.body.date,
    false
  );
  await dbHelper.addActivity(activity);
  res.redirect("/");
});

app.post("/put/:activityID", async (req, res) => {
  console.log(req.body);
  await dbHelper.updateActivity(req.body);
  res.redirect("/");
});

app.post("/delete/:activityID", async (req, res) => {
  console.log(req.body);
  await dbHelper.deleteActivity(req.body);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
