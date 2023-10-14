import * as dateUtils from "./dateUtils.js";

function convertedObject(dbObject) {
  const formattedActivities = dbObject.map((activity) => {
    const activityObject = activity.toObject();

    activityObject.createdDate = dateUtils.dateToString(activity.createdDate);

    if (activityObject.dueDate)
      activityObject.dueDate = dateUtils.dateToString(activity.dueDate);

    return activityObject;
  });
  return formattedActivities;
}

function filteredAndSorted(activities, filterOption, sortOption) {
  let formattedActivities = activities;
  switch (filterOption) {
    case "Completed":
      formattedActivities = activities.filter((act) => act.finished === true);
      break;
    case "Active":
      formattedActivities = activities.filter((act) => act.finished === false);
      break;
    case "Due":
      formattedActivities = activities.filter((act) => {
        return act.dueDate >= Date.now();
      });
      break;
    default:
      break;
  }

  if (typeof sortOption !== "undefined" && sortOption === "Due date") {
    formattedActivities.sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return a.dueDate - b.dueDate;
      } else if (a.dueDate) {
        return -1;
      } else if (b.dueDate) {
        return 1;
      } else {
        return 0;
      }
    });
  }
  return formattedActivities;
}

export { convertedObject, filteredAndSorted };
