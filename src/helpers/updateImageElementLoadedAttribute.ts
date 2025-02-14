export async function updateImageElementLoadedAttribute(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = document.getElementById(id)! as HTMLImageElement;

    // When fetching e.g. the precipitation images from MET's servers we need to set "crossorigin" to "anonymous"
    // so we can read the image's pixels in our shader.
    // See https://developer.mozilla.org/en-US/docs/web/html/attributes/crossorigin
    // image.crossOrigin = 'anonymous';

    image.onload = () => {
      // Set data-loaded='true' when the image has loaded
      image.dataset.loaded = 'true';
      resolve();
    };

    image.onerror = reject;
  });
}
