export default {
  name: "food",
  type: "document",
  title: "Food",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Food Name",
    },
    {
      name: "slug",
      type: "slug",
      title: "Slug",
      options: {
        source: "name",
        maxLength: 96,
      },
    },
    {
      name: "category",
      type: "string",
      title: "Category",
      description: "Category of the food item (e.g., Burger, Sandwich, Drink, etc.)",
    },
    {
      name: "price",
      type: "number",
      title: "Current Price",
    },
    {
      name: "originalPrice",
      type: "number",
      title: "Original Price",
      description: "Price before discount (if any)",
    },
    {
      name: "tags",
      type: "array",
      title: "Tags",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      description: "Tags for categorization (e.g., Best Seller, Popular, New)",
    },
    {
      name: "images",
      type: "array",
      title: "Food Images",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
      description: "Upload multiple images of the food item",
    },
    {
      name: "image", // Add the old field back temporarily
      type: "image",
      title: "Food Image (Legacy)",
    },
    {
      name: "description",
      type: "text",
      title: "Description",
      description: "Short description of the food item",
    },
    {
      name: "longDescription",
      type: "text",
      title: "Long Description",
      description: "Detailed information about the food item (visible on productDetails page)",
    },
    {
      name: "available",
      type: "boolean",
      title: "Available",
      description: "Availability status of the food item",
    },
    {
      name: "weight",
      type: "number",
      title: "Weight (lbs)",
      description: "Product weight for shipping calculations",
      validation: (Rule: any) => Rule.required().min(0.1),
      initialValue: 1
    },
    {
      name: "dimensions",
      type: "string",
      title: "Dimensions (LxWxH)",
      description: "Dimensions in inches, format: LengthxWidthxHeight",
      validation: (Rule: any) => Rule.required().regex(/^\d+x\d+x\d+$/, {
        name: "dimensions",
        description: "Must be in the format 5x5x5"
      }),
      initialValue: "5x5x5"
    },
  ],
};
