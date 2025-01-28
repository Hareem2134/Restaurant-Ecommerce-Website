export interface ProductType {
    _id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    image: {
      asset: {
        _ref: string;
      };
    };
    description: string;
    longDescription?: string;
    tags?: string[];
    images?: {
      asset: {
        _ref: string;
      };
    }[];
    reviews?: {
      user: string;
      rating: number;
      comment: string;
    }[];
    available: boolean;
    category: string;
  }
  