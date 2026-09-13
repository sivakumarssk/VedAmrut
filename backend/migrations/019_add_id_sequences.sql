-- =====================================================
-- Every table was created with a plain
-- `id INTEGER PRIMARY KEY` and no default, but every
-- model in this app inserts without ever passing an id
-- (e.g. `INSERT INTO categories (name, description,
-- image) VALUES (...)`). That means every INSERT fails
-- with "null value in column id violates not-null
-- constraint" on a fresh database.
--
-- This migration attaches a real, auto-incrementing
-- sequence to id on every table, seeded to continue
-- after the current max(id) so existing rows are never
-- reused.
-- =====================================================

DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOR table_name IN
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      AND c.relname IN (
        'addresses',
        'cart_items',
        'carts',
        'categories',
        'guest_wallet_transactions',
        'guest_wallets',
        'notifications',
        'order_items',
        'orders',
        'otp_verifications',
        'product_qr_codes',
        'products',
        'qr_product_payments',
        'reviews',
        'users',
        'wallet_transactions',
        'wallets'
      )
  LOOP
    EXECUTE format(
      'CREATE SEQUENCE IF NOT EXISTS %I_id_seq OWNED BY %I.id',
      table_name,
      table_name
    );

    EXECUTE format(
      'ALTER TABLE %I ALTER COLUMN id SET DEFAULT nextval(''%I_id_seq'')',
      table_name,
      table_name
    );

    EXECUTE format(
      'SELECT setval(''%I_id_seq'', COALESCE((SELECT MAX(id) FROM %I), 0) + 1, false)',
      table_name,
      table_name
    );
  END LOOP;
END $$;
