import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';

import { API_BASE_URL } from '@/constants/api';
import { getToken } from '@/utils/storage';

export type UserReview = {
  id: string;
  productId: string;
  userId?: string;
  userName?: string;
  rating: number;
  title?: string;
  comment: string;
  author?: string;
  daysAgo: number;
};

type ProductRating = {
  rating: number;
  review_count: number;
};

type ReviewsContextType = {
  reviews: UserReview[];
  isLoading: boolean;

  addReview: (
    review: Omit<UserReview, 'id' | 'daysAgo'>
  ) => Promise<void>;

  getReviewsForProduct: (
    productId: string
  ) => UserReview[];

  fetchReviewsForProduct: (
    productId: string
  ) => Promise<void>;

  getProductRating: (
    productId: string
  ) => Promise<ProductRating>;
};

const ReviewsContext =
  createContext<ReviewsContextType | undefined>(
    undefined
  );

type Props = {
  children: ReactNode;
};

export function ReviewsProvider({
  children,
}: Props) {
  const [reviews, setReviews] = useState<UserReview[]>(
    []
  );

  const [isLoading, setIsLoading] =
    useState(false);

  // =====================================================
  // FETCH REVIEWS FOR ANY PRODUCT
  // =====================================================

  const fetchReviewsForProduct = async (
    productId: string
  ) => {
    if (!productId) {
      return;
    }

    try {
      setIsLoading(true);

      console.log(
        '================================'
      );

      console.log(
        'FETCHING REVIEWS FOR PRODUCT:',
        productId
      );

      const response = await fetch(
        `${API_BASE_URL}/api/reviews/product/${productId}`
      );

      const result = await response.json();

      console.log(
        'REVIEWS STATUS:',
        response.status
      );

      console.log(
        'REVIEWS RESPONSE:',
        result
      );

      if (!response.ok || !result.success) {
        throw new Error(
          result?.message ||
            'Failed to fetch reviews'
        );
      }

      const backendReviews =
        Array.isArray(result.reviews)
          ? result.reviews
          : [];

      const formattedReviews: UserReview[] =
        backendReviews.map(
          (review: any) => {
            const createdAt = new Date(
              review.created_at
            );

            const now = new Date();

            const difference =
              now.getTime() -
              createdAt.getTime();

            const daysAgo = Math.max(
              0,
              Math.floor(
                difference /
                  (1000 *
                    60 *
                    60 *
                    24)
              )
            );

            return {
              id: String(review.id),

              productId: String(
                review.product_id
              ),

              userId: review.user_id
                ? String(review.user_id)
                : undefined,

              userName:
                review.user_name ||
                'User',

              rating:
                Number(review.rating) || 0,

              title:
                review.title ||
                'Review',

              comment:
                review.comment || '',

              author:
                review.user_name ||
                'User',

              daysAgo,
            };
          }
        );

      /*
       * Remove old reviews for this product
       * and replace them with latest backend data.
       *
       * Reviews for other products remain untouched.
       */

      setReviews((previousReviews) => {
        const otherProductReviews =
          previousReviews.filter(
            (review) =>
              String(review.productId) !==
              String(productId)
          );

        return [
          ...otherProductReviews,
          ...formattedReviews,
        ];
      });

      console.log(
        'FORMATTED REVIEWS:',
        formattedReviews
      );

      console.log(
        '================================'
      );
    } catch (error) {
      console.error(
        'FETCH REVIEWS ERROR:',
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =====================================================
  // GET PRODUCT RATING FOR ANY PRODUCT
  // =====================================================

  const getProductRating = async (
    productId: string
  ): Promise<ProductRating> => {
    if (!productId) {
      return {
        rating: 0,
        review_count: 0,
      };
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reviews/product/${productId}/rating`
      );

      const result = await response.json();

      console.log(
        'PRODUCT RATING:',
        productId,
        result
      );

      if (!response.ok || !result.success) {
        throw new Error(
          result?.message ||
            'Failed to fetch rating'
        );
      }

      return {
        rating:
          Number(result.rating) || 0,

        review_count:
          Number(result.review_count) || 0,
      };
    } catch (error) {
      console.error(
        'GET PRODUCT RATING ERROR:',
        error
      );

      return {
        rating: 0,
        review_count: 0,
      };
    }
  };

  // =====================================================
  // ADD REVIEW FOR ANY PRODUCT
  // =====================================================

  const addReview = async (
    review: Omit<
      UserReview,
      'id' | 'daysAgo'
    >
  ) => {
    try {
      const token = await getToken();

      if (!token) {
        throw new Error(
          'Please login before submitting a review'
        );
      }

      console.log(
        '================================'
      );

      console.log(
        'SUBMITTING REVIEW'
      );

      console.log(
        'PRODUCT ID:',
        review.productId
      );

      console.log(
        'USER ID:',
        review.userId
      );

      console.log(
        'RATING:',
        review.rating
      );

      console.log(
        'COMMENT:',
        review.comment
      );

      console.log(
        '================================'
      );

      const response = await fetch(
        `${API_BASE_URL}/api/reviews`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            product_id:
              Number(review.productId),

            rating:
              Number(review.rating),

            comment:
              review.comment,
          }),
        }
      );

      const result =
        await response.json();

      console.log(
        'ADD REVIEW STATUS:',
        response.status
      );

      console.log(
        'ADD REVIEW RESPONSE:',
        result
      );

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result?.message ||
            'Failed to submit review'
        );
      }

      // Refresh ONLY this product's reviews
      await fetchReviewsForProduct(
        String(review.productId)
      );
    } catch (error) {
      console.error(
        'ADD REVIEW ERROR:',
        error
      );

      throw error;
    }
  };

  // =====================================================
  // GET REVIEWS FOR CURRENT PRODUCT
  // =====================================================

  const getReviewsForProduct = (
    productId: string
  ) => {
    return reviews.filter(
      (review) =>
        String(review.productId) ===
        String(productId)
    );
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        isLoading,
        addReview,
        getReviewsForProduct,
        fetchReviewsForProduct,
        getProductRating,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviewsContext() {
  const context =
    useContext(ReviewsContext);

  if (!context) {
    throw new Error(
      'useReviewsContext must be used inside ReviewsProvider'
    );
  }

  return context;
}