import fs from "node:fs/promises";

export const checkFile = async (path, createIfMissing) => {
  if (createIfMissing){
    try {
      await fs.access(path);
    } catch (error) {
      await fs.writeFile(path, JSON.stringify([]));
      console.log(`File ${path} created`);
      return true;
    }
  }

  try {
    await fs.access(path);
  } catch (error) {
    console.log(`File ${path} not found`);
    return false;
  }  

  return true;
}