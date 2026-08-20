import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import RatingBadge from '@/components/home/RatingBadge';
import { products } from '@/constants/DummyData2';
import { useAddress } from '@/hooks/useAddress';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useLoginPopup } from '@/hooks/useLoginPopup';
import { useReviews } from '@/hooks/useReviews';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { cartLines, addToCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const { showLoginPopup } = useLoginPopup();
  const { selectedAddress } = useAddress();
  const { getReviewsForProduct, addReview } = useReviews();
  const insets = useSafeAreaInsets();

  const product = products.find((item) => item.id === id) ?? products[0];
  const similarProducts = products.filter((item) => item.id !== product.id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const existingLine = cartLines.find(
    (line) => line.productId === product.id
  );
  const isInCart = !!existingLine;

  const userReviews = getReviewsForProduct(product.id);
  const allReviews = [...userReviews, ...product.reviewsList];

  const handleAddToCart = async () => {
    if (isInCart) {
      router.push('/(home)/cart');
      return;
    }
    await addToCart(product.id, 1);
  };

  const handleBuyNow = async () => {
    if (!isInCart) {
      await addToCart(product.id, 1);
    }
    router.push('/(home)/cart');
  };

  const handleDeliveryPress = () => {
    if (!isLoggedIn) {
      showLoginPopup();
      return;
    }
    if (!selectedAddress) {
      router.push('/(home)/add-address');
      return;
    }
    router.push('/(home)/saved-addresses');
  };

  const handleWriteReview = () => {
    if (!isLoggedIn) {
      showLoginPopup();
      return;
    }
    setReviewRating(5);
    setReviewTitle('');
    setReviewComment('');
    setReviewModalVisible(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewComment.trim() || submittingReview) return;

    setSubmittingReview(true);
    try {
      await addReview({
        productId: product.id,
        rating: reviewRating,
        title: reviewTitle.trim() || 'Review',
        comment: reviewComment.trim(),
        author: user?.fullName ?? 'You',
      });
      setReviewModalVisible(false);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 40 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={20} color="#222" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-outline" size={20} color="#222" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={[product.image, product.image, product.image]}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => String(index)}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / width
            );
            setActiveImageIndex(index);
          }}
          renderItem={({ item }) => (
            <Image
              source={item}
              resizeMode="contain"
              style={styles.productImage}
            />
          )}
        />

        <View style={styles.dotsRow}>
          {[0, 1, 2].map((dot) => (
            <View
              key={dot}
              style={[
                styles.dot,
                dot === activeImageIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.body}>
          <Text style={styles.selectedQuantityLabel}>Selected Quantity</Text>
          <View style={styles.quantityBadge}>
            <Text style={styles.quantityBadgeText}>
              {product.quantityLabel}
            </Text>
          </View>

          <Text style={styles.name}>{product.name.replace('\n', ' ')}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price.toFixed(2)}</Text>
            <Text style={styles.oldPrice}>
              ₹{product.oldPrice.toFixed(2)}
            </Text>
          </View>

          <RatingBadge rating={product.rating} reviews={product.reviews} />

          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Ionicons name="cart-outline" size={20} color="#FFFFFF" />
            <Text style={styles.addToCartText}>
              {isInCart ? 'Go to Cart' : 'Add to cart'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buyNowButton}
            onPress={handleBuyNow}
          >
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>

          <Text style={styles.sectionHeading}>Delivery Details</Text>

          {selectedAddress ? (
            <View style={styles.deliveryRow}>
              <Text style={styles.deliveryText} numberOfLines={1}>
                Delivary to : {selectedAddress.city} -{' '}
                {selectedAddress.pincode}
              </Text>
              <TouchableOpacity onPress={handleDeliveryPress}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addAddressButton}
              onPress={handleDeliveryPress}
            >
              <Ionicons name="add" size={18} color="#1C6FD9" />
              <Text style={styles.addAddressText}>Add Delivery Address</Text>
            </TouchableOpacity>
          )}

          <View style={styles.stockBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#1C9C57" />
            <Text style={styles.stockText}>In Stock</Text>
          </View>

          <Text style={styles.sectionHeading}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Ratings and reviews</Text>
            <TouchableOpacity onPress={handleWriteReview}>
              <Text style={styles.writeReviewText}>Write a Review</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={allReviews}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingRight: 8 }}
            renderItem={({ item }) => (
              <View style={styles.reviewCard}>
                <View style={styles.reviewHeaderRow}>
                  <View style={styles.reviewRatingBadge}>
                    <Text style={styles.reviewRatingText}>{item.rating}</Text>
                    <Ionicons name="star" size={12} color="#F4B400" />
                  </View>
                  <Text style={styles.reviewDays}>
                    {item.daysAgo === 0 ? 'Today' : `${item.daysAgo} Days ago`}
                  </Text>
                </View>
                <Text style={styles.reviewTitle}>{item.title}</Text>
                <Text style={styles.reviewComment} numberOfLines={3}>
                  {item.comment}
                </Text>
                <Text style={styles.reviewAuthor}>{item.author}</Text>
              </View>
            )}
          />

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Similar Products</Text>
            <TouchableOpacity>
              <Ionicons name="arrow-forward" size={20} color="#222" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={similarProducts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingRight: 8 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.similarCard}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: '/(home)/product-details',
                    params: { id: item.id },
                  })
                }
              >
                <View style={styles.similarTopRow}>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>-{item.discount}%</Text>
                  </View>
                </View>
                <Image
                  source={item.image}
                  resizeMode="contain"
                  style={styles.similarImage}
                />
                <Text style={styles.similarName} numberOfLines={2}>
                  {item.name.replace('\n', ' ')}
                </Text>
                <Text style={styles.similarPrice}>
                  ₹{item.price.toFixed(2)}
                </Text>
                <Text style={styles.similarOldPrice}>
                  ₹{item.oldPrice.toFixed(2)}
                </Text>
                <RatingBadge rating={item.rating} reviews={item.reviews} />
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>

      <Modal
        visible={reviewModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback
            onPress={() => setReviewModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalCard}>
                  <Text style={styles.modalTitle}>Write a Review</Text>

                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() => setReviewRating(star)}
                      >
                        <Ionicons
                          name={star <= reviewRating ? 'star' : 'star-outline'}
                          size={28}
                          color="#F4B400"
                          style={styles.starIcon}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TextInput
                    placeholder="Title (optional)"
                    placeholderTextColor="#9A9A9A"
                    value={reviewTitle}
                    onChangeText={setReviewTitle}
                    style={styles.modalInput}
                    returnKeyType="next"
                  />

                  <TextInput
                    placeholder="Share your experience with this product"
                    placeholderTextColor="#9A9A9A"
                    value={reviewComment}
                    onChangeText={setReviewComment}
                    style={[styles.modalInput, styles.modalTextArea]}
                    multiline
                    returnKeyType="done"
                  />

                  <TouchableOpacity
                    style={[
                      styles.modalSubmitButton,
                      {
                        backgroundColor:
                          reviewComment.trim().length > 0
                            ? '#1C9C57'
                            : '#B5B5B5',
                      },
                    ]}
                    disabled={
                      reviewComment.trim().length === 0 || submittingReview
                    }
                    onPress={handleSubmitReview}
                  >
                    <Text style={styles.modalSubmitText}>
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width,
    height: 260,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 3,
  },
  dotActive: {
    width: 18,
    backgroundColor: '#444',
  },
  body: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  selectedQuantityLabel: {
    fontSize: 14,
    color: '#666',
  },
  quantityBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#222',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 8,
  },
  quantityBadgeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginTop: 14,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C9C57',
    marginRight: 10,
  },
  oldPrice: {
    fontSize: 15,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    marginTop: 20,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#1C9C57',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buyNowButton: {
    marginTop: 12,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: '#1C9C57',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyNowText: {
    color: '#1C9C57',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
    marginTop: 26,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 26,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deliveryText: {
    flex: 1,
    fontSize: 13,
    color: '#444',
    marginRight: 8,
  },
  changeText: {
    color: '#1C6FD9',
    fontWeight: '600',
    fontSize: 13,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1C6FD9',
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: '#E3F0FE',
  },
  addAddressText: {
    marginLeft: 6,
    color: '#1C6FD9',
    fontWeight: '600',
    fontSize: 14,
  },
  writeReviewText: {
    color: '#1C9C57',
    fontWeight: '700',
    fontSize: 14,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#E9FBF0',
    borderColor: '#B6EDCB',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 12,
  },
  stockText: {
    marginLeft: 8,
    color: '#1C9C57',
    fontWeight: '600',
    fontSize: 13,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 21,
  },
  reviewCard: {
    width: 260,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
    fontWeight: '700',
    marginRight: 4,
    color: '#222',
  },
  reviewDays: {
    fontSize: 12,
    color: '#888',
  },
  reviewTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: '#222',
    marginTop: 8,
  },
  reviewComment: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
    lineHeight: 19,
  },
  reviewAuthor: {
    fontSize: 12,
    color: '#888',
    marginTop: 10,
  },
  similarCard: {
    width: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  similarTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountBadge: {
    backgroundColor: '#1C9C57',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  similarImage: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginVertical: 10,
  },
  similarName: {
    fontSize: 13,
    color: '#222',
    lineHeight: 17,
    minHeight: 34,
  },
  similarPrice: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  similarOldPrice: {
    fontSize: 12,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 16,
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
  },
  starIcon: {
    marginHorizontal: 4,
  },
  modalInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#222',
    marginBottom: 14,
  },
  modalTextArea: {
    height: 90,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  modalSubmitButton: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
