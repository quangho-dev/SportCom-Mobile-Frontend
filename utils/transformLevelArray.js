import displayLevel from "./displayLevel";

const transformLevelArray = (levelArray) => {
  const convertedArray = levelArray.map((level) => displayLevel(level));
  const reversedArray = convertedArray.reverse();
  const addedSpaceArray = reversedArray.map((level, index) => {
    if (index !== 0) {
      return " " + level;
    } else {
      return level;
    }
  });

  return addedSpaceArray.toString();
};

export default transformLevelArray;
