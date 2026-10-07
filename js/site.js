// Gallery lightbox. Without this file, gallery links open the full-size
// image directly.

// Applies to links marked data-lightbox inside a .gallery.
const links = [...document.querySelectorAll(".gallery a[data-lightbox]")];

if (links.length && "HTMLDialogElement" in window) {
  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", "Image viewer");
  dialog.innerHTML = `
    <figure>
      <img alt="">
      <figcaption></figcaption>
    </figure>
    <p class="lightbox-count"></p>
    <div class="lightbox-controls">
      <button type="button" data-step="-1">Previous</button>
      <button type="button" data-close autofocus>Close</button>
      <button type="button" data-step="1">Next</button>
    </div>`;
  document.body.append(dialog);

  const img = dialog.querySelector("img");
  const caption = dialog.querySelector("figcaption");
  const count = dialog.querySelector(".lightbox-count");
  const stepButtons = dialog.querySelectorAll("[data-step]");
  let index = 0;

  const show = (i) => {
    index = (i + links.length) % links.length;
    const link = links[index];
    const thumb = link.querySelector("img");
    img.src = link.href;
    img.alt = thumb.alt;
    caption.textContent =
      link.closest("figure")?.querySelector("figcaption")?.textContent.trim() ??
      "";
    const position = `${index + 1} of ${links.length}`;
    count.textContent = links.length > 1 ? position : "";
    dialog.setAttribute("aria-label", `Image ${position}`);
  };

  stepButtons.forEach((button) => {
    button.hidden = links.length < 2;
    button.addEventListener("click", () =>
      show(index + Number(button.dataset.step)),
    );
  });
  dialog
    .querySelector("[data-close]")
    .addEventListener("click", () => dialog.close());

  // Clicking the dark backdrop (the dialog itself, outside its content) closes it.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") show(index + 1);
    if (event.key === "ArrowLeft") show(index - 1);
  });

  links.forEach((link, i) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      show(i);
      dialog.showModal();
    });
  });
}
