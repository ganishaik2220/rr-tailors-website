# Website Update Guide

This guide explains how to manage your website content without touching any code. All changes are made by simply replacing image files or editing text.

## 1. How to change product names, prices, or descriptions
1. Open `products/products.json` in any text editor (like Notepad).
2. Locate the product you want to edit.
3. Edit the text inside the quotes for `"name"`, `"price"`, or `"category"`.
4. Save the file and refresh the website. The changes will appear instantly.

## 2. How to change product images
1. Add your new image to the `images/products/` folder.
2. Open `products/products.json`.
3. Locate the product you want to update.
4. Change the `"image"` field to point to your new image: `"images/products/your-new-image.jpg"`.
5. Save the file. 

## 3. How to add new products
1. Place the new product image into `images/products/`.
2. Open `products/products.json`.
3. Copy an existing product block (everything between `{` and `}` including the comma).
4. Paste it at the bottom (or top) of the list.
5. Update the `"id"`, `"name"`, `"price"`, and `"image"` fields for your new product.
6. Save the file. The website will automatically generate a new luxury card for this product.

## 4. How to replace hero images (The animated background)
1. The animated background in the hero section relies on frames located in `images/hero/`.
2. To replace the animation, simply delete the existing frames and add your new sequence of images.
3. Ensure the images are named sequentially as `ezgif-frame-001.jpg`, `ezgif-frame-002.jpg`, etc., to match the existing naming convention.
4. The site will automatically pull these frames to render the high-performance background.

## 5. How to update logos
1. Place your new logo image in the `images/logo/` folder.
2. Open `products/products.json` or `index.html` (if the logo is used in the navigation bar or footer).
3. Update the `src` attribute of the image tag to point to `images/logo/your-new-logo.png`.
*Note: Currently, the brand name "BLOUSE BOUTIQUE RR" is styled using CSS typography for a luxury feel, so no image logo is strictly required, but the folder is available if you choose to add one.*
