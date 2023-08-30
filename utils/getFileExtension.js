const getFileExtension = (url) => {
  return url.split(/[#?]/)[0].split(".").pop().trim();
};

export default getFileExtension;
