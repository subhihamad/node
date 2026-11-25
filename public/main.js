const statusElement = document.querySelector("#status");
const coursesElement = document.querySelector("#courses");
const coursesApiUrl = "/api/courses?limit=1000";

function renderCourses(courses) {
  coursesElement.replaceChildren();

  if (courses.length === 0) {
    statusElement.textContent = "No courses found.";
    return;
  }

  statusElement.textContent = `${courses.length} course${courses.length === 1 ? "" : "s"} found.`;

  courses.forEach((course) => {
    const item = document.createElement("li");
    item.className = "course";

    const title = document.createElement("h2");
    title.textContent = course.title;

    const price = document.createElement("p");
    price.textContent = `Price: ${course.price}`;

    item.append(title, price);
    coursesElement.append(item);
  });
}

async function loadCourses() {
  try {
    const response = await fetch(coursesApiUrl);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Unable to load courses.");
    }

    renderCourses(result.data?.courses || []);
  } catch (error) {
    statusElement.textContent = error.message;
    statusElement.className = "error";
  }
}

loadCourses();
