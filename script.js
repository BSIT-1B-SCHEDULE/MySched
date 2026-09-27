const schedule = {
    Monday: [
        ["Life and Works of Rizal", "10:00 AM"],
        ["Operating System", "2:30 PM"],
        ["PC Troubleshooting", "4:00 PM"],
        ["Intro to Computing", "5:30 PM"]
    ],

    Tuesday: [
        ["Programming 1", "10:30 AM"],
        ["Mathematics in Modern World", "1:00 PM"],
        ["Arts Appreciation", "5:30 PM"]
    ],

    Wednesday: [
        ["Physical Education", "10:00 AM"],
        ["Operating System", "2:30 PM"],
        ["PC Troubleshooting", "4:00 PM"],
        ["Intro to Computing", "5:30 PM"]
    ],

    Thursday: [
        ["Programming 1", "10:30 AM"],
        ["Mathematics in Modern World", "1:00 PM"]
    ],

    Friday: [ ],

    Saturday: [
        ["CWTS" , "9:00 - 12:00"],
        ["ROTC" ,"9:00 - 12:00"]
    ]
};

;

function convertToMinutes(time) {
    const [timePart, period] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);

    if (period === "PM" && hours !== 12) {
        hours += 12;
    }

    if (period === "AM" && hours === 12) {
        hours = 0;
    }

    return hours * 60 + minutes;
}
function requestNotifPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}
document.body.addEventListener("click", requestNotifPermission, { once: true });

function notify(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  } else {
    showBanner(title, body);
  }
}

function showBanner(title, body) {
  const banner = document.createElement("div");
  banner.className = "notif-banner";
  banner.innerHTML = "<strong>" + title + "</strong><br>" + body;
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 10000);
}

// ---- Class reminder checker ----
const alreadyNotified = new Set();

function checkClassReminder() {
  const now = new Date();
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const today = days[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const todaySchedule = schedule[today] || [];

  todaySchedule.forEach(subject => {
    const subjectName = subject[0];
    const startTime = subject[1];
    const classStart = convertToMinutes(startTime);
    const minutesUntil = classStart - currentMinutes;

    const key = today + "-" + subjectName + "-" + startTime;

    // 30-minute warning
    if (minutesUntil <= 30 && minutesUntil > 29 && !alreadyNotified.has(key + "-30")) {
      alreadyNotified.add(key + "-30");
      showBanner("🔔 Upcoming Class", subjectName + " starts in 30 minutes.");
      notify("Upcoming Class", subjectName + " starts in 30 minutes.");
    }

    // 1-minute warning
    if (minutesUntil <= 1 && minutesUntil > 0 && !alreadyNotified.has(key + "-1")) {
      alreadyNotified.add(key + "-1");
      showBanner("⏰ Class soon!", subjectName + " starts in 1 minute!");
      notify("Class Starting Soon", subjectName + " starts in 1 minute!");
    }
  });
}

// Run once now, then every 30 seconds
checkClassReminder();
setInterval(checkClassReminder, 30000);

