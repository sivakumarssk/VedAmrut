-- =====================================================
-- cartModel.js has always relied on:
--
--   INSERT INTO carts (user_id) ... ON CONFLICT (user_id)
--   INSERT INTO cart_items (cart_id, product_id, quantity)
--     ... ON CONFLICT (cart_id, product_id)
--
-- but neither unique constraint was ever created, so every
-- add-to-cart request failed with:
--
--   "there is no unique or exclusion constraint matching
--    the ON CONFLICT specification"
--
-- This adds the two missing constraints the code already
-- assumes exist.
-- =====================================================

ALTER TABLE carts
  ADD CONSTRAINT carts_user_id_unique UNIQUE (user_id);

ALTER TABLE cart_items
  ADD CONSTRAINT cart_items_cart_product_unique
  UNIQUE (cart_id, product_id);
