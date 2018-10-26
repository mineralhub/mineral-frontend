export const KEYSTORE_EXTENSION = ".keystore";

export function downloadStringAsFile(contents, filename, type='text/plain') {
  let el = window.document.createElement('a');
  el.href = window.URL.createObjectURL(new Blob([contents], {type: type}));
  el.download = filename;

  document.body.appendChild(el);
  el.click();

  document.body.removeChild(el);
}

export function readFileContentsFromEvent(e) {
  return new Promise(resolve => {
    let files = e.target.files;
    const reader = new FileReader();
    reader.onload = (file) => {
      const contents = file.target.result;
      resolve(contents);
    };

    reader.readAsText(files[0]);
  })
}