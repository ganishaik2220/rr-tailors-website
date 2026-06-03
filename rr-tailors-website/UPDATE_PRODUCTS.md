# 👗 RR Tailors - Product Management Guide

Welcome! This guide is designed to help you easily manage your website's products. 

You do **not** need to touch any complex code or HTML to update your website! The entire product catalog is controlled by a single, simple text file called `products.json` located inside the `data` folder.

---

## 📍 Where to find everything

1. **The Data File:** `data/products.json` (This controls all text and prices)
2. **The Image Folders:** 
   - `images/embroidery/`
   - `images/maggam/`
   - `images/bridal/`

Whenever you open the `products.json` file in a text editor (like Notepad, VS Code, or directly inside GitHub), you will see blocks of text that look like this:

```json
{
    "id": 1,
    "name": "Imperial Crimson Bridal",
    "category": "Exquisite Zardosi embroidery...",
    "price": "₹1,45,000",
    "image": "images/bridal/imperial-crimson.jpg",
    "whatsappLink": "https://wa.me/919059582220?text=Interested in Imperial Crimson Bridal",
    "layout": {
        "colSpan": "lg:col-span-8",
        "aspectRatio": "aspect-[16/10]",
        "buttonType": "icon-text",
        "overlayClasses": "..."
    }
}
```
*Note: Always make sure you keep the quotation marks `""` around your text!*

---

## 1. How to Change a Product Price

1. Open `data/products.json`.
2. Scroll down until you find the name of the product you want to change (e.g., `"name": "Midnight Onyx"`).
3. Look for the `"price"` line right below it.
4. Carefully change the price inside the quotation marks.
   - **Old:** `"price": "₹1,85,000"`
   - **New:** `"price": "₹1,75,000"`
5. Save the file. Your website will update automatically!

---

## 2. How to Change a Product Image

1. Pick your new image and give it a simple name with no spaces (e.g., `new-black-saree.jpg`).
2. Upload this image into the correct folder (e.g., `images/embroidery/`).
3. Open `data/products.json` and find the product you are updating.
4. Change the `"image"` line to point to your new file name.
   - **Old:** `"image": "images/embroidery/midnight-onyx.jpg"`
   - **New:** `"image": "images/embroidery/new-black-saree.jpg"`
5. Save the file.

---

## 3. How to Add a New Product

Adding a new product is as simple as copying an existing one!

1. Upload your new product image into the correct folder (e.g., `images/bridal/my-new-bridal.jpg`).
2. Open `data/products.json` and scroll to the very bottom.
3. **Copy** an entire block of an existing product (from the opening `{` to the closing `}`).
4. Add a comma `,` after the last product's closing `}`, and paste your copied block below it.
5. Change the details in your new block:
   - `"id"`: Give it a new number (e.g., 12).
   - `"name"`: Type the new product's name.
   - `"price"`: Enter the new price.
   - `"category"`: Add a short description.
   - `"image"`: Enter the path to your new image (e.g., `"images/bridal/my-new-bridal.jpg"`).
   - `"whatsappLink"`: Update the text at the end of the link so you know which product the customer is asking about!
6. Save the file. The website will automatically build the new luxury card on your page!

---

## 4. How to Remove a Product

1. Open `data/products.json`.
2. Find the product you want to remove.
3. Delete its entire block (from the opening `{` to the closing `}`).
4. **Important Rule:** Make sure the very last product in the file does **not** have a comma `,` after its closing `}`.
5. Save the file. The product will instantly disappear from the website.

---

### 🎉 Need Help?
If the website layout ever breaks or stops showing products, it usually means a quotation mark `"` or a comma `,` was accidentally deleted in the `products.json` file. Double-check your recent edits!
