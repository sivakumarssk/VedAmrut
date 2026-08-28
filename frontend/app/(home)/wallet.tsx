// import React, {
//   useCallback,
//   useState,
// } from "react";

// import {
//   ActivityIndicator,
//   Image,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// import {
//   SafeAreaView,
// } from "react-native-safe-area-context";

// import {
//   Ionicons,
// } from "@expo/vector-icons";

// import {
//   useFocusEffect,
// } from "expo-router";

// import ScreenHeader from "@/components/common/ScreenHeader";

// import {
//   API_BASE_URL,
// } from "@/constants/api";

// import {
//   getToken,
// } from "@/utils/storage";

// // =====================================================
// // TYPES
// // =====================================================

// type Wallet = {
//   id: number;
//   user_id: number;
//   balance: string | number;
//   created_at?: string;
//   updated_at?: string;
// };

// type WalletTransaction = {
//   id: number;
//   wallet_id: number;
//   user_id: number;
//   amount: string | number;
//   transaction_type:
//     | "CREDIT"
//     | "DEBIT";
//   description: string;
//   created_at: string;
//   current_balance?: string | number;
// };

// // =====================================================
// // HELPERS
// // =====================================================

// const formatAmount = (
//   amount: string | number
// ) => {
//   const value = Number(amount || 0);

//   return `₹${value.toFixed(2)}`;
// };

// const formatTransactionDate = (
//   dateString: string
// ) => {
//   try {
//     const date = new Date(dateString);

//     return date.toLocaleString(
//       "en-IN",
//       {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//       }
//     );
//   } catch {
//     return dateString;
//   }
// };

// // =====================================================
// // GET PRODUCT NAME FROM DESCRIPTION
// // =====================================================

// const getTransactionTitle = (
//   description: string
// ) => {
//   if (!description) {
//     return "Wallet Transaction";
//   }

//   if (
//     description.startsWith(
//       "QR reward - "
//     )
//   ) {
//     return description.replace(
//       "QR reward - ",
//       ""
//     );
//   }

//   return description;
// };

// // =====================================================
// // SCREEN
// // =====================================================

// export default function WalletScreen() {
//   const [wallet, setWallet] =
//     useState<Wallet | null>(null);

//   const [transactions, setTransactions] =
//     useState<WalletTransaction[]>([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [refreshing, setRefreshing] =
//     useState(false);

//   const [error, setError] =
//     useState<string | null>(null);

//   // ===================================================
//   // FETCH WALLET
//   // ===================================================

//   const fetchWallet = async (
//     showLoader = true
//   ) => {
//     try {
//       if (showLoader) {
//         setLoading(true);
//       }

//       setError(null);

//       const token =
//         await getToken();

//       console.log(
//         "================================"
//       );

//       console.log(
//         "FETCH WALLET"
//       );

//       console.log(
//         "TOKEN EXISTS:",
//         !!token
//       );

//       console.log(
//         "================================"
//       );

//       if (!token) {
//         setError(
//           "Please login to view your wallet."
//         );

//         return;
//       }

//       const response =
//         await fetch(
//           `${API_BASE_URL}/api/wallet`,
//           {
//             method: "GET",

//             headers: {
//               Authorization:
//                 `Bearer ${token}`,

//               "Content-Type":
//                 "application/json",
//             },
//           }
//         );

//       const json =
//         await response.json();

//       console.log(
//         "WALLET STATUS:",
//         response.status
//       );

//       console.log(
//         "WALLET RESPONSE:",
//         json
//       );

//       if (
//         response.status === 401
//       ) {
//         setError(
//           "Your session has expired. Please login again."
//         );

//         return;
//       }

//       if (
//         !response.ok ||
//         !json.success
//       ) {
//         throw new Error(
//           json.message ||
//             "Failed to fetch wallet"
//         );
//       }

//       setWallet(
//         json.data || null
//       );
//     } catch (error) {
//       console.error(
//         "FETCH WALLET ERROR:",
//         error
//       );

//       setError(
//         error instanceof Error
//           ? error.message
//           : "Unable to load wallet."
//       );
//     } finally {
//       if (showLoader) {
//         setLoading(false);
//       }
//     }
//   };

//   // ===================================================
//   // FETCH TRANSACTIONS
//   // ===================================================

