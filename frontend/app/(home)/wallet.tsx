    
import React, { useCallback,useState,} from 'react';
import { ActivityIndicator,Alert, FlatList,RefreshControl,StyleSheet,Text,TouchableOpacity,View,} from 'react-native';
import {router,useFocusEffect,} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '@/constants/api';
import { getToken } from '@/utils/storage';

// =====================================================
// TYPES
// =====================================================

type Wallet = {
  id: number;
  user_id: number;
  balance: string | number;
  created_at?: string;
  updated_at?: string;
};

type WalletTransaction = {
  id: number;
  wallet_id: number;
  user_id: number;
  amount: string | number;
  transaction_type: 'CREDIT' | 'DEBIT';
  description: string;
  created_at: string;
};

// =====================================================
// SCREEN
// =====================================================

export default function WalletScreen() {
  const [wallet, setWallet] =useState<Wallet | null>(null);

  const [transactions, setTransactions] =useState<WalletTransaction[]>([]);

  const [loading, setLoading] =useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [addingMoney, setAddingMoney] =useState(false);

  // ===================================================
  // LOAD WALLET
  // ===================================================

  const loadWallet = async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.log(
          'WALLET: NO TOKEN'
        );
        setLoading(false);
        return;
      }

      // ===============================================
      // GET WALLET
      // ===============================================

      const walletResponse =
        await fetch(
          `${API_BASE_URL}/api/wallet`,
          {
            method: 'GET',
            headers: {
              Authorization:
                `Bearer ${token}`,
              'Content-Type':
                'application/json',
            },
          }
        );

      console.log(
        'WALLET API STATUS:',
        walletResponse.status
      );

      const walletResult =
        await walletResponse.json();

      console.log(
        'WALLET API RESPONSE:',
        walletResult
      );

      if (
        !walletResponse.ok ||
        !walletResult.success
      ) {
        throw new Error(
          walletResult.message ||
            'Failed to fetch wallet'
        );
      }

      setWallet(
        walletResult.data
      );

      // ===============================================
      // GET TRANSACTIONS
      // ===============================================

      const transactionResponse =
        await fetch(
          `${API_BASE_URL}/api/wallet/transactions`,
          {
            method: 'GET',
            headers: {
              Authorization:
                `Bearer ${token}`,
              'Content-Type':
                'application/json',
            },
          }
        );

      console.log(
        'TRANSACTIONS API STATUS:',
        transactionResponse.status
      );

      const transactionResult =
        await transactionResponse.json();

      console.log(
        'TRANSACTIONS API RESPONSE:',
        transactionResult
      );

      if (
        !transactionResponse.ok ||
        !transactionResult.success
      ) {
        throw new Error(
          transactionResult.message ||
            'Failed to fetch transactions'
        );
      }

      setTransactions(
        transactionResult.data || []
      );

      console.log(
        'WALLET LOADED SUCCESSFULLY'
      );

      console.log(
        '================================'
      );
    } catch (error: any) {
      console.error(
        'LOAD WALLET ERROR:',
        error
      );

      Alert.alert(
        'Wallet',
        error?.message ||
          'Unable to load wallet'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ===================================================
  // LOAD WHEN SCREEN OPENS
  // ===================================================

  useFocusEffect(
    useCallback(() => {
      loadWallet();
    }, [])
  );

  // ===================================================
  // REFRESH
  // ===================================================

  const handleRefresh = () => {
    setRefreshing(true);
    loadWallet();
  };

  // ===================================================
  // DEVELOPMENT ADD MONEY
  // ===================================================

  const handleAddDevelopmentMoney =
    async () => {
      try {
        setAddingMoney(true);

        const token =
          await getToken();

        if (!token) {
          Alert.alert(
            'Login Required',
            'Please login again.'
          );
          return;
        }

        // ---------------------------------------------
        // DEVELOPMENT AMOUNT
        // ---------------------------------------------

        const amount = 500;

        console.log(
          '================================'
        );

        console.log(
          'ADDING DEVELOPMENT MONEY'
        );

        console.log(
          'AMOUNT:',
          amount
        );

        const response =
          await fetch(
            `${API_BASE_URL}/api/wallet/add-money`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                amount,
              }),
            }
          );

        console.log(
          'ADD MONEY STATUS:',
          response.status
        );

        const result =
          await response.json();

        console.log(
          'ADD MONEY RESPONSE:',
          result
        );

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              'Failed to add money'
          );
        }

        Alert.alert(
          'Money Added',
          `₹${amount.toFixed(
            2
          )} added to your wallet.`
        );

        // ---------------------------------------------
        // REFRESH WALLET
        // ---------------------------------------------

        await loadWallet();
      } catch (error: any) {
        console.error(
          'ADD MONEY ERROR:',
          error
        );

        Alert.alert(
          'Error',
          error?.message ||
            'Failed to add money'
        );
      } finally {
        setAddingMoney(false);
      }
    };

  // ===================================================
  // FORMAT DATE
  // ===================================================

  const formatDate = (
    dateString: string
  ) => {
    try {
      const date =
        new Date(dateString);

      return date.toLocaleString(
        'en-IN',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }
      );
    } catch {
      return dateString;
    }
  };

  // ===================================================
  // TRANSACTION ITEM
  // ===================================================

  const renderTransaction = ({
    item,
  }: {
    item: WalletTransaction;
  }) => {
    const isCredit =
      item.transaction_type ===
      'CREDIT';

    const amount =
      Number(item.amount);

    return (
      <View
        style={styles.transactionCard}
      >
        {/* ICON */}

        <View
          style={[
            styles.transactionIcon,
            isCredit
              ? styles.creditIcon
              : styles.debitIcon,
          ]}
        >
          <Ionicons
            name={
              isCredit
                ? 'arrow-down'
                : 'arrow-up'
            }
            size={20}
            color={
              isCredit
                ? '#1C9C57'
                : '#D64545'
            }
          />
        </View>

        {/* DETAILS */}

        <View
          style={
            styles.transactionDetails
          }
        >
          <Text
            style={
              styles.transactionDescription
            }
            numberOfLines={2}
          >
            {item.description}
          </Text>

          <Text
            style={
              styles.transactionDate
            }
          >
            {formatDate(
              item.created_at
            )}
          </Text>
        </View>

        {/* AMOUNT */}

        <Text
          style={[
            styles.transactionAmount,
            isCredit
              ? styles.creditAmount
              : styles.debitAmount,
          ]}
        >
          {isCredit ? '+' : '-'}₹
          {amount.toFixed(2)}
        </Text>
      </View>
    );
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#1C9C57"
        />

        <Text
          style={styles.loadingText}
        >
          Loading wallet...
        </Text>
      </View>
    );
  }

  // ===================================================
  // BALANCE
  // ===================================================

  const balance =
    Number(wallet?.balance || 0);

  // ===================================================
  // SCREEN
  // ===================================================

  return (
    <View style={styles.container}>
      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#222222"
          />
        </TouchableOpacity>

        <Text
          style={styles.headerTitle}
        >
          My Wallet
        </Text>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
        >
          <Ionicons
            name="refresh"
            size={22}
            color="#1C9C57"
          />
        </TouchableOpacity>
      </View>

      {/* =================================================
          CONTENT
      ================================================= */}

      <FlatList
        data={transactions}
        keyExtractor={(item) =>
          String(item.id)
        }
        renderItem={
          renderTransaction
        }
        showsVerticalScrollIndicator={
          false
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={
              handleRefresh
            }
            tintColor="#1C9C57"
          />
        }
        contentContainerStyle={
          styles.listContent
        }
        ListHeaderComponent={
          <>
            {/* =================================================
                BALANCE CARD
            ================================================= */}

            <View
              style={styles.balanceCard}
            >
              <View
                style={
                  styles.walletIconCircle
                }
              >
                <Ionicons
                  name="wallet"
                  size={28}
                  color="#FFFFFF"
                />
              </View>

              <Text
                style={styles.balanceLabel}
              >
                Available Balance
              </Text>

              <Text
                style={styles.balanceAmount}
              >
                ₹{balance.toFixed(2)}
              </Text>

              <Text
                style={styles.balanceInfo}
              >
                Use your wallet balance
                for orders
              </Text>
            </View>

            {/* =================================================
                DEVELOPMENT ADD MONEY
            ================================================= */}

            <TouchableOpacity
              style={
                styles.addMoneyButton
              }
              onPress={
                handleAddDevelopmentMoney
              }
              disabled={addingMoney}
            >
              {addingMoney ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <>
                  <Ionicons
                    name="add-circle-outline"
                    size={22}
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.addMoneyText
                    }
                  >
                    Add ₹500
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <Text
              style={
                styles.developmentText
              }
            >
              Development mode only
            </Text>

            {/* =================================================
                TRANSACTIONS TITLE
            ================================================= */}

            <View
              style={
                styles.transactionHeader
              }
            >
              <Text
                style={
                  styles.transactionTitle
                }
              >
                Transaction History
              </Text>

              <Text
                style={
                  styles.transactionCount
                }
              >
                {transactions.length}
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View
            style={
              styles.emptyTransactions
            }
          >
            <View
              style={
                styles.emptyIconCircle
              }
            >
              <Ionicons
                name="receipt-outline"
                size={30}
                color="#999999"
              />
            </View>

            <Text
              style={
                styles.emptyTitle
              }
            >
              No transactions yet
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              Your wallet transactions
              will appear here.
            </Text>
          </View>
        }
        ListFooterComponent={
          <View
            style={styles.bottomSpace}
          />
        }
      />
    </View>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'InterRegular',
    color: '#777777',
  },

  // ===================================================
  // HEADER
  // ===================================================

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: '#EEEEEE',
    marginTop:30,
    backgroundColor: '#FFFFFF',
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontFamily: 'InterBold',
    color: '#222222',
    marginLeft:-120
  },

  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3FFF7',
  },

  // ===================================================
  // LIST
  // ===================================================

  listContent: {
    padding: 16,
    paddingBottom: 30,
  },

  // ===================================================
  // BALANCE CARD
  // ===================================================

  balanceCard: {
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    backgroundColor: '#1C9C57',
    marginBottom: 14,
  },

  walletIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,0.20)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  balanceLabel: {
    fontSize: 14,
    fontFamily: 'InterMedium',
    color: '#E8FFF1',
  },

  balanceAmount: {
    marginTop: 5,
    fontSize: 34,
    fontFamily: 'InterBold',
    color: '#FFFFFF',
  },

  balanceInfo: {
    marginTop: 7,
    fontSize: 12,
    fontFamily: 'InterRegular',
    color: '#DDF9E8',
  },

  // ===================================================
  // ADD MONEY
  // ===================================================

  addMoneyButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1C9C57',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addMoneyText: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'InterBold',
  },

  developmentText: {
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 22,
    fontSize: 11,
    fontFamily: 'InterRegular',
    color: '#999999',
  },

  // ===================================================
  // TRANSACTION HEADER
  // ===================================================

  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  transactionTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'InterBold',
    color: '#222222',
  },

  transactionCount: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E9F9F0',
    color: '#1C9C57',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
    fontFamily: 'InterBold',
    paddingTop: 7,
  },

  // ===================================================
  // TRANSACTION CARD
  // ===================================================

  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 14,
    padding: 13,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },

  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  creditIcon: {
    backgroundColor: '#E9F9F0',
  },

  debitIcon: {
    backgroundColor: '#FFF0F0',
  },

  transactionDetails: {
    flex: 1,
    marginLeft: 11,
    marginRight: 8,
  },

  transactionDescription: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#222222',
  },

  transactionDate: {
    marginTop: 5,
    fontSize: 11,
    fontFamily: 'InterRegular',
    color: '#999999',
  },

  transactionAmount: {
    fontSize: 14,
    fontFamily: 'InterBold',
  },

  creditAmount: {
    color: '#1C9C57',
  },

  debitAmount: {
    color: '#D64545',
  },

  // ===================================================
  // EMPTY
  // ===================================================

  emptyTransactions: {
    alignItems: 'center',
    paddingVertical: 50,
  },

  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 16,
    fontFamily: 'InterBold',
    color: '#333333',
  },

  emptyText: {
    marginTop: 5,
    fontSize: 13,
    fontFamily: 'InterRegular',
    color: '#999999',
    textAlign: 'center',
  },

  // ===================================================
  // BOTTOM
  // ===================================================

  bottomSpace: {
    height: 30,
  },
});