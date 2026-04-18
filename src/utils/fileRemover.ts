import fs from 'node:fs';

export const deleteLocalFile = async (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (error) {
    console.error(`Failed to delete local file at ${filePath}:`, error);
  }
};
