let originalFinished;
let originalActivity;

function editIconClick() {
  const activities = $(".edit-icon");
  // console.log(activities.length);
  activities.each((index) => {
    const activityCard = $(`#editIcon${index}`);
    activityCard.on("click", () => {
      const checkbox = $(`#checkbox${index}`);
      const activity = $(`#activity${index}`);

      if (checkbox.is(":disabled")) {
        checkbox.prop("disabled", false);
        activity.prop("disabled", false);

        activityCard.attr("title", "Save");
        activityCard
          .find("i")
          .removeClass("fa-pencil-alt")
          .addClass("fa-check");

        originalFinished = checkbox.is(":checked");
        originalActivity = activity.val();
        console.log(originalFinished, originalActivity);
      } else {
        checkbox.prop("disabled", true);
        activity.prop("disabled", true);

        activityCard.attr("title", "Edit");
        activityCard
          .find("i")
          .removeClass("fa-check")
          .addClass("fa-pencil-alt");

        if (
          checkbox.is(":checked") !== originalFinished ||
          activity.val() !== originalActivity
        ) {
          const _id = activityCard.closest("ul").attr("id");
          fetch(`/put/${index}`, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              _id: _id,
              finished: checkbox.is(":checked"),
              name: activity.val(),
            }),
          })
            .then((response) => {
              if (response.ok) {
                console.log("Edit request successful");
              } else {
                console.error("Edit request failed");
              }
            })
            .catch((err) => console.log(err));
        } else {
          console.log("You did not change anything!");
        }
      }
    });
  });
}

function deleteIconClick() {
  const activities = $(".delete-icon");
  activities.each((index) => {
    const activityCard = $(`#deleteIcon${index}`);
    activityCard.on("click", () => {
      const _id = activityCard.closest("ul").attr("id");
      fetch(`/delete/${index}`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: _id }),
      })
        .then((response) => {
          if (response.ok) {
            console.log("Delete request successful");
          } else {
            console.error("Delete request failed");
          }
        })
        .catch((err) => console.log(err));
    });
  });
}

editIconClick();
deleteIconClick();
