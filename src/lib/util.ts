function onSave() {}
//@ts-ignore
export function preventDefault(fn) {
  //@ts-ignore
  return function (event) {
    event.preventDefault();
    //@ts-ignore
    fn.call(this, event);
  };
}

export function showToast(message: string) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.backgroundColor = "#48BB78";
  toast.style.color = "white";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "5px";
  toast.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  toast.style.zIndex = "1000";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = "opacity 0.5s";
    toast.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, 3000);
}

// export function showModal(text: string): Promise<boolean> {
//   return new Promise((resolve) => {
//     const modal = document.createElement("div");
//     modal.style.position = "fixed";
//     modal.style.top = "0";
//     modal.style.left = "0";
//     modal.style.width = "100%";
//     modal.style.height = "100%";
//     modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
//     modal.style.display = "flex";
//     modal.style.alignItems = "center";
//     modal.style.justifyContent = "center";
//     modal.style.zIndex = "1000";

//     const modalContent = document.createElement("div");
//     modalContent.style.backgroundColor = "white";
//     modalContent.style.padding = "20px";
//     modalContent.style.borderRadius = "5px";
//     modalContent.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
//     modalContent.style.textAlign = "center";

//     const message = document.createElement("p");
//     message.textContent = text;

//     const buttonContainer = document.createElement("div");
//     buttonContainer.style.marginTop = "20px";
//     buttonContainer.style.display = "flex";
//     buttonContainer.style.justifyContent = "space-around";

//     const yesButton = document.createElement("button");
//     yesButton.textContent = "Yes";
//     yesButton.style.padding = "10px 20px";
//     yesButton.style.backgroundColor = "#48BB78";
//     yesButton.style.color = "white";
//     yesButton.style.border = "none";
//     yesButton.style.borderRadius = "5px";
//     yesButton.style.cursor = "pointer";

//     const noButton = document.createElement("button");
//     noButton.textContent = "No";
//     noButton.style.padding = "10px 20px";
//     noButton.style.backgroundColor = "#F56565";
//     noButton.style.color = "white";
//     noButton.style.border = "none";
//     noButton.style.borderRadius = "5px";
//     noButton.style.cursor = "pointer";

//     yesButton.addEventListener("click", () => {
//       document.body.removeChild(modal);
//       resolve(true);
//     });

//     noButton.addEventListener("click", () => {
//       document.body.removeChild(modal);
//       resolve(false);
//     });

//     buttonContainer.appendChild(yesButton);
//     buttonContainer.appendChild(noButton);
//     modalContent.appendChild(message);
//     modalContent.appendChild(buttonContainer);
//     modal.appendChild(modalContent);
//     document.body.appendChild(modal);
//   });
// }
