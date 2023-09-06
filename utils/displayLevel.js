function displayLevel(level) {
  if (level === "NEWBIE") {
    return "Yếu";
  } else if (level === "MEDIUM") {
    return "Trung bình";
  } else if (level === "MEDIUM_PLUS") {
    return "Trung bình+";
  } else if (level === "GOOD") {
    return "Khá";
  } else if (level === "GOOD_PLUS") {
    return "Khá+";
  } else if (level === "EXELLENT") {
    return "Giỏi";
  } else if (level === "EXELLENT_PLUS") {
    return "Giỏi+";
  }
}

export default displayLevel;
