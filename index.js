import express from "express";
import bodyParser from "body-parser";
import * as dbHelper from "./database/db_helper.js";
import * as model from "./model/activity.js";

const port = 3000;
const app = express();

function dateToString(date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function convertedObject(dbObject) {
  const formattedActivities = dbObject.map((activity) => {
    const activityObject = activity.toObject();

    activityObject.createdDate = dateToString(activity.createdDate);

    if (activityObject.dueDate)
      activityObject.dueDate = dateToString(activity.dueDate);

    return activityObject;
  });
  return formattedActivities;
}

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  console.log(
    typeof req.query.filter === "undefined" ? "All" : req.query.filter
  );
  const activities = await dbHelper.getAllActivities();
  let formattedActivities = convertedObject(activities);
  switch (req.query.filter) {
    case "Completed":
      formattedActivities = formattedActivities.filter(
        (act) => act.finished === true
      );
      break;
    case "Active":
      formattedActivities = formattedActivities.filter(
        (act) => act.finished === false
      );
      break;
    case "Due":
      formattedActivities = formattedActivities.filter((act) => {
        const formattedDate = new Date(act.dueDate);
        return formattedDate >= Date.now();
      });
      break;
    default:
      break;
  }
  console.log(formattedActivities);
  res.render("index.ejs", {
    filter: typeof req.query.filter === "undefined" ? "All" : req.query.filter,
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
