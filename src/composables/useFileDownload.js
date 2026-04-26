/**
 * useFileDownload composable
 *
 * Purpose: Provide a method to download JSON data as a file
 * Uses Blob API and a temporary anchor element to trigger download
 *
 * @returns {{ downloadFile: Function }}
 */
export const useFileDownload = () => {
  /**
   * Download JSON data as a file to the user's machine
   *
   * @param {string} fileName - Name for the downloaded file
   * @param {Object} data - JSON data to download
   *
   * @example
   * const { downloadFile } = useFileDownload();
   * downloadFile('en.json', { app: { title: 'My App' } });
   */
  const downloadFile = (fileName, data) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return { downloadFile };
};
