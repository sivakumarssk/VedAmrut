import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

import {
    getUserReviews,
    saveUserReviews,
    UserReview,
} from '../../src/utils/storage';

type ReviewsContextType = {
  reviews: UserReview[];
  isLoading: boolean;
  addReview: (review: Omit<UserReview, 'id' | 'daysAgo'>) => Promise<void>;
  getReviewsForProduct: (productId: string) => UserReview[];
};

const ReviewsContext = createContext<ReviewsContextType | undefined>(
  undefined
);

type Props = {
  children: ReactNode;
};

export function ReviewsProvider({ children }: Props) {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await getUserReviews();
      setReviews(stored);
      setIsLoading(false);
    })();
  }, []);

  const addReview = async (
    review: Omit<UserReview, 'id' | 'daysAgo'>
  ) => {
    const newReview: UserReview = {
      ...review,
      id: Date.now().toString(),
      daysAgo: 0,
    };
    const next = [newReview, ...reviews];
    setReviews(next);
    await saveUserReviews(next);
  };

  const getReviewsForProduct = (productId: string) =>
    reviews.filter((review) => review.productId === productId);

  return (
    <ReviewsContext.Provider
      value={{ reviews, isLoading, addReview, getReviewsForProduct }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviewsContext() {
  const context = useContext(ReviewsContext);

  if (!context) {
    throw new Error('useReviewsContext must be used inside ReviewsProvider');
  }

  return context;
}
