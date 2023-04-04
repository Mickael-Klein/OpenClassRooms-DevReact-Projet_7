function stringNormalizer(str) {
  const normalizedStr = str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return normalizedStr;
}

function tagNormalizer(str) {
  const lowerTag = str.toLowerCase();
  const capitalizedTag = lowerTag.charAt(0).toUpperCase() + lowerTag.slice(1);

  return capitalizedTag;
}