//   const fetchTransactions = async () => {
//     try {
//       const token =
//         await getToken();

//       console.log(
//         "================================"
//       );

//       console.log(
//         "FETCH WALLET TRANSACTIONS"
//       );

//       console.log(
//         "================================"
//       );

//       if (!token) {
//         return;
//       }

//       const response =
//         await fetch(
//           `${API_BASE_URL}/api/wallet/transactions`,
//           {
//             method: "GET",

//             headers: {
//               Authorization:
//                 `Bearer ${token}`,

//               "Content-Type":
//                 "application/json",
//             },
//           }
//         );

//       const json =
//         await response.json();

//       console.log(
//         "TRANSACTIONS STATUS:",
//         response.status
//       );

//       console.log(
//         "TRANSACTIONS RESPONSE:",
//         json
//       );

//       if (
//         response.status === 401
//       ) {
//         return;
//       }

//       if (
//         !response.ok ||
//         !json.success
//       ) {
//         throw new Error(
//           json.message ||
//             "Failed to fetch transactions"
//         );
//       }

//       setTransactions(
//         Array.isArray(json.data)
//           ? json.data
//           : []
//       );
//     } catch (error) {
//       console.error(
//         "FETCH WALLET TRANSACTIONS ERROR:",
//         error
//       );

//       setTransactions([]);
//     }
//   };

//   // ===================================================
//   // LOAD EVERYTHING
//   // ===================================================

//   const loadWalletData =
//     async (
//       showLoader = true
//     ) => {
//       try {
//         if (showLoader) {
//           setLoading(true);
//         }

//         await Promise.all([
//           fetchWallet(false),
//           fetchTransactions(),
//         ]);
//       } finally {
//         if (showLoader) {
//           setLoading(false);
//         }
//       }
//     };

//   // ===================================================
//   // SCREEN FOCUS
//   // ===================================================

//   useFocusEffect(
//     useCallback(() => {
//       loadWalletData(true);
//     }, [])
//   );

//   // ===================================================
//   // PULL TO REFRESH
//   // ===================================================

//   const handleRefresh =
//     async () => {
//       try {
//         setRefreshing(true);

//         await loadWalletData(false);
//       } finally {
//         setRefreshing(false);
//       }
//     };

//   // ===================================================
//   // WALLET BALANCE
//   // ===================================================

//   const walletBalance =
//     Number(
//       wallet?.balance || 0
//     );

//   // ===================================================
//   // RECENT TRANSACTIONS
//   // ===================================================

//   const recentTransactions =
//     transactions.slice(0, 5);

//   // ===================================================
//   // LOADING
//   // ===================================================

//   if (loading) {
//     return (
//       <SafeAreaView
//         style={styles.safeArea}
//       >
//         <ScreenHeader
//           title="My Wallet"
//         />

//         <View
//           style={styles.loadingContainer}
//         >
//           <ActivityIndicator
//             size="large"
//             color="#1C9C57"
//           />

//           <Text
//             style={styles.loadingText}
//           >
//             Loading wallet...
//           </Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // ===================================================
//   // MAIN
//   // ===================================================

//   return (
//     <SafeAreaView
//       style={styles.safeArea}
//     >
//       <ScreenHeader
//         title="My Wallet"
//       />

