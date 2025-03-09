// export async function resizeImage(stringBase64, maxWidth = 512, maxHeight = 512) {
//   let resized = await new Promise((resolve) => {
//     let img = new Image()
//     img.src = stringBase64
//     img.onload = () => {
//       let canvas = document.createElement('canvas')
//       let width = img.width
//       let height = img.height
//       if (width > height) {
//         if (width > maxWidth) {
//           height *= maxWidth / width
//           width = maxWidth
//         }
//       } else {
//         if (height > maxHeight) {
//           width *= maxHeight / height
//           height = maxHeight
//         }
//       }
//       canvas.width = width
//       canvas.height = height
//       let ctx = canvas.getContext('2d')
//       ctx.drawImage(img, 0, 0, width, height)
//       resolve(canvas.toDataURL())
//     }
//   });
//   return resized;
// }

export function convertImageBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