//       <ScrollView
//         contentContainerStyle={
//           styles.scrollContent
//         }
//         showsVerticalScrollIndicator={
//           false
//         }
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={
//               handleRefresh
//             }
//             colors={[
//               "#1C9C57",
//             ]}
//             tintColor="#1C9C57"
//           />
//         }
//       >
//         {/* ============================================
//             ERROR
//         ============================================ */}

//         {error ? (
//           <View
//             style={styles.errorCard}
//           >
//             <Ionicons
//               name="alert-circle-outline"
//               size={30}
//               color="#D93025"
//             />

//             <Text
//               style={styles.errorText}
//             >
//               {error}
//             </Text>

//             <TouchableOpacity
//               style={
//                 styles.retryButton
//               }
//               onPress={() =>
//                 loadWalletData(true)
//               }
//             >
//               <Text
//                 style={
//                   styles.retryButtonText
//                 }
//               >
//                 Retry
//               </Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <>
//             {/* ========================================
//                 BALANCE CARD
//             ======================================== */}

//             <View
//               style={styles.balanceCard}
//             >
//               <View
//                 style={
//                   styles.balanceContent
//                 }
//               >
//                 <Text
//                   style={
//                     styles.balanceLabel
//                   }
//                 >
//                   Total Wallet Balance
//                 </Text>

//                 <Text
//                   style={
//                     styles.balanceValue
//                   }
//                 >
//                   {formatAmount(
//                     walletBalance
//                   )}
//                 </Text>

//                 <Text
//                   style={
//                     styles.balanceSubtext
//                   }
//                 >
//                   Available for wallet payments
//                 </Text>
//               </View>

//               <Image
//                 source={require(
//                   "../../src/assets/images/wallet.png"
//                 )}
//                 style={
//                   styles.balanceImage
//                 }
//                 resizeMode="contain"
//               />
//             </View>

//             {/* ========================================
//                 REWARD SUMMARY
//             ======================================== */}

//             <View
//               style={styles.rewardsRow}
//             >
//               <View
//                 style={
//                   styles.rewardsIcon
//                 }
//               >
//                 <Ionicons
//                   name="gift"
//                   size={25}
//                   color="#1C9C57"
//                 />
//               </View>

//               <View
//                 style={
//                   styles.rewardsInfo
//                 }
//               >
//                 <Text
//                   style={
//                     styles.rewardsLabel
//                   }
//                 >
//                   Wallet Rewards
//                 </Text>

//                 <Text
//                   style={
//                     styles.rewardsValue
//                   }
//                 >
//                   {formatAmount(
//                     walletBalance
//                   )}
//                 </Text>

//                 <Text
//                   style={
//                     styles.rewardsSubtitle
//                   }
//                 >
//                   Earned from product scans
//                 </Text>
//               </View>

//               <Ionicons
//                 name="wallet-outline"
//                 size={27}
//                 color="#1C9C57"
//               />
//             </View>

//             {/* ========================================
//                 TRANSACTIONS HEADER
//             ======================================== */}

//             <View
//               style={
//                 styles.sectionHeaderRow
//               }
//             >
//               <Text
//                 style={
//                   styles.sectionHeading
//                 }
//               >
//                 Recent Transactions
//               </Text>

//               {transactions.length >
//                 5 && (
//                 <TouchableOpacity
//                   onPress={() => {
//                     // You can navigate to a
//                     // full transactions screen later.
//                   }}
//                 >
//                   <Text
//                     style={
//                       styles.viewAllText
//                     }
//                   >
//                     View All
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </View>

//             {/* ========================================
//                 TRANSACTIONS
//             ======================================== */}

//             <View
//               style={
//                 styles.transactionsCard
//               }
//             >
//               {recentTransactions.length ===
//               0 ? (
//                 <View
//                   style={
//                     styles.emptyContainer
//                   }
//                 >
//                   <Ionicons
//                     name="receipt-outline"
//                     size={45}
//                     color="#BBBBBB"
//                   />

//                   <Text
//                     style={
//                       styles.emptyTitle
//                     }
//                   >
//                     No Transactions
//                   </Text>

//                   <Text
//                     style={
//                       styles.emptyText
//                     }
//                   >
//                     Your wallet transactions will appear here.
//                   </Text>
//                 </View>
//               ) : (
//                 recentTransactions.map(
//                   (
//                     item,
//                     index
//                   ) => {
//                     const isCredit =
//                       item.transaction_type ===
//                       "CREDIT";

//                     const amount =
//                       Number(
//                         item.amount ||
//                           0
//                       );

//                     const title =
//                       getTransactionTitle(
//                         item.description
//                       );

//                     return (
//                       <View
//                         key={
//                           item.id
//                         }
//                         style={[
//                           styles.transactionRow,
//                           index !==
//                             recentTransactions.length -
//                               1 &&
//                             styles.transactionRowBorder,
//                         ]}
//                       >
//                         {/* ICON */}

//                         <View
//                           style={[
//                             styles.transactionIcon,
//                             isCredit
//                               ? styles.creditIcon
//                               : styles.debitIcon,
//                           ]}
//                         >
//                           <Ionicons
//                             name={
//                               isCredit
//                                 ? "arrow-down"
//                                 : "arrow-up"
//                             }
//                             size={23}
//                             color={
//                               isCredit
//                                 ? "#1C9C57"
//                                 : "#D93025"
//                             }
//                           />
//                         </View>

//                         {/* INFO */}

//                         <View
//                           style={
//                             styles.transactionInfo
//                           }
//                         >
//                           <Text
//                             style={
//                               styles.transactionName
//                             }
//                             numberOfLines={
//                               1
//                             }
//                           >
//                             {title}
//                           </Text>

//                           <Text
//                             style={
//                               styles.transactionDescription
//                             }
//                             numberOfLines={
//                               1
//                             }
//                           >
//                             {
//                               item.description
//                             }
//                           </Text>

//                           <Text
//                             style={
//                               styles.transactionDate
//                             }
//                           >
//                             {formatTransactionDate(
//                               item.created_at
//                             )}
//                           </Text>
//                         </View>

//                         {/* AMOUNT */}

//                         <View
//                           style={
//                             styles.amountContainer
//                           }
//                         >
//                           <Text
//                             style={[
//                               styles.amountText,
//                               {
//                                 color:
//                                   isCredit
//                                     ? "#1C9C57"
//                                     : "#D93025",
//                               },
//                             ]}
//                           >
//                             {isCredit
//                               ? "+"
//                               : "-"}
//                             {formatAmount(
//                               amount
//                             )}
//                           </Text>

//                           <Text
//                             style={
//                               styles.transactionType
//                             }
//                           >
//                             {isCredit
//                               ? "CREDIT"
//                               : "DEBIT"}
//                           </Text>
//                         </View>
//                       </View>
//                     );
//                   }
//                 )
//               )}
//             </View>
//           </>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// // =====================================================
// // STYLES
// // =====================================================

// const styles =
//   StyleSheet.create({
//     safeArea: {
//       flex: 1,
//       backgroundColor:
//         "#F5F5F5",
//     },

//     scrollContent: {
//       paddingHorizontal: 20,
//       paddingBottom: 35,
//     },

//     loadingContainer: {
//       flex: 1,
//       justifyContent:
//         "center",
//       alignItems: "center",
//     },

//     loadingText: {
//       marginTop: 12,
//       fontSize: 15,
//       color: "#777777",
//     },

//     // ================================================
//     // ERROR
//     // ================================================

//     errorCard: {
//       backgroundColor:
//         "#FFFFFF",
//       borderRadius: 18,
//       padding: 25,
//       alignItems: "center",
//       marginTop: 20,
//     },

//     errorText: {
//       marginTop: 10,
//       textAlign: "center",
//       fontSize: 14,
//       color: "#555555",
//       lineHeight: 20,
//     },

//     retryButton: {
//       marginTop: 18,
//       paddingHorizontal: 28,
//       paddingVertical: 11,
//       borderRadius: 25,
//       backgroundColor:
//         "#1C9C57",
//     },

//     retryButtonText: {
//       color: "#FFFFFF",
//       fontSize: 14,
//       fontWeight: "700",
//     },

//     // ================================================
//     // BALANCE
//     // ================================================

//     balanceCard: {
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//       justifyContent:
//         "space-between",
//       backgroundColor:
//         "#E7F3EA",
//       borderRadius: 22,
//       paddingHorizontal: 20,
//       paddingVertical: 22,
//       marginBottom: 16,
//     },

//     balanceContent: {
//       flex: 1,
//     },

//     balanceLabel: {
//       fontSize: 15,
//       color: "#333333",
//     },

//     balanceValue: {
//       fontSize: 31,
//       fontWeight: "800",
//       color: "#1A1A1A",
//       marginTop: 6,
//     },

//     balanceSubtext: {
//       marginTop: 5,
//       fontSize: 12,
//       color: "#6F6F6F",
//     },

//     balanceImage: {
//       width: 110,
//       height: 95,
//     },

//     // ================================================
//     // REWARDS
//     // ================================================

//     rewardsRow: {
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//       backgroundColor:
//         "#FFFFFF",
//       borderRadius: 18,
//       paddingHorizontal: 16,
//       paddingVertical: 18,
//       marginBottom: 24,
//     },

//     rewardsIcon: {
//       width: 56,
//       height: 56,
//       borderRadius: 16,
//       backgroundColor:
//         "#DCF2E1",
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//       marginRight: 15,
//     },

//     rewardsInfo: {
//       flex: 1,
//     },

//     rewardsLabel: {
//       fontSize: 15,
//       color: "#333333",
//     },

//     rewardsValue: {
//       fontSize: 22,
//       fontWeight: "800",
//       color: "#1A1A1A",
//       marginTop: 2,
//     },

//     rewardsSubtitle: {
//       fontSize: 13,
//       color: "#777777",
//       marginTop: 2,
//     },

//     // ================================================
//     // SECTION
//     // ================================================

//     sectionHeaderRow: {
//       flexDirection:
//         "row",
//       justifyContent:
//         "space-between",
//       alignItems:
//         "center",
//       marginBottom: 12,
//     },

//     sectionHeading: {
//       fontSize: 19,
//       fontWeight: "700",
//       color: "#222222",
//     },

//     viewAllText: {
//       fontSize: 15,
//       fontWeight: "600",
//       color: "#1C9C57",
//     },

//     // ================================================
//     // TRANSACTIONS
//     // ================================================

//     transactionsCard: {
//       backgroundColor:
//         "#FFFFFF",
//       borderRadius: 18,
//       paddingHorizontal: 16,
//     },

//     transactionRow: {
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//       paddingVertical: 16,
//     },

//     transactionRowBorder: {
//       borderBottomWidth: 1,
//       borderBottomColor:
//         "#F0F0F0",
//     },

//     transactionIcon: {
//       width: 50,
//       height: 50,
//       borderRadius: 25,
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//       marginRight: 13,
//     },

//     creditIcon: {
//       backgroundColor:
//         "#E7F5EC",
//     },

//     debitIcon: {
//       backgroundColor:
//         "#FCEAEA",
//     },

//     transactionInfo: {
//       flex: 1,
//       minWidth: 0,
//     },

//     transactionName: {
//       fontSize: 15,
//       fontWeight: "700",
//       color: "#222222",
//     },

//     transactionDescription: {
//       fontSize: 11,
//       color: "#777777",
//       marginTop: 3,
//     },

//     transactionDate: {
//       fontSize: 11,
//       color: "#999999",
//       marginTop: 4,
//     },

//     amountContainer: {
//       alignItems:
//         "flex-end",
//       marginLeft: 8,
//     },

//     amountText: {
//       fontSize: 14,
//       fontWeight: "800",
//     },

//     transactionType: {
//       marginTop: 4,
//       fontSize: 9,
//       fontWeight: "700",
//       color: "#999999",
//       letterSpacing: 0.5,
//     },

//     // ================================================
//     // EMPTY
//     // ================================================

//     emptyContainer: {
//       paddingVertical: 45,
//       alignItems:
//         "center",
//     },

//     emptyTitle: {
//       marginTop: 12,
//       fontSize: 17,
//       fontWeight: "700",
//       color: "#333333",
//     },

//     emptyText: {
//       marginTop: 5,
//       fontSize: 13,
//       color: "#999999",
//       textAlign: "center",
//     },
//   });


import React, {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  router,
  useFocusEffect,
} from 'expo-router';

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
  const [wallet, setWallet] =
    useState<Wallet | null>(null);

  const [transactions, setTransactions] =
    useState<WalletTransaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [addingMoney, setAddingMoney] =
    useState(false);

  // ===================================================
  // LOAD WALLET
  // ===================================================

  const loadWallet = async () => {
    try {
      console.log(
        '================================'
      );

      console.log(
        'LOADING WALLET'
      );

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
  // ===================================================
  // CONTAINER
  // ===================================================

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ===================================================
  // LOADING
  // ===================================================

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
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
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
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
    fontWeight: '700',
    color: '#222222',
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
    color: '#E8FFF1',
    fontWeight: '500',
  },

  balanceAmount: {
    marginTop: 5,
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  balanceInfo: {
    marginTop: 7,
    fontSize: 12,
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
    fontWeight: '700',
  },

  developmentText: {
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 22,
    fontSize: 11,
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
    fontWeight: '700',
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
    fontWeight: '700',
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
    fontWeight: '600',
    color: '#222222',
  },

  transactionDate: {
    marginTop: 5,
    fontSize: 11,
    color: '#999999',
  },

  transactionAmount: {
    fontSize: 14,
    fontWeight: '800',
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
    fontWeight: '700',
    color: '#333333',
  },

  emptyText: {
    marginTop: 5,
    fontSize: 13,
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